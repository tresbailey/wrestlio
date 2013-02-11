
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
