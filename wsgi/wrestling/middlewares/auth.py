from wrestling.views.api import 


class OAuthMiddleware(object):
    """
    WSGI middleware for handling facebook oauth
    """

    def __init__(self, application):
        self.application = application

    def __call__(self, environ, start_response):
        request_path = environ.get('PATH_INFO', '/')
        app_iterator = self.application(environ, start_response)
        return app_iterator
