

    (function($) {


        
        var App = App || {};
        App.Views = App.Views || {};
        

        var MainView = Backbone.View.extend({

            initialize: function() {
                console.log("Initing the main view!!");
                var red_school = new School();
                red_school.url = 'http://localhost:5001/High%20School/SC/3A/Region%20II/Walhalla';
                //red_school.url = 'https://takedownRest-tresback.rhcloud.com/High%20School/SC/3A/Region%20II/Broome';
                var green_school = new School();
                green_school.url = 'http://localhost:5001/High%20School/SC/3A/Region%20II/Seneca';
                //green_school.url = 'https://takedownRest-tresback.rhcloud.com/High%20School/SC/3A/Region%20II/Chester';
                var schools = new Schools();
                schools.add(green_school);
                schools.add(red_school);
                this.matches = new Matches();
                this.matches.url = 'http://localhost:5001/matches';
                //this.matches.url = 'https://takedownRest-tresback.rhcloud.com/matches';
                this.matches.add( new Match() );
                this.currentMatch = this.matches.at(0);
                this.currentMatch.id = '510d3883319d7d3728000001';
                this.currentMatch.set('date', new Date());
                this.currentMatch.set('schools', schools);
                this.currentMatch.set('scores', []);
                this.currentMatch.set('bouts', new Bouts() );
                var matchView = new MatchView({model: this.currentMatch, el: $("#matchDetails")});
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
                        matchView.trigger("match:schoolloaded", model);
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
                        matchView.trigger("match:schoolloaded", model);
                    },
                    error: function(collection, xhr, options) {
                        console.log("got a failure: "+ xhr.responseText);
                    }
                });
            },
        });

        mainV = new MainView();

        var ScheduleView = Backbone.View.extend({
            initialize: function(model, school_id) {
                var matches = new Matches();
                matches.url = 'http://localhost:5001/matches?qschool='+ school_id;
                matches.fetch({
                    success: function( model, response, options) {
                        var opponents = [];
                        _.each( model.models, function( match, index) {
                            opponents = opponents.concat(match.get('schools'));
                        });
                        _.uniq(opponents);
                        console.log("Got back a match: "+ opponents);
                        this.all_schools = new Schools();
                        this.all_schools.url = 'http://localhost:5001/schools/'+ opponents;
                        this.match_obj = _.object( _.map(matches.models, function(item) {
                            return [item.id, item];
                        }));
                        this.all_schools.fetch({
                            success: function( collection, response, options) {
                                console.log("Got back all schools: "+ collection);
                                _.each( collection.models, function(raw_school, index) {
                                    this.all_schools.add(raw_school);
                                });

                            },
                            error: function(collection, xhr, options) {
                                console.log("Got an error");
                            }
                        });
                    },
                    error: function(model, xhr, options) {
                        console.log("Got a failure");
                    }
                });
            }

        });
    app_router.on("route:school_schedule", function(school_id) {
        console.log("Clicked an id of a school: "+ school_id);
        var schedule = new ScheduleView({},school_id);
    });


    })(jQuery);

