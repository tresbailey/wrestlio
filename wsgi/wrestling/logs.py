import logging
from logging import handlers
import os

file_loc = os.path.poin(os.environ.get('OPENSHIFT_HOME_DIR', '.'), 'wrestling.log')
handler = logging.handlers.RotatingFileHandler(file_loc)
log = logging.getLogger('wrestling')
log.setLevel("DEBUG")
log.addHandler( handler)
