import json
import requests


def create_confirmation(school_id):
    response = requests.post('http://local.tresback.rhcloud.com:5001/confirmation_codes/'+ school_id)
    print response

if __name__ == '__main__':
    all_schools = json.loads(requests.get('http://local.tresback.rhcloud.com:5001/').text)
    [create_confirmation(school['_id']) for school in all_schools]
