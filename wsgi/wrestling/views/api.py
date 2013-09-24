
'''
Created on Sep 2, 2011

@author: tres
'''
from sets import Set
import pickle
import sys
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
import json

api = Module(__name__)


def remove_OIDs(obj, recursive=False):
    """
    Removes the ObjectID types from an object 
    before returning
    """
    if isinstance(obj, list):
        return [remove_OIDs(ob) for ob in obj]
    elif isinstance(obj, WrestlingDocument):
        return obj.clean4_dump()


def find_school(competition="", area="", size="", conference="", school_name="", **kwargs):
    return Schools.query.filter( *(Schools.competition == competition,
        Schools.area == area,
        Schools.size == size,
        Schools.conference == conference,
        Schools.school_name == school_name) ).one()


def redis_save(savee, key_field='', value_fields=(), serializer=str, deserializer=dict, store_func=set):
    loaded_str = redis_cli.get('school_hash')
    hashed = pickle.loads(loaded_str) if loaded_str is not None else {}
    dlist_keys = lambda obj, key: {key: obj}
    if hasattr(savee, '_field_values'):
        savee = savee._field_values
    base = [savee]
    for keyf in reversed(value_fields):
        base = dlist_keys(base, keyf)
    search = hashed
    for keyf in value_fields:
        if keyf not in search:
            search[keyf] = base[keyf]
        elif isinstance(base[keyf], list):
            search[keyf] = base[keyf] + search[keyf] if base[keyf] != search[keyf] else search[keyf]
        search = search[keyf]
        base = base[keyf]
    savee['_id'] =  str(savee['_id'])
    redis_cli.set('school_hash', pickle.dumps(hashed) )    
    return base
   

mongo_q = lambda: Schools.query.all()
redis_q = lambda: redis_cli.get('school_dict')


@api.route('/staticData/<static_key>', methods=['PUT'])
def save_static_data(static_key):
    savee = request.data
    redis_cli.set(static_key, pickle.dumps(savee))
    return json.dumps( savee )


@api.route('/staticData/<static_key>', methods=['GET'])
def get_static_data(static_key):
    if bool(request.args.get('qrefresh')):
        [ redis_save(remove_OIDs(school), school.school_name, value_fields=(school.competition, school.area, school.size, 
            school.conference), store_func='rpush')
            for school in mongo_q()]
    lookup_value = redis_cli.get(static_key)
    lookup_value = pickle.loads(lookup_value) if lookup_value is not None else {}
    log.debug("GOt back a pickle: %s " % lookup_value)
    return json.dumps( lookup_value, default=remove_OIDs )


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

get_school_by_list = lambda sclist: Schools.query.filter(Schools._id.in_(*sclist)).all()

def append_schedule(school):
    all_matches = Match.query.or_(Match.home_school == school._id,
        Match.visit_school == school._id).all()
    pick_other = lambda match: match.home_school if school._id == match.visit_school else match.visit_school
    school_list = Set( [pick_other(match) for match in all_matches] )
    schools_full = dict([(school._id, school.school_name) for school in get_school_by_list( school_list )])
    for match in all_matches:
        # Replace the school id with the school repr if its in schools_full
        # which means its not equal to this school.  if not found just id will be there
        match.home_school = schools_full.get(match.home_school, match.home_school)
        match.visit_school = schools_full.get(match.visit_school, match.visit_school)
    school.schedule = all_matches
    return school

@api.route('/schools/<school_list>', methods=['GET'])
@coach_permission.require(http_exception=403)
@login_required
def get_school_list( school_list ):
    """
    Receives a query for a list of schools 
    """
    school_list = [ObjectId(school) for school in school_list.split(",")]
    #all_schools = Schools.query.filter(Schools._id.in_(*school_list)).all()
    all_schools = get_school_by_list(school_list)
    if request.args.get('qschedule'):
        all_schools = [ append_schedule(school)
            for school in all_schools]
        custom_def = lambda x: [dict(schedule=remove_OIDs(school.schedule), 
            **remove_OIDs(school)) 
            for school in x]
        return json.dumps( custom_def(all_schools) )
    return json.dumps( all_schools, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['PUT'])
