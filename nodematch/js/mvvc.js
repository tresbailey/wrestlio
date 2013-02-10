

    (function($) {
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
                type: ""
            }
        });
        var Bout = Backbone.Model.extend({
            default: {
                id: "",
                weight_class: "",
                green_wrestler: {},
                red_wrestler: {},
                green_score: 0,
                red_score: 0,
                winner: "",
                win_type: "",
                date: "",
                rounds: []
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

        var Bouts = Backbone.Collection.extend({
            initialize: function() {

            }
        });
        var Schools = Backbone.Collection.extend({
            initialize: function() {
            }
        });

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
        
        var App = App || {};
        App.Views = App.Views || {};
        
        var MainView = Backbone.View.extend({

            initialize: function() {
                console.log("Initing the main view!!");
                var left_school = new School();
                left_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Walhalla';
                var right_school = new School();
                right_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Seneca';
                var schools = new Schools();
                schools.add(left_school);
                schools.add(right_school);
                that = this;
                currentBout = new Bout();
                this.currentMatch = new Match({date: new Date(), 
                    schools: schools, 
                    bouts: new Bouts( [currentBout] )
                });
                right_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            inList.push(new Wrestler(raw));
                        });
                        var right_wrestlers = new Wrestlers(inList);
                        var right_wrestlersView = new WrestlersView({ collection: right_wrestlers, el: $("#wrestlerListRight") });
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
                left_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            inList.push(new Wrestler(raw));
                        });
                        var left_wrestlers = new Wrestlers(inList);
                        var left_wrestlersView = new WrestlersView({ collection: left_wrestlers, el: $("#wrestlerListLeft") });
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
            },
        });

        var mainV = new MainView();


    })(jQuery);

