

    (function($) {


        
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
                this.currentBout = new Bout();
                this.currentMatch = new Match({date: new Date(), 
                    schools: schools, 
                    bouts: new Bouts( [this.currentBout] )
                });
                var activi = new Action();
                var actis = new Actions();
                this.currentBout.set('actions', actis);
                this.curBoutView = new BoutView({model: that.currentBout, el: $("#mainMatch")});
                right_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            inList.push(new Wrestler(raw));
                        });
                        var right_wrestlers = new Wrestlers(inList);
                        var right_wrestlersView = new WrestlersView({ collection: right_wrestlers, el: $("#wrestlerListRight") });
                        var rWrest = right_wrestlers.at(0);
                        rWrest.set('available_moves', standing_moves);
                        rWrest.set('position', "NEUTRAL");
                        rWrest.set('points', 0);
                        that.currentBout.set('green_wrestler', rWrest);
                        console.log("the current bout: "+ JSON.stringify(that.currentBout.get('green_wrestler')));
                        that.curBoutView.render();
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
                        var lWrest = left_wrestlers.at(0);
                        that.currentBout.set('red_wrestler', lWrest);
                        lWrest.set('available_moves', standing_moves);
                        lWrest.set('position', "NEUTRAL");
                        lWrest.set('points', 0);
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

