
'''
Created on Sep 2, 2011

@author: tres
'''
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
from wrestling.storage.match import add_qparam_searches, reassign_activity, reassign_bout, reassign_activity, find_bout, find_match
from wrestling.storage.school import find_school, append_schedule, get_school_by_list
from wrestling.storage.wrestler import wrestler_object
from wrestling.views import remove_OIDs
import json

api = Module(__name__)


@api.route('/', methods=['GET'])
def get_all_schools():
    log.debug("Looking for all schools")
    pickle_oad = lambda str_val: pickle.loads(str_val) if str_val is not None else mongo_q
    if request.args.get('qschoolId'):
        all_schools = redis_q()
        all_schools = pickle_oad(all_schools)
        
    else:
        all_schools = mongo_q()
    return json.dumps( all_schools, default=remove_OIDs )
    


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['GET'])
def show_school_info(competition, area, size, conference, school_name):
    log.debug( "Got a request for finding school: "+ school_name)
    try:
        school = find_school(**request.view_args)
        return json.dumps( school, default=remove_OIDs )
    except:
        log.error("Unexpected error:", sys.exc_info()[0])
        raise

@api.route('/schools/<school_list>', methods=['GET'])
def get_school_list( school_list ):
    """
    Receives a query for a list of schools 
    """
    school_list = [ObjectId(school) for school in school_list.split(",")]
    all_schools = get_school_by_list(school_list)
    if request.args.get('qschedule'):
        all_schools = [ append_schedule(school)
            for school in all_schools]
    return json.dumps( all_schools, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['PUT'])
def create_school(competition, area, size, conference, school_name):
    school = Schools( **dict(request.data.items() + request.view_args.items()) )
    school._id = ObjectId()
    school.wrestlers = dict([ ( wrestler.get('wrestler_id'), wrestler_object(Wrestler(**wrestler))) for wrestler in school.wrestlers])
    school.save()
    redis_save(remove_OIDs(school), school.school_name, value_fields=(school.competition, school.area, school.size, 
        school.conference), store_func='rpush')
    defined_school = redis_cli.hset('coach_confirmation', uuid.uuid4(), school.mongo_id)
    return json.dumps( school, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>/wrestlers', methods=['GET'])
def show_all_wrestlers(competition, area, size, conference, school_name):
    school = find_school(**request.view_args)
    return json.dumps( school.wrestlers.values(), default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>/<wrestler_id>/', methods=['GET'])
def show_wrestler_info(competition, area, size, conference, school_name, wrestler_id):
    school = find_school(**request.view_args)
    wrestler = school.wrestlers.get(ObjectId(wrestler_id),
            None)
    return json.dumps( wrestler, default=remove_OIDs )

@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['POST'])
@coach_permission.require(http_exception=403)
@login_required
def create_wrestler(competition, area, size, conference, school_name):
    school = find_school(**request.view_args)
    json_data = request.data
    wrestler = Wrestler( **json_data )
    wrestler = wrestler_object(wrestler)
    try:
        school.__getattribute__("wrestlers")
    except AttributeError: 
        school.wrestlers = {}
    wrestler_dict = school.wrestlers
    wrestler_dict[wrestler.wrestler_id] = wrestler
    school.wrestlers = wrestler_dict
    school.save()
    return json.dumps( school, default=remove_OIDs )


@api.route('/matches', methods=['GET'])
def get_school_matches():
    query_params = request.args
    matches = add_qparam_searches( Match.query, query_params ).all()
    return json.dumps( matches, default=remove_OIDs )

@api.route('/matches', methods=['POST'])
@coach_permission.require(http_exception=403)
@login_required
def create_school_match():
    match = Match(**request.data)
    match.match_date = datetime.strptime(match.match_date, '%Y-%m-%d')
    match.home_school = prepare_school(match.home_school, ObjectId)
    match.visit_school = prepare_school(match.visit_school, ObjectId)
    match._id = ObjectId()
    bouts = []
    for bout in match.individual_bouts:
        bout = Bout( **bout )
        bout.bout_date =  datetime.strptime( bout.bout_date, '%Y-%m-%d' )
        bouts.append(bout)
    match.individual_bouts = bouts
    match.save()
    return json.dumps( match, default=remove_OIDs )


@api.route('/matches/<match_id>', methods=['PUT'])
@coach_permission.require(http_exception=403)
@login_required
def update_school_match(match_id):
    json_data = request.data
    match = Match( **json_data )
    match._id = ObjectId( match_id )
    match.schools = [ prepare_school(school) for school in match.schools ]
    match.individual_bouts = [ reassign_bout(bout) for bout in match.individual_bouts ]
    match.match_date = datetime.strptime(match.match_date, '%m/%d/%Y')
    match.save()
    return json.dumps( match, default=remove_OIDs)


@api.route('/matches/<match_id>', methods=['POST'])
@coach_permission.require(http_exception=403)
@login_required
def create_match_bout( match_id ):
    match = find_match( match_id )
    bout_data = request.data
    del bout_data['current_round']
    bout_data = reassign_bout( bout_data )
    match.individual_bouts.append( bout_data )
    match.save()
    return json.dumps( match, default=remove_OIDs)

@api.route('/matches/<match_id>', methods=['GET'])
def get_single_match(match_id):
    match = find_match( match_id)
    return json.dumps( match, default=remove_OIDs)


@api.route('/matches/<match_id>/<bout_id>', methods=['GET'])
def get_single_bout(match_id, bout_id):
    match = find_match( match_id )
    bout = find_bout( match, bout_id )
    return json.dumps( bout[0], default=remove_OIDs )


@api.route('/matches/<match_id>/<bout_id>/<wrestler_id>', methods=['POST'])
@coach_permission.require(http_exception=403)
@login_required
def save_wrestler_action(match_id, bout_id, wrestler_id, activity):
    """
    Good candidate to start using some memcache or redis here
    """
    match = find_match( match_id )
    bout = find_bout( match, bout_id )
    activity.actor = wrestler_id
    bout.rounds.append( activity )
    match.save()
    return json.dumps( activity, default=remove_OIDs )
