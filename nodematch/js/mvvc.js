

    (function($) {


        
        var App = App || {};
        App.Views = App.Views || {};
        

        var MainView = Backbone.View.extend({

            prepare_bout: function(bout) {
                this.currentBout = bout;
                var matBouts = this.currentMatch.get('bouts');
                matBouts.add(this.currentBout);
                this.currentBout.set('current_round', 1);
                var actis = new Actions();
                this.currentBout.set('actions', actis);
                this.currentBout.set('bout_date', new Date());
                this.currentBout.url = this.matches.url +'/'+ this.currentMatch.id;
                var boutClock = new Clock();
                boutClock.set('total', 120000);
                boutClock.set('left', 120000);
                this.currentBout.set('clock', boutClock);
                this.currentMatch.set('bouts', new Bouts( [this.currentBout] ));
                this.curBoutView = new BoutView({model: this.currentBout, el: $("#mainMatch")});
                if ( this.currentBout.has('green_wrestler') &&
                  this.currentBout.has('red_wrestler') ) {
                    this.currentBout.set('green_wrestler',
                        this.prepare_wrestler(this.currentBout.get('green_wrestler')) );
                    this.currentBout.set('red_wrestler',
                        this.prepare_wrestler(this.currentBout.get('red_wrestler')) );
                    this.curBoutView.render();
                }
            },
            prepare_wrestler: function(wrestler) {
                wrestler.set('available_moves', standing_moves);
                wrestler.set('position', "NEUTRAL");
                wrestler.set('points', 0);
                wrestler.set('stalling_count', 0);
                return wrestler
            },
            initialize: function() {
                console.log("Initing the main view!!");
                var red_school = new School();
                red_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Walhalla';
                var green_school = new School();
                green_school.url = 'http://localhost:8001/High%20School/SC/3A/Region%20II/Seneca';
                var schools = new Schools();
                schools.add(red_school);
                schools.add(green_school);
                this.matches = new Matches();
                this.matches.url = 'http://localhost:5001/matches';
                this.currentMatch = new Match();
                this.currentMatch.id = '510d3883319d7d3728000001';
                this.currentMatch.set('date', new Date());
                this.currentMatch.set('schools', new Schools());
                this.currentMatch.set('bouts', new Bouts() );
                var matchView = new MatchView({model: this.currentMatch, el: $("#fullMatch")});
                this.prepare_bout(new Bout());
                this.on('bout:selectedBout', this.prepare_bout);
                that = this;
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
                        var gWrest = that.prepare_wrestler(green_wrestlers.at(0));
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
                        var rWrest = that.prepare_wrestler(red_wrestlers.at(0));
                        that.currentBout.set('red_wrestler', rWrest);
                        matchView.trigger("match:schoolloaded", model);
                        that.curBoutView.render();
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
            },
        });

        mainV = new MainView();

    })(jQuery);

