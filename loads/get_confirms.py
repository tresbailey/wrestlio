import json
import requests


def show_confirmation(school):
    response = requests.get('http://takedown-tresback.rhcloud.com/confirmation_codes/'+ school['_id'])
    print school['school_name'], response.text

if __name__ == '__main__':
    all_schools = json.loads(requests.get('http://takedown-tresback.rhcloud.com/').text)
    print [show_confirmation(school) for school in all_schools]
