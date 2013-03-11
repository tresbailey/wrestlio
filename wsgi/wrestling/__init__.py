__author__ = 'tresback'

import json
import uuid
from flaskext.mongoalchemy import MongoAlchemy
from flask import Flask, request, url_for, session, flash,\
    render_template
import logging
from logging import handlers
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
    response.headers.add_header('Access-Control-Allow-Headers', 'Content-Type')
    print 'response headers are %s' % response.headers
    return response

#TODO move this back to storage.__init__
app.config['MONGOALCHEMY_SERVER'] = os.environ.get('OPENSHIFT_MONGODB_DB_HOST', 'localhost')
app.config['MONGOALCHEMY_PORT'] = int(os.environ.get('OPENSHIFT_MONGODB_DB_PORT', 27017))
app.config['MONGOALCHEMY_DATABASE'] = os.environ.get('MONGO_DB', 'wrestlerdb')
app.config['MONGOALCHEMY_SERVER_AUTH'] = False

db = MongoAlchemy(app)

from wrestling.views.api import api

handler = logging.handlers.RotatingFileHandler("wrestling.log")
log = logging.getLogger('wrestling')
log.setLevel("DEBUG")
log.addHandler( handler)
log.debug("First run of this....")

app.register_blueprint(api)

if __name__ == '__main__':
    app.run('127.0.0.1')
