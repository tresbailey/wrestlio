

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
                green_wrestler: "",
                red_wrestler: "",
                green_score: 0,
                red_score: 0,
                winner: "",
                win_type: "",
                date: "",
                rounds: []
            }
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
                this.left_wrestlers = new Wrestlers();
                this.left_wrestlers.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Walhalla';
                this.left_wrestlersView = new WrestlersView({ collection: this.left_wrestlers, el: $("#wrestlerListLeft") });
                this.right_wrestlers = new Wrestlers();
                this.right_wrestlers.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Seneca';
                this.right_wrestlersView = new WrestlersView({ collection: this.right_wrestlers, el: $("#wrestlerListRight") });
                that = this;
                this.right_wrestlers.fetch({success: this.rightInit,
                error: function(collection, xhr, options) {
                    console.log("got a failure: "+ xhr.responseText);
                }
                });
                this.left_wrestlers.fetch({success: this.leftInit,
                error: function(collection, xhr, options) {
                    console.log("got a failure: "+ xhr.responseText);
                }
                });
            },
            leftInit: function(collection, response, options) {
                that.initAllViews(that.left_wrestlersView, collection, response, options);
            },
            rightInit: function(collection, response, options) {
                that.initAllViews(that.right_wrestlersView, collection, response, options);
            },
            initAllViews: function(viewObject, collection, response, options) {
                console.log("returned the collection: "+ viewObject);
                viewObject = new WrestlersView({
                    collection: collection, 
                    el: viewObject.el
                });
                viewObject.collection = collection;
                console.log("Wrestler View: "+ viewObject.collection);
            }
        });

        var mainV = new MainView();


    })(jQuery);

