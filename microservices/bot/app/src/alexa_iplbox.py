import os
import json
from flask_ask import statement, question, session
from flask_ask import request as flask_ask_request
from flask import render_template, make_response, request, url_for, jsonify
import requests
from src import app, ask

PRODUCTION_ENV = os.environ.get('PRODUCTION')
CLUSTER_NAME = os.environ.get('CLUSTER_NAME')
ACCESS_TOKEN = os.environ.get('DATA_ADMIN_TOKEN')

if CLUSTER_NAME is None:
    print('CLUSTER_NAME not found. Please export environment variable CLUSTER_NAME=<name_of_your_hasura_cluster>')

if PRODUCTION_ENV:
    DATA_URL = "http://data.hasura/v1/query"
else:
    DATA_URL = "https://data." + CLUSTER_NAME + ".hasura-app.io/v1/query"


@app.route('/')
@app.route('/index')
def home():
    '''Dummy welcome text when API endpoint is accessed'''
    return 'Alexa IPLBox is running now.'


@ask.launch
def handle_launch():
    '''Handles LaunchRequest when the user invokes the skill with the invocation name'''
    welcome_text = 'Welcome to IPL Box... Ask me anything about the Indian Premier League...'
    return question(welcome_text)


@ask.intent('GetWinnerIntent')
def get_winner(season):
    '''Responds with the name of the winning team in a given year'''
    headers = {
        "Content-Type": "application/json",
        "Authorization": ACCESS_TOKEN
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
    response = requests.post(DATA_URL, data=json.dumps(body), headers=headers)
    json_response = response.json()
    session.attributes['is_error_occured'] = False # Setting default value to no errors occured
    if 'result' in json_response:
        if len(json_response['result']) > 1: # check if result is actually available
            winner = json_response['result'][1][0]
            session.attributes['query_response'] = 'IPL Box tells me that the {} season of Indian Premier League was won by {}'.format(season, winner)
        else:
            session.attributes['query_response'] = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
            session.attributes['is_error_occured'] = True
    else:
        session.attributes['query_response'] = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
        session.attributes['is_error_occured'] = True
    session.attributes['query_text'] = 'Which team won the IPL in {}'.format(season), # Hardcoded value, TODO: update this
    session.attributes['response_time'] = response.elapsed.total_seconds()
    update_log()
    return statement(session.attributes['query_response'])


def update_log():
    '''Logs the latest query/response to the database'''
    body = {
        'type': 'insert',
        'args': {
            'table': 'logs',
            'objects': [
                {
                    'user_id': session.user.userId,
                    'timestamp': flask_ask_request.timestamp.isoformat(),
                    'query_text': session.attributes['query_text'],
                    'query_response': session.attributes['query_response'],
                    'response_time': session.attributes['response_time'],
                    'is_error_occured': session.attributes['is_error_occured']
                }
            ]
        }
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": ACCESS_TOKEN
    }
    requests.post(DATA_URL, data=json.dumps(body), headers=headers)
