import os
import json
from flask_ask import Ask, statement
from flask_ask import request as flask_ask_request
from flask import render_template, make_response, request, url_for, jsonify
import requests
from src import app

PRODUCTION_ENV = os.environ.get('PRODUCTION')
CLUSTER_NAME = os.environ.get('CLUSTER_NAME')

if CLUSTER_NAME is None:
    print('CLUSTER_NAME not found. Please export environment variable CLUSTER_NAME=<name_of_your_hasura_cluster>')


ask = Ask(app, '/alexa-iplbox')

# Store latest log data as dict. TODO: Update this
query_log = {
    'timestamp': None,
    'query_text': None,
    'answer': None,
    'response_time': None,
    'is_error_occured': None
}


@app.route('/')
@app.route('/index')
def home():
    return 'Alexa IPLBox is running now.'


@ask.launch
def handle_launch():
    welcome_text = 'Welcome to IPL Box... Ask me anything about the Indian Premier League...'
    return statement(welcome_text)


@ask.intent('GetWinnerIntent')
def get_winner(season):
    # SEASON_WORD_TO_YEAR = {
    #     '1st': 2008,
    #     '2nd': 2009,
    #     '3rd': 2010,
    #     '4th': 2011,
    #     '5th': 2012,
    #     '6th': 2013,
    #     '7th': 2014,
    #     '8th': 2015,
    #     '9th': 2016,
    #     '10th': 2017
    # }
    # if season_word:
    #     season = SEASON_WORD_TO_YEAR[season_word]
    # else:
    #     season = season_numeric
    if PRODUCTION_ENV:
        data_url = "http://data.hasura/v1/query"
    else:
        data_url = "https://data." + CLUSTER_NAME + ".hasura-app.io/v1/query"
    headers = {
        "Content-Type": "application/json",
        "Authorization": os.environ.get('DATA_ADMIN_TOKEN')
    }
    body = {
        "type": "run_sql",
        "args": {
            "sql": "SELECT DISTINCT ON (season) winner \
                    FROM matches \
                    WHERE season={} \
                    ORDER BY season, date DESC;".format(season)
        }
    }
    response = requests.request('POST', data_url, data=json.dumps(body), headers=headers)
    json_response = response.json()
    # print(json_response) # for testing purpose
    is_error_occured = False
    if 'result' in json_response:
        if len(json_response['result']) > 1: # check if result is actually available
            winner = json_response['result'][1][0]
            answer = 'IPL Box tells me that the {} season of Indian Premier League was won by {}'.format(season, winner)
        else:
            answer = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
            is_error_occured = True
    else:
        answer = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
        is_error_occured = True
    log_payload = {
        'timestamp': str(flask_ask_request.timestamp),
        'query_text': 'Which team won the IPL in {}'.format(season), # Hardcoded value, TODO: update this
        'answer': answer,
        'response_time': response.elapsed.total_seconds(),
        'is_error_occured': is_error_occured
    }
    requests.put(url_for('/logs'), data=jsonify(log_payload)) # make a PUT request to /logs to update new log value
    return statement(answer)


@app.route('/logs', methods=['GET', 'PUT'])
def send_log():
    '''Send logs to /logs endpoint'''
    if request.method == 'GET':
        return jsonify(query_log)
    elif request.method == 'PUT':
        for key, value in request.get_json().items():
            query_log[key] = value
        return 'Successfully updated log', 200
