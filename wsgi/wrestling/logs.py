import logging
from logging import handlers

handler = logging.handlers.RotatingFileHandler("wrestling.log")
log = logging.getLogger('wrestling')
log.setLevel("DEBUG")
log.addHandler( handler)
