from sets import Set
import pickle
import sys
import uuid
from datetime import datetime
from functools import partial
from pymongo import Connection
from pymongo.objectid import ObjectId
from wrestling import db, redis_cli, coach_permission
from wrestling.logs import log
from wrestling.models.wrestler import WrestlingDocument, \
    Wrestler, Schools, Match, Bout, RoundActivity, \
    FacebookUser
from wrestling.storage import redis_save, mongo_q, redis_q
from wrestling.views import remove_OIDs
import json


def find_school(competition="", area="", size="", conference="", school_name="", **kwargs):
    return Schools.query.filter( *(Schools.competition == competition,
        Schools.area == area,
        Schools.size == size,
        Schools.conference == conference,
        Schools.school_name == school_name) ).one()


get_school_by_list = lambda sclist: Schools.query.filter(Schools._id.in_(*sclist)).all()


def append_schedule(school):
    all_matches = Match.query.or_(Match.home_school == school._id,
        Match.visit_school == school._id).all()
    def pick_other(match):
        if match.home_school != school._id:
            return match.home_school
        return match.visit_school
    school_list = Set( [pick_other(match) for match in all_matches] )
    schools_full = dict([(sch._id, sch) for sch in get_school_by_list( school_list )])
    schools_full[school._id] = school
    for match in all_matches:
        # Replace the school id with the school repr if its in schools_full
        # which means its not equal to this school.  if not found just id will be there
        match.home_school = schools_full.get(match.home_school, match.home_school)
        match.home_school = match.home_school.clean4_dump()
        match.visit_school = schools_full.get(match.visit_school, match.visit_school)
        match.visit_school = match.visit_school.clean4_dump()
    school.schedule = all_matches
    return school


def prepare_school( school, converter=str ): 
    school = converter(school)
    return school


