from datetime import datetime
from pymongo.objectid import ObjectId
from wrestling import db

class WrestlingDocument(db.Document):

    def clean4_dump(self):
        """
        Removes the ObjectID types from an object 
        before returning
        """
        response = dict(self._field_values)
        for field in self._fields:
            try:
                field_value = self.__getattribute__(field)
                if isinstance(field_value, 
                        ObjectId):
                    response[field] = str(self.__getattribute__(field))
                elif isinstance( field_value, list):
                    field_value = [ value.clean4_dump() for 
                            value in field_value ]
                    response[field] = field_value
                elif isinstance( field_value,
                        dict):
                    field_value = dict( [ (str(key), value.clean4_dump()) for key, value in field_value.items() ])
                    response[field] = field_value
            except AttributeError:
                continue
        return response
    
    
class RoundActivity(WrestlingDocument):

    activity_value = dict(
            takedown=2, reversal=2,
            escape=1, backpoints=2,
            nearfall=3, stalling1=0,
            stalling2=1, stalling3=2)
    action_time = db.IntField()
    round_number = db.EnumField( db.IntField(),
            1, 2, 3, 4, 5 )
    actor = db.ObjectIdField()
    point_value = db.IntField()
    activity_id = db.ObjectIdField()
    activity_type = db.EnumField( db.StringField(), 
            *activity_value.keys() )
    

class Bout(WrestlingDocument):
    bout_id = db.ObjectIdField()
    weight_class = db.IntField()
    red_wrestler = db.ObjectIdField()
    green_wrestler = db.ObjectIdField()
    winner = db.ObjectIdField(allow_none=True)
    win_type = db.EnumField( db.StringField(), "PIN", "DECISION", "MAJOR_DECISION", "TECHNICAL_FALL", allow_none=True)
    red_score = db.IntField()
    green_score = db.IntField()
    bout_date = db.DateTimeField()
    actions = db.ListField( db.DocumentField( RoundActivity ) )
    

class Wrestler(WrestlingDocument):
    
    first_name = db.StringField()
    last_name = db.StringField()
    qualified_weight = db.IntField()
    normal_weight  = db.IntField()
    wins = db.IntField()
    losses = db.IntField()
    wrestler_id = db.ObjectIdField()
    

class Schools(WrestlingDocument):
    _id = db.ObjectIdField()
    competition = db.StringField()
    area = db.StringField()
    size = db.StringField()
    conference = db.StringField()
    school_name = db.StringField()
    city = db.StringField()
    county = db.StringField()
    wrestlers = db.KVField( db.ObjectIdField(), db.DocumentField( Wrestler ) )


class Match(WrestlingDocument):
    _id = db.ObjectIdField()
    match_date = db.DateTimeField()
    schools = db.ListField( db.ObjectIdField() )
    school_scores = db.ListField( db.IntField() )
    individual_bouts = db.ListField( db.DocumentField( Bout ) )

    def clean4_dump(self):
        """
        Removes the ObjectID types from an object 
        before returning
        """
        response = dict(self._field_values)
        response['match_id'] = str(self._id)
        response['schools'] = [str(value) for 
                value in self.schools]
        response['match_date'] = self.match_date.strftime('%m/%d/%Y')
        return response
