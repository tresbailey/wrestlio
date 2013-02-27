

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
                this.currentBout.set('current_round', 1);
                this.matches = new Matches();
                this.currentMatch = new Match({date: new Date(), 
                    schools: schools, 
                    bouts: new Bouts( [this.currentBout] )
                });
                this.matches.url = 'http://localhost:5001/matches';
                this.matches.add(this.currentMatch);
                this.currentMatch.id = '510d3883319d7d3728000001';
                var activi = new Action();
                var actis = new Actions();
                this.currentBout.set('actions', actis);
                this.currentBout.set('bout_date', new Date());
                this.currentBout.url = this.matches.url +'/'+ this.currentMatch.id;
                var boutClock = new Clock();
                boutClock.set('total', 120000);
                boutClock.set('left', 120000);
                this.currentBout.set('clock', boutClock);
                this.curBoutView = new BoutView({model: that.currentBout, el: $("#mainMatch")});
                var match = new Match();
                match.set('date', new Date());
                match.set('schools', new Schools());
                var matchView = new MatchView({model: match, el: $("#fullMatch")});
                green_school.fetch({
                    success: function(model, response, options) {
                        var rawWrest = _.values(model.get('wrestlers'));
                        var inList = [];
                        _(rawWrest).each(function(raw, index) {
                            var rw = new Wrestler(raw);
                            rw.id = raw['wrestler_id'];
                            inList.push(rw);
                        });
                        var green_wrestlers = new Wrestlers(inList);
                        green_school.set('wrestlers', green_wrestlers);
                        var gWrest = green_wrestlers.at(0);
                        console.log("wrestler id: "+ gWrest.id)
                        gWrest.set('available_moves', standing_moves);
                        gWrest.set('position', "NEUTRAL");
                        gWrest.set('points', 0);
                        gWrest.set('stalling_count', 0);
                        that.currentBout.set('green_wrestler', gWrest);
                        that.currentBout.set('weight_class', gWrest.get('normal_weight'));
                        console.log("the current bout: "+ JSON.stringify(that.currentBout.get('green_wrestler')));
                        matchView.trigger("match:schoolloaded", model);
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
                            var rw = new Wrestler(raw);
                            rw.id = raw['wrestler_id'];
                            inList.push(rw);
                        });
                        var red_wrestlers = new Wrestlers(inList);
                        red_school.set('wrestlers', red_wrestlers);
                        var rWrest = red_wrestlers.at(0);
                        that.currentBout.set('red_wrestler', rWrest);
                        rWrest.set('available_moves', standing_moves);
                        rWrest.set('position', "NEUTRAL");
                        rWrest.set('points', 0);
                        rWrest.set('stalling_count', 0);
                        matchView.trigger("match:schoolloaded", model);
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

