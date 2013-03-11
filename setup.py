import os
from setuptools import setup


setup(name='YourAppName', version='1.0',
      description='OpenShift Python-2.7 Community Cartridge based application',
      author='Your Name', author_email='ramr@example.org',
      url='http://www.python.org/sigs/distutils-sig/',

      #  Uncomment one or more lines below in the install_requires section
      #  for the specific client drivers/modules your application needs.
      install_requires=[
            Babel,
            Flask,
            Flask-MongoAlchemy,
            Flask-Uploads,
            Genshi,
            Jinja2,
            MongoAlchemy,
            Werkzeug,
            decorator,
            distribute,
            ethtool,
            firstboot,
            gps,
            iniparse,
            nose,
            pymongo,
            python-dateutil,
            redis,
            simplejson,
            virtualenv,
            wsgiref
          ]
     )
