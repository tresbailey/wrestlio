var AppRouter = Backbone.Router.extend({
    routes: {
        "schedule/:school_id": "school_schedule",
        "facebook/:facebook_id": "user_login"
    }
});

var app_router = new AppRouter();


Backbone.history.start();
