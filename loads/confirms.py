import json
import requests


def create_confirmation(school_id):
    response = requests.post('https://takedown-tresback.rhcloud.com/confirmation_codes/'+ school_id)
    print response

if __name__ == '__main__':
    all_schools = json.loads(requests.get('https://takedown-tresback.rhcloud.com/').text)
    [create_confirmation(school['id']) for school in all_schools]
