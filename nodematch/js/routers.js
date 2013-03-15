var AppRouter = Backbone.Router.extend({
    routes: {
        "schedule/:school_id": "school_schedule"
    }
});

var app_router = new AppRouter();


Backbone.history.start();
