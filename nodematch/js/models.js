var Move = Backbone.Model.extend({
    default: {
        id: "",
        move_name: "",
        actor_value: 0,
        victim_value: 0,
        from_position: "",
        actor_effect: "TOP",
        victim_effect: "BOTTOM"
    }
});
var Wrestler = Backbone.Model.extend({
    default: {
        id: "",
        first_name: "",
        last_name: "",
        qualified_weight: "",
        normal_weight: "",
        wins: "",
        losses: "",
        available_moves: [],
        position: "NEUTRAL",
        points: 0,
        stalling_count: 0
    }
});
var School = Backbone.Model.extend({
    default: {
        id : "",
        competition : "",
        area : "",
        size : "",
        conference : "",
        school_name : "",
        city : "",
        county : "",
        wrestlers : []
    }
});
var Action = Backbone.Model.extend({
    default: {
        id: "",
        actor: "",
        action_time: 0,
        point_value: 0,
        activity_type: "",
        round_number: 1
    }
});
var Bout = Backbone.Model.extend({
    default: {
        id: "",
        weight_class: "",
        green_wrestler: new Wrestler(),
        red_wrestler: {},
        green_score: 0,
        red_score: 0,
        winner: "",
        win_type: "",
        bout_date: "",
        current_round: 1,
        actions: [],
        clock: {}
    },

});
var Match = Backbone.Model.extend({
    default: {
        id: "",
        date: "",
        home_school: "",
        visit_school: "",
        home_score: 0,
        visit_score: 0,
        individual_bouts: []
    }
});

var Clock = Backbone.Model.extend({
    default: {
        total: 120,
        left: 120,
        str_clock: "",
        timeout_keeper: "",
    }
});

( function() {
var parentSync = Backbone.sync;
Backbone.sync = function( method, model, options ) {
    options.error = function(xhr, status, error_message) {
        if ( xhr.status == 302 ) {
            console.log("Got a redirect");
        }
    }
    return parentSync(method, model, options);
}
})()

var Session = Backbone.Model.extend({
    default: {
        id: "",
        school_id: "",
        role: "",
        email: "",
        open_id: {},
        preferred_name: "",
        photo: "",
    }
});
