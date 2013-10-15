import json
import requests
from flask import Blueprint, render_template, send_from_directory, request, jsonify, url_for, g, redirect, make_response
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask.ext.principal import identity_loaded, RoleNeed, UserNeed, Identity, identity_changed
from wrestling import app, lm, oid, HOME_URL, principal, redis_cli
from pymongo.objectid import ObjectId
from wrestling.models.wrestler import FacebookUser
from wrestling.views import remove_OIDs

auth = Blueprint('auth', __name__,
        template_folder='templates', static_folder='static')


def janrain_data():
    token = request.form['token']
    engage_api_params = dict(
        apiKey='5e722b1e7e55063c02424b0726a3af545af103ae',
        token=token
    )
    user_data = requests.get("https://takedown.rpxnow.com/api/v2/auth_info", params=engage_api_params)
    return json.loads(user_data.text)


@auth.route('/auth_callback', methods=['POST'])
def app_callback():
    auth_info = janrain_data()
    try:
        user = FacebookUser.query.filter(
                FacebookUser.open_id == {auth_info['profile']['providerSpecifier']: auth_info['profile']['identifier']}
            ).one()
    except Exception:
        return redirect('/static/pages/hotcatz.html')
    login_user(user, remember=True)
    g.user = user
    identity = Identity(user.mongo_id)
    identity_changed.send(app, identity=identity)
    return redirect('/static/pages/hotcatz.html')


@auth.route('/register_callback', methods=['POST'])
def register_callback():
    auth_info = janrain_data()
    user = FacebookUser.query.filter(
        FacebookUser.confirm_code == request.cookies['confirmation_code']
        ).one()
    user.referred_name=auth_info['profile']['displayName']
    user.open_id={auth_info['profile']['providerSpecifier']: auth_info['profile']['identifier']}
    user.role='coach'
    user.photo=auth_info['profile']['photo']
    user.save()
    login_user(user, remember=True)
    g.user = user
    identity = Identity(user.mongo_id)
    identity_changed.send(app, identity=identity)
    return redirect('/static/pages/hotcatz.html')


@lm.user_loader
def get_user_obj(id):
    return  FacebookUser.query.filter(
        FacebookUser.mongo_id == ObjectId(id)
        ).one()


@auth.route('/login', methods=['GET', 'POST'])
@oid.loginhandler
def login():
    if current_user is not None and current_user.is_authenticated():
        return redirect(HOME_URL +'/static/pages/hotcatz.html')
    response = make_response(redirect(HOME_URL + '/static/pages/login.html'))
    response.headers['Next'] = request.args['next']
    return response


@auth.route('/me', methods=['GET'])
def get_me():
    return json.dumps(current_user.clean4_dump())


@auth.route('/users', methods=['POST'])
def create_user():
    user = FacebookUser(**request.data)
    defined_school = redis_cli.hget('coach_confirmation', user.confirm_code)
    if defined_school == user.school_id:
        user.role = 'coach'
        user.save()
    else: 
        abort(400)
    response = make_response(json.dumps(user, default=remove_OIDs))
    response.set_cookie('confirmation_code', user.confirm_code)
    return response

@identity_loaded.connect
def on_identity_loaded(sender, identity):
    logged_in = FacebookUser.query.filter(
        FacebookUser.mongo_id == ObjectId(identity.id)
        ).one()
    identity.user = logged_in
    if hasattr(logged_in, 'mongo_id'):
        identity.provides.add(UserNeed(logged_in.mongo_id))
    if hasattr(logged_in, 'role'):
        identity.provides.add(RoleNeed(logged_in.role))
