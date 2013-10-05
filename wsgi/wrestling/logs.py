import logging
from logging import handlers
import os

file_loc = os.path.join(os.environ.get('OPENSHIFT_HOME_DIR', '.'), 'python', 'logs',  'wrestling.log')
handler = logging.handlers.RotatingFileHandler(file_loc)
log = logging.getLogger('wrestling')
log.setLevel("DEBUG")
log.addHandler( handler)
