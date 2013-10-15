
import json
import requests


def create_weights():
    response = requests.put('http://local.tresback.rhcloud.com:5001/staticData/hsWeightClasses', data=json.dumps([103, 112, 119, 125, 130, 135, 140, 145, 152, 160, 171, 189, 215, 285]))
    print response

if __name__ == '__main__':
    create_weights()
