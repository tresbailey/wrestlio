from sets import Set
import pickle
import sys
import uuid
from datetime import datetime
from functools import partial
from pymongo import Connection
from pymongo.objectid import ObjectId
from wrestling import db, redis_cli
from wrestling.logs import log
from wrestling.models.wrestler import WrestlingDocument, \
    Wrestler, Schools, Match, Bout, RoundActivity, \
    FacebookUser
from wrestling.storage import redis_save, mongo_q, redis_q
import json


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
   

def reassign_activity(activity_dict):
    activity = RoundActivity(**activity_dict)
    activity.activity_id = ObjectId(activity_dict.get('activity_id'))
    activity.point_value = activity.activity_value.get(activity.activity_type)
    activity.action_time = int(activity.action_time)
    return activity


def reassign_bout(bout):
    bout['bout_date'] = datetime.fromtimestamp(bout.get('bout_date')/1000)
    bout['winner'] = ObjectId( bout.get('winner') )
    bout = Bout(**bout)
    bout.bout_id = ObjectId()
    bout.actions = [ reassign_activity(activity) for activity in bout.actions ]
    return bout


def find_match( match_id ):
    return Match.query.filter( Match._id == ObjectId(match_id) ).one()


def find_bout( match, bout_id ):
    return [bout for bout in match.individual_bouts 
            if bout.bout_id == ObjectId(bout_id) ]
    

