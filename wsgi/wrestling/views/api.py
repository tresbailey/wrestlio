
'''
Created on Sep 2, 2011

@author: tres
'''
from datetime import datetime
from flask import Module, render_template, request, jsonify
from pymongo import Connection
from pymongo.objectid import ObjectId
from wrestling import db
from wrestling.models.wrestler import WrestlingDocument, \
    Wrestler, Schools, Match, Bout, RoundActivity
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


@api.route('/<competitionL>/', methods=['GET'])
def show_area_levels(competitionL):
    level_curs = CompetitionLevel.query.filter(CompetitionLevel.competition == competitionL ).one()
    return json.dumps( level_curs, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['GET'])
def show_school_info(competition, area, size, conference, school_name):
    school = find_school(**request.view_args)
    return json.dumps( school, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['PUT'])
def create_school(competition, area, size, conference, school_name):
    json_data = dict( json.loads(
        request.form.items()[0][0]),
        **request.view_args
    )
    school = Schools( **json_data )
    school.wrestlers = {}
    school.save()
    return json.dumps( school, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>/<wrestler_id>/', methods=['GET'])
def show_wrestler_info(competition, area, size, conference, school_name, wrestler_id):
    school = find_school(**request.view_args)
    wrestler = school.wrestlers.get(ObjectId(wrestler_id),
            None)
    return json.dumps( wrestler, default=remove_OIDs )


@api.route('/<competition>/<area>/<size>/<conference>/<school_name>', methods=['POST'])
def create_wrestler(competition, area, size, conference, school_name):
    school = find_school(**request.view_args)
    json_data = dict( json.loads(
        request.form.items()[0][0])
    )
    wrestler = Wrestler( **json_data )
    try:
        school.__getattribute__("wrestlers")
    except AttributeError: 
        school.wrestlers = {}
    wrestler.wrestler_id = ObjectId()
    wrestler_dict = school.wrestlers
    wrestler_dict[wrestler.wrestler_id] = wrestler
    school.wrestlers = wrestler_dict
    school.save()
    return json.dumps( school, default=remove_OIDs )


def prepare_school( school, converter=str ): 
    school = converter(school)
    return school
   

@api.route('/matches', methods=['GET'])
def get_school_matches():
    matches = Match.query.all()
    return json.dumps( matches, default=remove_OIDs )

@api.route('/matches', methods=['POST'])
def create_school_match():
    json_data = dict( json.loads(
        request.form.items()[0][0]))
    match = Match(**json_data)
    match.match_date = datetime.strptime(match.match_date, '%m/%d/%Y')
    match.schools = [ prepare_school(school, ObjectId) for school in match.schools ]
    bouts = []
    for bout in match.individual_bouts:
        bout = Bout( **bout )
        bout.bout_date =  datetime.strptime( bout.bout_date, '%m/%d/%Y' )
        bouts.append(bout)
    match.individual_bouts = bouts
    match.save()
    return json.dumps( match, default=remove_OIDs )


def reassign_activity(activity_dict):
    activity = RoundActivity(**activity_dict)
    activity.activity_id = ObjectId(activity_dict.get('activity_id'))
    activity.point_value = activity.activity_value.get(activity.activity_type)
    return activity


def reassign_bout(boutDict):
    bout = Bout(**boutDict)
    bout.bout_date = datetime.strptime(bout.bout_date, '%m/%d/%Y')
    bout.bout_id = ObjectId()
    bout.rounds = [ reassign_activity(activity) for activity in bout.rounds ]
    return bout


@api.route('/matches/<match_id>', methods=['PUT'])
def update_school_match(match_id):
    json_data = dict( json.loads(
        request.form.items()[0][0]))
    match = Match( **json_data )
    match._id = ObjectId( match_id )
    match.schools = [ prepare_school(school) for school in match.schools ]
    match.individual_bouts = [ reassign_bout(bout) for bout in match.individual_bouts ]
    match.match_date = datetime.strptime(match.match_date, '%m/%d/%Y')
    match.save()
    return json.dumps( match, default=remove_OIDs)


def find_match( match_id ):
    return Match.query.filter( Match._id == ObjectId(match_id) ).one()

@api.route('/matches/<match_id>', methods=['GET'])
def get_single_match(match_id):
    match = find_match( match_id)
    return json.dumps( match, default=remove_OIDs)


@api.route('/matches/<match_id>/<bout_id>', methods=['GET'])
def get_single_bout(match_id, bout_id):
    match = find_match( match_id )
    bout = [bout for bout in match.individual_bouts 
            if bout.bout_id == ObjectId(bout_id) ]
    return json.dumps( bout[0], default=remove_OIDs )
