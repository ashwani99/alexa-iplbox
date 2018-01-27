import os
import json
from flask_ask import Ask, statement, request
from flask_socketio import SocketIO, emit
from flask import render_template
import requests
from src import app

PRODUCTION_ENV = os.environ.get('PRODUCTION')
CLUSTER_NAME = os.environ.get('CLUSTER_NAME')

if CLUSTER_NAME is None:
    print('export environment variable CLUSTER_NAME')

ask = Ask(app, '/alexa-iplbox')
socketio = SocketIO(app)

@app.route('/')
@app.route('/index')
def home():
    return 'Alexa IPLBox is running now.'


@socketio.on('connect', namespace='/')
def test_message():
    emit('connect', 'Server has connected.')


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
        "Authorization": "Bearer bfc401c26fed7dbc2d0657711ed5191a49909926cdda4093"
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
    send_log(
        str(request.timestamp),
        body['args']['sql'],
        answer,
        response.elapsed.total_seconds(),
        is_error_occured
    )
    return statement(answer)


def send_log(timestamp, query_text, response_text, response_time, is_error_occured):
    '''Send logging information through websocket'''
    query_log = {
        'timestamp': timestamp,
        'query_text': query_text,
        'response_text': response_text,
        'response_time': response_time,
        'is_error_occured': is_error_occured
    }
    socketio.emit('intentRequest', query_log, json=True)
