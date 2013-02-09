__author__ = 'tresback'

import json
import uuid
from flaskext.mongoalchemy import MongoAlchemy
from flask import Flask, request, url_for, session, flash,\
    render_template
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
    response.headers.add_header('Access-Control-Allow-Origin', '*')
    response.headers.add_header('Access-Control-Allow-Headers', 'Content-Type')
    print 'response headers are %s' % response.headers
    return response

#TODO move this back to storage.__init__
app.config['MONGOALCHEMY_SERVER'] = os.environ.get('MONGO_HOST', 'localhost')
app.config['MONGOALCHEMY_PORT'] = int(os.environ.get('MONGO_PORT', 27017))
app.config['MONGOALCHEMY_DATABASE'] = os.environ.get('MONGO_DB', 'wrestlerdb')
app.config['MONGOALCHEMY_SERVER_AUTH'] = False

db = MongoAlchemy(app)

from wrestling.views.api import api

app.register_blueprint(api)

if __name__ == '__main__':
    app.run('127.0.0.1')
