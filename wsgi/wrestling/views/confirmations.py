from sets import Set
import pickle
import sys
import uuid
from datetime import datetime
from functools import partial
from flask import Module, render_template, request, jsonify, \
    url_for, session, redirect, abort
from flask.ext.login import login_required
from pymongo import Connection
from pymongo.objectid import ObjectId
from wrestling import db, redis_cli, coach_permission
from wrestling.logs import log
from wrestling.models.wrestler import WrestlingDocument, \
    Wrestler, Schools, Match, Bout, RoundActivity, \
    FacebookUser
from wrestling.storage import redis_save, mongo_q, redis_q
from wrestling.storage.school import find_school, append_schedule, get_school_by_list
from wrestling.storage.wrestler import wrestler_object
from wrestling.views import remove_OIDs
import json

confirms = Module(__name__)



@confirms.route('/confirmation_codes/<object_id>', methods=['POST'])
def create_confirmation_code(object_id):
    new_code = uuid.uuid4()
    redis_cli.hset('coach_confirmation', str(new_code), object_id)
    return json.dumps(dict(object_id=object_id, confirmation_code=new_code), default=remove_OIDs)


@confirms.route('/confirmation_codes/<object_id>', methods=['GET'])
def get_confirmation_code(object_id):
    confirmations = redis_cli.hgetall('coach_confirmation')
    match = [key for key, value in confirmations.items() if value == object_id]
    return match[0]