def create_school(competition, area, size, conference, school_name):
    json_data = dict(dict(**request.data), **request.view_args)
    school = Schools( **json_data )
    school._id = ObjectId()
    school.wrestlers = dict([ ( wrestler.get('wrestler_id'), prepare_wrestler(Wrestler(**wrestler))) for wrestler in school.wrestlers])
    school.save()
    redis_save(remove_OIDs(school), school.school_name, value_fields=(school.competition, school.area, school.size, 
        school.conference), store_func='rpush')
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

def prepare_wrestler(wrestler):
    wrestler.wrestler_id = ObjectId()
    wrestler.wins = int(wrestler.wins)
    wrestler.losses = int(wrestler.losses)
    wrestler.qualified_weight = int(wrestler.qualified_weight)
    wrestler.normal_weight = int(wrestler.normal_weight)
    return wrestler


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['POST'])
def create_wrestler(competition, area, size, conference, school_name):
    school = find_school(**request.view_args)
    json_data = request.data
    wrestler = Wrestler( **json_data )
    wrestler = prepare_wrestler(wrestler)
    try:
        school.__getattribute__("wrestlers")
    except AttributeError: 
        school.wrestlers = {}
    wrestler_dict = school.wrestlers
    wrestler_dict[wrestler.wrestler_id] = wrestler
    school.wrestlers = wrestler_dict
    school.save()
    return json.dumps( school, default=remove_OIDs )


def prepare_school( school, converter=str ): 
    school = converter(school)
    return school


def add_qparam_searches( query, query_params, school_param='qschool' ):
    filter_list = list()
    if query_params.has_key( school_param ):
        query = query.or_( Match.home_school == ObjectId(query_params.get(school_param)),
                Match.visit_school == ObjectId(query_params.get(school_param)) )
    if query_params.has_key('qdate'):
        filter_list.append( Match.match_date == 
            datetime.strptime(query_params.get('qdate'),
                '%m/%d/%Y'))
    return query.filter( *filter_list )
   

@api.route('/matches', methods=['GET'])
def get_school_matches():
    query_params = request.args
    matches = add_qparam_searches( Match.query, query_params ).all()
    return json.dumps( matches, default=remove_OIDs )

@api.route('/matches', methods=['POST'])
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


def reassign_activity(activity_dict):
    activity = RoundActivity(**activity_dict)
    activity.activity_id = ObjectId(activity_dict.get('activity_id'))
    activity.point_value = activity.activity_value.get(activity.activity_type)
    activity.action_time = int(activity.action_time)
    return activity


def reassign_bout(bout):
    #bout['bout_date'] = datetime.strptime(bout.get('bout_date'), '%m-%d-%Y') if bout.has_key('bout_date') else None
    bout['bout_date'] = datetime.fromtimestamp(bout.get('bout_date')/1000)
    bout['winner'] = ObjectId( bout.get('winner') )
    bout = Bout(**bout)
    bout.bout_id = ObjectId()
    bout.actions = [ reassign_activity(activity) for activity in bout.actions ]
    return bout


@api.route('/matches/<match_id>', methods=['PUT'])
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
def create_match_bout( match_id ):
    match = find_match( match_id )
    bout_data = request.data
    del bout_data['current_round']
    bout_data = reassign_bout( bout_data )
    match.individual_bouts.append( bout_data )
    match.save()
    return json.dumps( match, default=remove_OIDs)

def find_match( match_id ):
    return Match.query.filter( Match._id == ObjectId(match_id) ).one()


def find_bout( match, bout_id ):
    return [bout for bout in match.individual_bouts 
            if bout.bout_id == ObjectId(bout_id) ]
    

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

