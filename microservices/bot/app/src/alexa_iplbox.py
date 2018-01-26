from src import app
from flask_ask import Ask, statement
import os
import requests
import json

PRODUCTION_ENV = os.environ.get('PRODUCTION')
CLUSTER_NAME = os.environ.get('CLUSTER_NAME')

if CLUSTER_NAME == None:
    print('export environment variable CLUSTER_NAME')

@app.route('/')
@app.route('/index')
def home():
    return 'Alexa IPLBox is running now.'


ask = Ask(app, '/')

@ask.launch
def handle_launch():
    welcome_text = 'Welcome to IPL Box... Ask me anything about the Indian Premier League...'
    return statement(welcome_text)


@ask.intent('GetWinnerIntent')
@app.route('/lsls')
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
    if PRODUCTION_ENV == True:
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
    print(json_response) # for testing purpose
    if 'result' in json_response:
        if len(json_response['result']) > 1: # check if result is actually available
            winner = json_response['result'][1][0]
            answer = 'IPL Box tells me that the {} season of Indian Premier League was won by {}'.format(season, winner)
        else:
            answer = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
    else:
        answer = 'Sorry, I couldn\'t find any IPL season in year... {}'.format(season)
    return statement(answer)
