

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
            el: $("#mainMatch"),
            template: _.template( $("#scheduleTemplate").html() ),
            initialize: function() {
            },
            render: function() {
                $(this.el).html( this.template( this ) );
                return this;
            }

        });

        var RosterEditView = Backbone.View.extend({
            
            el: $("#fullMatch"),
            template: _.template( $("#createWrestlerTemplate").html() ),
            initialize: function( school ) {
                this.model = school;
                this.wrestlers = new Wrestlers();
                var that = this;
                _.each( _.values(this.model.attributes[0].wrestlers), function(wrest, index) {
                    var wrestler = new Wrestler(wrest);
                    that.wrestlers.add( wrestler );
                });
            },
            render: function() {
                var wrview = new WrestlersView(this.wrestlers);
                $(this.el).html( this.template( this ) );
                wrview.el = $(this.el).children("div").children("div#existingRoster");
                wrview.render();
                return this;
            }
        });

    var load_school_page = function( school_id ) {
        var school = new School();
        school.id = school_id;
        school.url = 'http://localhost:5001/schools/'+ school.id +'?qschedule=true';
        var matches;
        school.fetch({
            success: function(model, response, options) {
                school = model;
                matches = new Matches(model.attributes[0].schedule);
                var schedule = new ScheduleView();
                schedule.school = school;
                schedule.matches = matches;
                schedule.render();
                var roster = new RosterEditView(school);
                roster.render();
            },
            error: function(xhr, response, options) {
                console.log("Got an error");
            }
        });
        
    }

    app_router.on("route:school_schedule", load_school_page);


    })(jQuery);

