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


def wrestler_object(wrestler):
    wrestler.wrestler_id = ObjectId()
    wrestler.wins = int(wrestler.wins)
    wrestler.losses = int(wrestler.losses)
    wrestler.qualified_weight = int(wrestler.qualified_weight)
    wrestler.normal_weight = int(wrestler.normal_weight)
    return wrestler


