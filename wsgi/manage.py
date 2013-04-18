import os
from wrestling import app
from wrestling.middlewares.auth import OAuthMiddleware


if __name__ == '__main__':
    #application = OAuthMiddleware(app)
    app.run(host="localhost", port=5001)
