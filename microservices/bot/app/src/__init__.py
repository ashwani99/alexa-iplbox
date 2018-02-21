from flask import Flask
from flask_ask import Ask

app = Flask(__name__)
ask = Ask(app, '/alexa-iplbox')

from src import alexa_iplbox
