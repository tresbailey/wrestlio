import pickle
from flask import request, Module
from wrestling import redis_cli 
from wrestling.logs import log
from wrestling.views import remove_OIDs
from wrestling.storage import redis_save, mongo_q, redis_q
import json


statics = Module(__name__)

@statics.route('/staticData/<static_key>', methods=['PUT'])
def save_static_data(static_key):
    savee = request.data
    redis_cli.set(static_key, pickle.dumps(savee))
    return json.dumps( savee )


@statics.route('/staticData/<static_key>', methods=['GET'])
def get_static_data(static_key):
    if bool(request.args.get('qrefresh')):
        redis_cli.set('school_hash', pickle.dumps({}) )    
        [ redis_save(remove_OIDs(school), school.school_name, value_fields=(school.competition, school.area, school.size, 
            school.conference), store_func='rpush')
            for school in mongo_q()]
    lookup_value = redis_cli.get(static_key)
    lookup_value = pickle.loads(lookup_value) if lookup_value is not None else {}
    log.debug("GOt back a pickle: %s " % lookup_value)
    return json.dumps( lookup_value, default=remove_OIDs )

