
var SmallWrestlerView = Backbone.View.extend({
    /*
    Renders a single wrestler in the list view
    */
    template: smallWrestlerTemplate,
    initialize: function(options) {
        this.weight = options.weight;
        this.color = options.color;
        this.index = options.index;
    },
    render: function() {
        $(this.el).append(this.template( {wrestler: this.model, color: this.color, weight: this.weight} ) );
        return this;
    },
    events: {
        "click .btn": "choose_for_weight"
    },
    choose_for_weight: function() {
        console.log("Clicked on the wrestler: "+ this.model.id + " with weight set to "+ this.weight);   
    }
});


var WrestlersView = Backbone.View.extend({
    /*
    Renders the list view of all cats
    */
    template: teamWrestlersTemplate,
    initialize: function(models, options) {
        this.collection = models;
        console.log("Initiing the list view: "+ this.collection);
        this.collection.bind("add", this.addWrestler);
    },
    render: function() {
        console.log( "Got a first Model: "+ this.collection);
        $(this.el).html( this.template( this ) );
        return this;
    },
    addWrestler: function(model) {
    }
});

var ClockView = Backbone.View.extend({
    template: boutClockTemplate,
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
    template: mainBoutTemplate,
    initialize: function() {
        this.model.get('clock');
        this.boutClockView = new ClockView({model: this.model.get('clock'), el: $("#boutClock")});
        $("#pie-countdown").removeClass("runningClock").addClass("stoppedClock");
        this.listenTo( this.boutClockView, 'boutClock:complete', this.advance_next_round );
        this.on('bout:win', this.send_match_winner);
    },
    advance_next_round: function( ) {
        console.log('next round upcoming');
        var roundC = this.model.get('current_round');
        if ( roundC == 3 ) {
            var green = this.model.get('green_wrestler');
            var red = this.model.get('red_wrestler');
            var winner = (red.get('points') > green.get('points')) ? red : green;
            this.trigger("bout:win", winner, "DECISION");
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
            this.trigger("bout:win", this.checkForWin(), "TECHNICAL_FALL");
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
        "click a.voteBtn#greenPin": function(event) {
            this.trigger("bout:win", this.model.get('green_wrestler'), "PIN");
        },
        "click a.voteBtn#redPin": function(event) {
            this.trigger("bout:win", this.model.get('red_wrestler'), "PIN");
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

var SmallBoutView = Backbone.View.extend({
    template: smallBoutTemplate,
    initialize: function() {
        //this._childN = options.childN + 1;
    },
    render: function() {
        $(this.el).html( this.template( this ));
        return this;
    },
    events: {
        "click": function(event) {
            console.log('clocked btn');
            this.trigger("bout:selectedBout", this.model);    
        }
    }
});
    
var BoutsCollView = Backbone.View.extend({
    template: matchBoutsTemplate,
    initialize: function() {
        var that =  this;
    },
    render: function() {
        $(this.el).html( this.template( this ) );
        var that = this;
        _.each(this.collection.models, function(model, index) {
            $(that.el).children("ul").append("<li></li>");
            var subview = new SmallBoutView( 
                {model: model, el: $(that.el).children("ul").children("li:nth-child("+ index +")")});
            that.listenTo( subview, 'bout:selectedBout', that.next_bout );
            subview.render();
        });
        return this;
    },
    next_bout: function(event_data) {
        this.trigger("bout:selectedBout", event_data);
    }
});

var BoutSetupView = ModalView.extend({
    template: boutSetupTemplate,
    initialize: function(options) {
        get_weight_classes = $.ajax( {
            url: BASEURL + '/staticData/hsWeightClasses',
            type: 'GET',
            dataType: 'json'
        });
        var that = this;
        get_weight_classes.done( function(data) {
            that.weightClasses = data
            that.render();
        });
        green_build = {};
        _.each(options.green_wrestlers, function(green, index) {
            green_build[green.get('normal_weight')] = _.has(green_build, green.get('normal_weight')) ?
                green_build[green.get('normal_weight')].push(new SmallWrestlerView({el: this.el, model: green, weight: green.get('normal_weight'), color: 'success'})) :
                [new SmallWrestlerView({el: this.el, model: green, weight: green.get('normal_weight'), color: 'green'})];
        });
        red_build = {};
        _.each(options.red_wrestlers, function(red, index) {
            red_build[red.get('normal_weight')] = _.has(red_build, red.get('normal_weight')) ?
                red_build[red.get('normal_weight')].push(new SmallWrestlerView({el: this.el, model: red, weight: red.get('normal_weight'), color: 'danger'})) :
                [new SmallWrestlerView({el: this.el, model: red, weight: red.get('normal_weight'), color: 'red'})];
        });
        this.green_wrestlers = green_build;
        this.red_wrestlers = red_build;
        this.wrestler_selection = {};
        this.wrestler_selection['green'] = {};
        this.wrestler_selection['red'] = {};
    },
    render: function() {
        $(this.el).append( this.template( this ) );
        var that = this;
        _.each(this.weightClasses, function(weight, index) { 
            _.each(that.green_wrestlers[weight], function(wrestler, ind2) { 
                wrestler.el = $(that.el).find("#matchup_select_"+weight + " .green");
                wrestler.render(); 
            });
            _.each(that.red_wrestlers[weight], function(wrestler, ind2) { 
                wrestler.el = $(that.el).find("#matchup_select_"+weight + " .red");
                wrestler.render(); 
            });
        }); 
        return this;
    },
    events: {
        "click .choose": "choose_for_weight",
        "click .close": "close_modal",
        "click .completed": "complete_matchups"
    },
    choose_for_weight: function(event) {
        var chosen_wrestler = $(event.target).parent().parent();
        var wrestler_collection = chosen_wrestler.hasClass("green") ? this.green_wrestlers : this.red_wrestlers;
        var color = chosen_wrestler.hasClass("green") ? 'green' : 'red';
        var wrestler_id = chosen_wrestler.find('input[name=wrest_id]');
        var chosen_weight = chosen_wrestler.parent().attr('id');
        chosen_weight = chosen_weight.substring( chosen_weight.search(/(\d){3}/) );
        this.wrestler_selection[color][chosen_weight] = wrestler_collection[chosen_weight];
        chosen_wrestler.find('button').hide();
        $(chosen_wrestler.find('.span1').get(1)).text("Selected");
    },
    close_modal: function(event) {
        var parentModal = $(this.el).children(".modal"); 
        $(parentModal).removeClass("show");
        $(parentModal).addClass("hide");
    },
    complete_matchups: function() {
       this.trigger("match:bouts_selected", this.wrestler_selection); 
    }
});

var MatchView = ModalView.extend({
    template: mainMatchTemplate,
    _boutIndex: 0,
    currentBout: undefined,
    initialize: function(options) {
        this.model = options.model;
        this.el = options.el;
        this.model.set('scores', [0,0]);
        this.on( 'match:schoolloaded', this.add_school );
    },
    render: function() {
        $(this.el).html( this.template( this ) );
        this.boutsView.render();
        return this;
    },
    get_next_bout: function(winner, win_type) {
        this._boutIndex += 1;
        if ( this.currentBout.get('green_wrestler') == winner ) {
            var score = this.model.get('scores')[0];
            score += 6;
            this.model.get('scores')[0] = score;
        } else {
            var score = this.model.get('scores')[1];
            score += 6;
            this.model.get('scores')[1] = score;
        }
        this.prepare_bout( this.model.get('individual_bouts').at(this._boutIndex) );
        this.render();
    },
    prepare_bout: function(bout) {
        this.currentBout = bout;
        this.currentBout.set('current_round', 1);
        var actis = new Actions();
        this.currentBout.set('actions', actis);
        this.currentBout.set('bout_date', new Date());
        this.currentBout.url = this.model.url;
        this.currentBout.id = undefined;
        var boutClock = new Clock();
        boutClock.set('total', 120000);
        boutClock.set('left', 120000);
        this.currentBout.set('clock', boutClock);
        this.curBoutView = new BoutView({model: this.currentBout, el: $("#mainMatch")});
        this.currentBout.set('green_wrestler',
            this.prepare_wrestler(this.currentBout.get('green_wrestler')) );
        this.currentBout.set('red_wrestler',
            this.prepare_wrestler(this.currentBout.get('red_wrestler')) );
        this.listenTo( this.curBoutView, 'bout:win', this.get_next_bout );
        this.curBoutView.render();
    },
    prepare_wrestler: function(wrestler) {
        wrestler.set('available_moves', standing_moves);
        wrestler.set('position', "NEUTRAL");
        wrestler.set('points', 0);
        wrestler.set('stalling_count', 0);
        return wrestler
    },
    create_bouts: function(chosen_weights) {
        var rawlist = [];
        _.each( _.zip(green_wrestlers, red_wrestlers), function(combo, index) {
            if (combo[0] !== undefined && combo[1] !== undefined) {
            var bout = new Bout({green_wrestler: combo[0], red_wrestler: combo[1]});
            rawlist.push( bout );
            }
        });
        this.model.set('individual_bouts', new Bouts(rawlist));
        this.boutsView = new BoutsCollView({collection: this.model.get('individual_bouts'), el: $("#fullMatch")});
        this.listenTo( this.boutsView, 'bout:selectedBout', this.prepare_bout );
        this.prepare_bout( this.model.get('individual_bouts').at(0) );
        this.boutsView.render();
    },
    add_schools: function() {
        var green_wrestlers = _.sortBy( this.model.get('home_school').get('wrestlers').models, function(wrestler) { return wrestler.get('normal_weight') });
        var red_wrestlers = _.sortBy( this.model.get('visit_school').get('wrestlers').models, function(wrestler) { return wrestler.get('normal_weight') });
        var createBouts = new BoutSetupView({
            el: $("#mainMatch"),
            green_wrestlers: green_wrestlers,
            red_wrestlers: red_wrestlers
        });
        this.listenTo( createBouts, 'match:bouts_selected', this.create_bouts);
    }
});


var SchoolSelectView = Backbone.View.extend({
    el: $("#createMatchOpp"),
    template: breakoutSchoolSelect,
    initialize: function() {
        select_request = $.ajax( {
            url: BASEURL +'/staticData/school_hash',
            type: 'GET',
            dataType: 'json'
        });
        var that = this;
        select_request.done( function(data) {
            that.select_values = data;
            that.render();
        });
    },
    render: function() {
        $("#createMatchOpp").html( this.template( {select_values: this.select_values['High School']} ) );
        return this;
    },
});
