import os
import json
from flask_ask import Ask, statement, request
from flask import render_template, make_response, redirect, session
import requests
from src import app

PRODUCTION_ENV = os.environ.get('PRODUCTION')
CLUSTER_NAME = os.environ.get('CLUSTER_NAME')

if CLUSTER_NAME is None:
    print('CLUSTER_NAME not found. Please export environment variable CLUSTER_NAME=<name_of_your_hasura_cluster>')


ask = Ask(app, '/alexa-iplbox')


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
        "Authorization": os.environ.get()
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
    # set logs data into session values
    session.timestamp = str(request.timestamp)
    session.query_text = 'Which team won the IPL in {}'.format(season), # Hardcoded value, TODO: update this
    session.answer = answer
    session['response_time'] = response.elapsed.total_seconds()
    session['is_error_occured'] = is_error_occured
    return statement(answer)


@app.route('/logs', methods=['POST'])
def send_log():
    '''Send logs to /logs endpoint'''
    query_log = {
        'timestamp': session['timestamp'] if 'timestamp' in session else None,
        'query_text': session['query_text'] if 'query_text' in session else None,
        'response_text': session['response_text'] if 'response_text' in session else None,
        'response_time': session['response_time'] if 'response_time' in session else None,
        'is_error_occured': session['is_error_occured'] if 'is_error_occured' in session else None
    }
    response = make_response(json.dumps(query_log))
    response.headers['Content-Type'] = 'application/json'
    return response
