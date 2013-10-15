"""
Base module for all views for hotcatz
"""
from wrestling.models import WrestlingDocument

def remove_OIDs(obj, recursive=False):
    """
    Removes the ObjectID types from an object
    before returning
    """
    if isinstance(obj, list):
        return [remove_OIDs(ob) for ob in obj]
    elif isinstance(obj, WrestlingDocument):
        response = obj.clean4_dump()
        return response
