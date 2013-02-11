var Wrestler = Backbone.Model.extend({
    default: {
        id: "",
        first_name: "",
        last_name: "",
        qualified_weight: "",
        normal_weight: "",
        wins: "",
        losses: ""
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
        time: 0,
        value: 0,
        type: "",
        round: 1
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
        date: "",
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

