
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
    canvas_element: "",
    initialize: function(options) {
        this.el = options.el;
        this.model = options.model;
    },
    render: function( ) {
        $("#boutClock").html( this.template({ model: this.model } ) );
        return this;
    },
    tick_clock: function( that ) {
        var fps = 100;
        var left = that.model.get('left');
	    var seconds = that.model.get('total');
        if ( left == 0 ) {
            clearInterval( that.model.get('timeout_keeper') );
            that.trigger("boutClock:complete");
        } else {
            that.model.set('str_clock', Math.floor(left/1000 / 60) +":"+ Math.floor((left/1000) % 60) );
            var step = 1 - left/seconds;
            that.model.set('left', left-fps);
            that.render();
            that.draw_next( step );
        }
    },
    start_clock: function() {
        fps = 100;
        var that = this;
        that.tick_clock(that);
    },
    pause_clock: function() {
        clearInterval( this.model.get('timeout_keeper') );
        $("#pie-countdown").removeClass("runningClock").addClass("stoppedClock");
    },
    draw_next: function( step ) {
	    this.canvas_element = document.getElementById('pie-countdown');
    	ctx = this.canvas_element.getContext('2d');
	    canvas_size = [ this.canvas_element.width, this.canvas_element.height ];
    	radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
	    center = [ (canvas_size[0] / 2) - 70, canvas_size[1] / 2 ];
    	ctx.clearRect(0, 0, canvas_size[0], canvas_size[1]);
	    if (step < 1) {
		    ctx.beginPath();
    		ctx.moveTo(center[0], center[1]); // ponto central
	    	ctx.arc( // draw next arc
		    center[0], center[1], radius, Math.PI * (-0.5 + 0), // -0.5 pra começar do topo
    		Math.PI * (-0.5 + step * 2), true // anti horário
	    	);
		    ctx.lineTo(center[0], center[1]); // line back to the center
    		ctx.closePath();

	    	if (step>.1) {
		        ctx.fillStyle = '#d00a1'; // color
    		} else {
	     	    ctx.fillStyle = 'rgb(40,40,40)'; // color
    		}
		    ctx.fill();
    	}
    },
    events: {
    }
});
        

var BoutView = Backbone.View.extend({
    /*
    Renders the one on one matchup between 2 wrestlers
    */
    template: _.template( $("#mainBoutTemplate").html() ),
    initialize: function() {
        this.model.get('clock');
        this.boutClockView = new ClockView({model: this.model.get('clock'), el: $("#boutClock")});
        $("#pie-countdown").removeClass("runningClock").addClass("stoppedClock");
        this.listenTo( this.boutClockView, 'boutClock:complete', this.advance_next_round );
    },
    advance_next_round: function( ) {
        console.log('next round upcoming');
        var roundC = this.model.get('current_round');
        if ( roundC == 3 ) {
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            var winner = (red.get('points') > green.get('points')) ? red : green;
            this.send_match_winner( winner, "DECISION" );
        } else {
            this.model.set('current_round', roundC+1);
            var boutClock= new Clock();
            boutClock.set('total', 120000);
            boutClock.set('left', 120000);
            this.model.set('clock', boutClock);
            this.boutClockView = new ClockView({model: this.model.get('clock'), el: $("#boutClock")});
            $("#pie-countdown").removeClass("stoppedClock").addClass("runningClock");
            this.listenTo( this.boutClockView, 'boutClock:complete', this.advance_next_round );
            this.render();
        }
    },
    render: function() {
        console.log("Wrestler Model: "+ JSON.stringify(this.model));
        $(this.el).html( this.template( {bout: this.model} ) );
        this.boutClockView.start_clock();
        return this;
    },
    checkForWin: function( ) {
        var score_diff = this.model.get('green_wrestler').get('points') - this.model.get('red_wrestler').get('points');
        console.log("score diff: "+ this.model.get('green_wrestler').get('points'));
        if ( Math.abs(score_diff) > 15  && score_diff > 0 ) {
            console.log("Choowing a winner");
            this.model.set('winner', this.model.get('green_wrestler').get('id') );
            return this.model.get('green_wrestler');
        } else if ( Math.abs(score_diff) > 15 && score_diff < 0 ) {
            this.model.set('winner', this.model.get('red_wrestler').get('id') );
            return this.model.get('red_wrestler');
        }
    },
    createAction: function(move, actor, victim) {
        var action = new Action();
        action.set('action_time', $('#secondsleft').html());
        if ( isStalling( move.get('move_id') ) ) {
            victim.set('actor', victim.id);
            victim.set('point_value', move.get('victim_value'));
        } else {
            action.set('actor', actor.id);
            action.set('point_value', move.get('actor_value'));
        }
        action.set('activity_type', move.get('move_id'));
        action.set('round_number', this.model.get('current_round'));
        var actions = this.model.get('actions');
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
        this.model.set('green_score', this.model.get('green_wrestler').get('points'));
        this.model.set('red_score', this.model.get('red_wrestler').get('points'));
        if ( this.checkForWin() !== undefined ) {
            this.send_match_winner( this.checkForWin(), "TECHNICAL_FALL" );
        }
        console.log("Move found: "+ JSON.stringify(move) );
    },
    send_match_winner: function(winner, win_type) {
        console.log("is a winner: "+ winner );
        this.model.set('winner', winner.id );
        this.model.set('win_type', win_type);
        var that = this.boutClockView;
        that.pause_clock( );
        this.model.unset('clock');
        this.model.save({ green_wrestler: this.model.get('green_wrestler').id,
            red_wrestler: this.model.get('red_wrestler').id,
            actions: this.model.get('actions'),
            bout_date: this.model.get('bout_date').getTime(),
            green_score: this.model.get('green_score'),
            red_score: this.model.get('red_score'),
            weight_class: this.model.get('weight_class'),
            winner: this.model.get('winner'),
            win_type: this.model.get('win_type')});
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
        },
        "click .runningClock#pie-countdown": function(event) { 
            var that = this.boutClockView;
            that.pause_clock( );
        },
        "click .stoppedClock#pie-countdown": function(event) {
            var that = this.boutClockView;
            $("#pie-countdown").removeClass("stoppedClock").addClass("runningClock");
            that.model.set('timeout_keeper', setInterval( function() {that.tick_clock(that); }, fps ) );
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

var MatchView = Backbone.View.extend({
    template: _.template( $("#mainMatchTemplate").html() ),
    initialize: function() {
        // Should take a match object as model
        // iterate through the wrestlers of home(controlling) team and select the opponent from other team
        // have a bout end event that would fire from bout and would trigger this to create the next matchup
        // the render should load the selected matchup and have a clickable thing.
        this.on( 'match:schoolloaded', this.add_school );
    },
    render: function() {
        $(this.el).html( this.template( this ));
        return this;
    },
    add_school: function(school) {
        var schools = this.model.get('schools');
        schools.push( school );
        if ( schools.length == 2 ) {
            this.render();
        }
    }
});
