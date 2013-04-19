__author__ = 'tresback'

import json
import uuid
from flaskext.mongoalchemy import MongoAlchemy
from flask import Flask, request, url_for, session, flash,\
    render_template
from flask_oauth import OAuth
from wrestling.logs import log
import os

app = Flask(__name__)
app.debug = True


@app.before_request
def convert_json():
    if request.data and request.data is not None:
        request.data = json.loads(request.data)


@app.after_request
def add_headers(response):
    if isinstance(response.data, dict) or isinstance(response.data, list):
        response.headers['Content-Type'] = 'application/json'
    response.headers.add_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD')
    response.headers.add_header('Access-Control-Allow-Origin', '*')
    response.headers.add_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    print 'response headers are %s' % response.headers
    return response

#TODO move this back to storage.__init__
app.config['MONGOALCHEMY_SERVER'] = os.environ.get('OPENSHIFT_MONGODB_DB_HOST', 'localhost')
app.config['MONGOALCHEMY_PORT'] = int(os.environ.get('OPENSHIFT_MONGODB_DB_PORT', 27017))
app.config['MONGOALCHEMY_DATABASE'] = os.environ.get('MONGO_DB', 'wrestlerdb')
app.config['MONGOALCHEMY_USER'] = os.environ.get('OPENSHIFT_MONGODB_DB_USERNAME')
app.config['MONGOALCHEMY_PASSWORD'] = os.environ.get('OPENSHIFT_MONGODB_DB_PASSWORD')
app.config['MONGOALCHEMY_SERVER_AUTH'] = True

db = MongoAlchemy(app)


SECRET_KEY = 'wrestlio_key'
DEBUG = True
FACEBOOK_APP_ID = '273015446166960'
FACEBOOK_APP_SECRET = '181c18cae3bbed1c05359154124eab91'

app.debug = DEBUG
app.secret_key = SECRET_KEY
oauth = OAuth()

facebook = oauth.remote_app('facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=FACEBOOK_APP_ID,
    consumer_secret=FACEBOOK_APP_SECRET,
    request_token_params={'scope': 'email', 'type': 'user_agent'}
)

from wrestling.views.api import api

app.register_blueprint(api)

if __name__ == '__main__':
    app.run('127.0.0.1')
