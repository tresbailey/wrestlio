"""
This module contains the python models for the MongoDB objects
"""
from pymongo.objectid import ObjectId
from wrestling import db

def json_clean(field_value):
    """
    Removes the ObjectID types from an object
    before returning
    """
    if isinstance(field_value,
            ObjectId):
        return str(field_value)
    elif isinstance( field_value,
            WrestlingDocument):
        return field_value.clean4_dump()
    elif isinstance( field_value, list) or isinstance( field_value, tuple):
        return [ json_clean(value) for value in field_value ]
    elif isinstance( field_value,
            dict):
        return dict( [ (str(key), json_clean(value)) for key, value in field_value.items() ])
    return field_value


class WrestlingDocument(db.Document):

    filter_fields = tuple()
 
    @classmethod
    def has_key(cls, key):
        return hasattr(cls, key)
 
    @classmethod
    def get(cls, key, default=None):
        return getattr(cls, key) or default
 
 
    def clean4_dump(self):
        """
        Removes the ObjectID types from an object
        before returning
        """
        response = dict(self._field_values)
        for field in self._fields:
            try:
                field_value = self.__getattribute__(field)
                if field == '_id': field = 'id'
                response[field] = field_value
                response[field] = json_clean(field_value)
            except AttributeError:
                continue
        response = dict([(key, value) for key, value in response.items() if key not in [field._name for field in self.filter_fields]])
        return response


