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
        actions: []
    },

});
var Match = Backbone.Model.extend({
    default: {
        id: "",
        date: "",
        schools: [],
        scores: [],
        bouts: []
    }
});

var Clock = Backbone.Model.extend({
    default: {
        total: 120,
        left: 120,
        timeout_keeper: "",
    }
});
