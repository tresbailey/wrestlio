from wrestling.views.api import get_local_user

class OAuthMiddleware(object):
    """
    WSGI middleware for handling facebook oauth
    """

    def __init__(self, application):
        self.application = application

    def __call__(self, environ, start_response):
        request_path = environ.get('PATH_INFO', '/')
        auth_header = environ.get('Authorization', '')
        authorized_user = get_local_user( auth_header )
        environ['LOGIN_USER'] = authorized_user
        app_iterator = self.application(environ, start_response)
        return app_iterator
