

    (function($) {


        
        var App = App || {};
        App.Views = App.Views || {};
        

        var MainView = Backbone.View.extend({

            initialize: function() {
                console.log("Initing the main view!!");
                var red_school = new School();
                red_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Walhalla';
                var green_school = new School();
                green_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Seneca';
                var schools = new Schools();
                schools.add(red_school);
                schools.add(green_school);
                that = this;
                this.currentBout = new Bout();
                this.currentMatch = new Match({date: new Date(), 
                    schools: schools, 
                    bouts: new Bouts( [this.currentBout] )
                });
                var activi = new Action();
                var actis = new Actions();
                this.currentBout.set('actions', actis);
                this.curBoutView = new BoutView({model: that.currentBout, el: $("#mainMatch")});
                green_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            inList.push(new Wrestler(raw));
                        });
                        var green_wrestlers = new Wrestlers(inList);
                        var green_wrestlersView = new WrestlersView({ collection: green_wrestlers, el: $("#wrestlerListLeft") });
                        var gWrest = green_wrestlers.at(0);
                        gWrest.set('id', new Date());
                        gWrest.set('available_moves', standing_moves);
                        gWrest.set('position', "NEUTRAL");
                        gWrest.set('points', 0);
                        gWrest.set('stalling_count', 0);
                        that.currentBout.set('green_wrestler', gWrest);
                        console.log("the current bout: "+ JSON.stringify(that.currentBout.get('green_wrestler')));
                        that.curBoutView.render();
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
                red_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            inList.push(new Wrestler(raw));
                        });
                        var red_wrestlers = new Wrestlers(inList);
                        var red_wrestlersView = new WrestlersView({ collection: red_wrestlers, el: $("#wrestlerListRight") });
                        var rWrest = red_wrestlers.at(0);
                        that.currentBout.set('red_wrestler', rWrest);
                        rWrest.set('id', new Date());
                        rWrest.set('available_moves', standing_moves);
                        rWrest.set('position', "NEUTRAL");
                        rWrest.set('points', 0);
                        rWrest.set('stalling_count', 0);
                        that.curBoutView.render();
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
            },
        });

        var mainV = new MainView();


    })(jQuery);

