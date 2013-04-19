import os
from wrestling import app
from wrestling.middlewares.auth import OAuthMiddleware


if __name__ == '__main__':
    app.wsgi_app = OAuthMiddleware(app.wsgi_app)
    app.run(host="localhost", port=5001)
