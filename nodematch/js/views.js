
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

var ClockView = Backbone.View.extend({
    template: _.template( $("#boutClockTemplate").html() ),
    render: function( boutView ) {
        $(this.el).html( this.template() );
        this.boutView = boutView;
        start_clock( this.boutView, this.model );
        return this;
    },
    events: {
        "click .runningClock#pie-countdown": function(event) { 
            console.log("Clicked the clock");
            pause_clock( this.model );
        },
        "click .stoppedClock#pie-countdown": function(event) {
            console.log("Started the clock");
            start_clock( this.boutView, this.model);
        }
    }
});
        

var BoutView = Backbone.View.extend({
    /*
    Renders the one on one matchup between 2 wrestlers
    */
    template: _.template( $("#mainMatchTemplate").html() ),
    advance_next_round: function() {
        console.log('next round upcoming');
        var roundC = this.model.get('current_round');
        this.model.set('current_round', roundC+1);
        $("#restartClock").show();
    },
    render: function() {
        console.log("Wrestler Model: "+ JSON.stringify(this.model));
        $(this.el).html( this.template( {bout: this.model} ) );
        return this;
    },
    createAction: function(move, actor, victim) {
        var action = new Action();
        action.set('time', $('#left').html());
        if ( isStalling( move.get('move_id') ) ) {
            victim.set('actor', victim.get('id'));
            victim.set('value', move.get('victim_value'));
        } else {
            action.set('actor', actor.get('id'));
            action.set('value', move.get('actor_value'));
        }
        action.set('round', this.model.get('current_round'));
        var actions = new Actions();
        actions.add(action);
        this.model.set('actions', actions);
    },
    makeMove: function(move, actor, victim) {
        actor.set('position', move.get('actor_effect') || actor.get('position') );
        actor.set('points', move.get('actor_value') + actor.get('points'));
        victim.set('points', move.get('victim_value') + victim.get('points'));
        victim.set('position', move.get('victim_effect') || victim.get('position') );
        if (move.get('move_id').indexOf('stalling') == 0) {
            var count = actor.get('stalling_count');
            actor.set('stalling_count', ++count);
        }
        this.createAction(move, actor, victim);
        console.log("Move found: "+ JSON.stringify(move) );
    },
    events: {
        "click #greenMoves .btn": function(event) { 
            var buttonClick = event.target;
            move = move_lookup[buttonClick.id];
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            this.makeMove(move, green, red); 
            this.render();
        },
        "click #redMoves .btn": function(event) { 
            var buttonClick = event.target;
            move = move_lookup[buttonClick.id];
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            this.makeMove(move, red, green); 
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
