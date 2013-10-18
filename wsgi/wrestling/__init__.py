__author__ = 'tresback'

import json
import redis
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

app.secret_key = str(uuid.uuid4())
DEBUG = True

redis_cli = redis.Redis(host=os.environ.get('OPENSHIFT_REDIS_HOST', 'localhost'), 
        port=int(os.environ.get('OPENSHIFT_REDIS_PORT', '6379')),
        password=os.environ.get('REDIS_PASSWORD', None))

import os
from flask.ext.login import LoginManager
from flask.ext.openid import OpenID
from flask.ext.principal import Principal, Permission, RoleNeed

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'auth.login'
oid = OpenID( app, os.path.join('', 'tmp'))

principal = Principal()

principal.init_app(app)

coach_permission = Permission(RoleNeed('coach'))

HOME_URL = 'http://local.tresback.rhcloud.com:5001'

from wrestling.views.api import api
app.register_blueprint(api)
from wrestling.views.auth import auth
app.register_blueprint(auth)
from wrestling.views.static import statics
app.register_blueprint(statics)
from wrestling.views.confirmations import confirms
app.register_blueprint(confirms)

if __name__ == '__main__':
    app.run('127.0.0.1')
