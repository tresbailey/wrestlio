"""
This module is used for interacting with the Mongo DB/redis and the python models
"""


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


