import os
from setuptools import setup


setup(name='YourAppName', version='1.0',
      description='OpenShift Python-2.7 Community Cartridge based application',
      author='Your Name', author_email='ramr@example.org',
      url='http://www.python.org/sigs/distutils-sig/',

      #  Uncomment one or more lines below in the install_requires section
      #  for the specific client drivers/modules your application needs.
      install_requires=[ 'Flask==0.8', 'MongoAlchemy==0.11',
        'Werkzeug==0.8.3', 'Flask-Login==0.1.3',
        'Flask-OpenID==1.1.1', 'Flask-Principal==0.4.0', 'Flask-WTF==0.8.3',
        'pymongo==2.1.1', 'python-dateutil==1.5',
        'redis==2.4.11', 'simplejson==2.1.6', 
        'requests==1.2.3', 'requests-oauthlib==0.3.2',
        'wsgiref==0.1.2', 'python-openid==2.2.5', 'blinker==1.3',
        'Flask-MongoAlchemy==0.5.3', 'flask_oauth==0.12']
     )
