

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
                this.matches = new Matches();
                this.matches.url = 'http://localhost:5001/matches';
                //this.matches.url = 'https://takedownRest-tresback.rhcloud.com/matches';
                this.matches.add( new Match() );
                this.currentMatch = this.matches.at(0);
                this.currentMatch.id = '510d3883319d7d3728000001';
                this.currentMatch.set('date', new Date());
                this.currentMatch.set('home_school', green_school);
                this.currentMatch.set('visit_school', red_school);
                this.currentMatch.set('home_score', 0);
                this.currentMatch.set('visit_score', 0);
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
                        schools.add(green_school);
                        matchView.trigger("match:schoolloaded", schools);
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
                        schools.add(red_school);
                        matchView.trigger("match:schoolloaded", schools);
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
                this.el = $("#mainMatch");
                this.template = _.template( $("#scheduleTemplate").html() );
                var that = this;
                matches.fetch({
                    success: function( model, response, options) {
                        var opponents = [];
                        _.each( model.models, function( match, index) {
                            if ( match.get('home_school') != school_id )  {
                                opponents = opponents.concat(match.get('home_school'));
                            } else {
                                opponents = opponents.concat(match.get('visit_school'));
                            }
                        });
                        _.uniq(opponents);
                        console.log("Got back a match: "+ opponents);
                        that.all_schools = new Schools();
                        that.all_schools.url = 'http://localhost:5001/schools/'+ opponents;
                        that.match_obj = _.object( _.map(matches.models, function(item) {
                            return [item.id, item];
                        }));
                        that.all_schools.fetch({
                            success: function( collection, response, options) {
                                console.log("Got back all schools: "+ collection);
                                _.each( collection.models, function(raw_school, index) {
                                    that.all_schools.add(raw_school);
                                });
                                that.render();
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
            },
            render: function() {
                $(this.el).html( this.template( this ) );
                return this;
            }

        });
    app_router.on("route:school_schedule", function(school_id) {
        console.log("Clicked an id of a school: "+ school_id);
        var schedule = new ScheduleView({},school_id);
    });


    })(jQuery);

