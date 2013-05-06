var AppRouter = Backbone.Router.extend({
    routes: {
        "schedule/:school_id": "school_schedule",
        "facebook/:facebook_id": "user_login",
        "match/:school_id/:opponent_id/:match_id": "show_match"
    }
});

var app_router = new AppRouter();


Backbone.history.start();
