from datetime import datetime
from pymongo.objectid import ObjectId
from wrestling import db
from wrestling.models import WrestlingDocument
    
    
class RoundActivity(WrestlingDocument):

    activity_value = dict(
            takedown=2, switch=2,
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
    win_type = db.EnumField( db.StringField(), "PIN", "DECISION", "MAJOR_DECISION", "TECHNICAL_FALL", "FORFEIT", allow_none=True)
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
    schedule = db.AnythingField(required=False)


class Match(WrestlingDocument):
    _id = db.ObjectIdField()
    match_date = db.DateTimeField()
    home_school = db.ObjectIdField()
    visit_school = db.ObjectIdField()
    home_score = db.IntField()
    visit_score = db.IntField()
    individual_bouts = db.ListField( db.DocumentField( Bout ) )

    #def clean4_dump(self):
    #    """
    #    Removes the ObjectID types from an object 
    #    before returning
    #    """
    #    response = dict(self._field_values)
    #    response['match_id'] = str(self._id)
    #    response['home_school'] = str(self.home_school)
    #    response['visit_school'] = str(self.visit_school)
    #    response['match_date'] = self.match_date.strftime('%m/%d/%Y')
    #    response['_id'] = str(response['_id'])
    #    return response


class FacebookUser(WrestlingDocument):
    email = db.StringField(required=False)
    school_id = db.ObjectIdField(required=False)
    wrestler_id = db.ObjectIdField(required=False)
    roles = ( 'wrestler', 'coach', 'unmapped')
    role = db.EnumField( db.StringField(),
        *roles )
    open_id = db.DictField(db.StringField(), required=False)
    preferred_name = db.StringField(required=False)
    photo = db.StringField(required=False)
    confirm_code = db.StringField()
    first_name = db.StringField(required=False)
    last_name = db.StringField(required=False)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.mongo_id)
