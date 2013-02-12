
var SmallWrestlerView = Backbone.View.extend({
    /*
    Renders a single wrestler in the list view
    */
    template: _.template( $("#smallWrestlerTemplate").html() ),
    render: function() {
        console.log("Wrestler Model: "+ this.model);
        $(this.el).html( this.template( {wrestler: this.model} ) );
        return this;
    },
    events: {
        "click .smallWrestler": "showDetails"
    },
    showDetails: function() {
        console.log("Hovered a model: "+ (this.model.get("first_name")) );
    }
});


var WrestlersView = Backbone.View.extend({
    /*
    Renders the list view of all cats
    */
    template: _.template( $("#allWrestlersTemplate").html() ),
    initialize: function(models, options) {
        console.log("Initiing the list view: "+ this.collection);
        this.render();
        this.collection.bind("add", this.addWrestler);
    },
    render: function() {
        console.log( "Got a first Model: "+ this.collection);
        $(this.el).html( this.template( this.collection ) );
        return this;
    },
    addWrestler: function(model) {
        this.render();
    }
});

var BoutView = Backbone.View.extend({
    /*
    Renders the one on one matchup between 2 wrestlers
    */
    template: _.template( $("#mainMatchTemplate").html() ),
    render: function() {
        console.log("Wrestler Model: "+ JSON.stringify(this.model));
        $(this.el).html( this.template( {bout: this.model} ) );
        return this;
    },
    events: {
        "click #greenMoves .btn": function(event) { 
            var buttonClick = event.target;
            move = move_lookup[buttonClick.id];
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            green.set('position', move.get('actor_effect'));
            green.set('points', move.get('point_value') + green.get('points'));
            red.set('position', move.get('victim_effect'));
            console.log("Move found: "+ JSON.stringify(move) );
            this.render();
        },
        "click #redMoves .btn": function(event) { 
            var buttonClick = event.target;
            move = move_lookup[buttonClick.id];
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            red.set('position', move.get('actor_effect'));
            red.set('points', move.get('point_value') + red.get('points'));
            green.set('position', move.get('victim_effect'));
            console.log("Move found: "+ JSON.stringify(move) );
            this.render();
        }
    }
}); 

var MovesView = Backbone.View.extend({
    /*
    Renders a collection of moves available for a wrestler
    */
    render: function() {
        console.log("Rendering the Moves: "+ JSON.stringify(this.model));
        $(this.el).html( this.template( this ));
        return this;
    }
});
