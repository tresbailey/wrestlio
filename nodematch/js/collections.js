
var Bouts = Backbone.Collection.extend({
    initialize: function() {

    }
});
var Schools = Backbone.Collection.extend({
    initialize: function() {
    }
});
var Wrestlers = Backbone.Collection.extend({
    /*
    Collection of wrestler models
    */
    initialize: function() {
    },
    comparator: function(wrestler) {
        return -wrestler.get("normal_weight");
    },
});

var Actions = Backbone.Collection.extend({
    initialize: function() {
    }
});
var Moves = Backbone.Collection.extend({
    initiailize:function() {
    }
});
var Matches = Backbone.Collection.extend({
    initialize: function(models) {
        mod_list = [];
        _.each(models, function(raw_match, index) {
            match = new Match(raw_match);
            match.id = raw_match.match_id;
            mod_list.push( match );
        });
        this.models = mod_list;
    }
});
