import os
from setuptools import setup

fn = os.path.join(os.path.dirname(__file__), 'requirements.txt')
reqs_list = list()
with open(fn, 'r') as reqs:
    for line in reqs.readlines():
        reqs_list.append(line)


setup(name='YourAppName', version='1.0',
      description='OpenShift Python-2.7 Community Cartridge based application',
      author='Your Name', author_email='ramr@example.org',
      url='http://www.python.org/sigs/distutils-sig/',

      #  Uncomment one or more lines below in the install_requires section
      #  for the specific client drivers/modules your application needs.
      install_requires=reqs_list,
     )
