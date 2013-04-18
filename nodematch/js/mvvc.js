

    (function($) {

        var App = App || {};
        App.Views = App.Views || {};

        var LandingView = Backbone.View.extend({
            el: $("#mainMatch"),
            template: _.template( $("#landingSchoolsTemplate").html() ),
            initialize: function() {
                this.schools = new Schools();
                this.schools.url = BASEURL + '/';
                this.userSession = new Session();
                var that = this;
                this.schools.fetch({
                    success: function(models, response, options) {
                        that.schools = models;
                    },
                    error: function(xhr, response, options) {

                    }
                });
                checkForLogin(this);
            },
            render: function() {
                $(this.el).html( this.template( this ) );
                $("#loginDetails").html(_.template($('#landingLogin').html())({userSession: this.userSession }) );
                return this;
            },
            events: {
                'click .btn': "login_user"
            },
            login_user: function() {
                login(this.userSession);
            }
        });
        
        var landing = new LandingView();

        window.userSession = landing.userSession;

        var MainView = Backbone.View.extend({

            initialize: function() {
                console.log("Initing the main view!!");
                var red_school = new School();
                red_school.url = BASEURL + '/High%20School/SC/3A/Region%20II/Broome';
                //red_school.url = 'http://localhost:5001/High%20School/SC/3A/Region%20II/Walhalla';
                //red_school.url = 'https://takedownRest-tresback.rhcloud.com/High%20School/SC/3A/Region%20II/Broome';
                var green_school = new School();
                green_school.url = BASEURL + '/High%20School/SC/3A/Region%20II/Chester';
                //green_school.url = 'http://localhost:5001/High%20School/SC/3A/Region%20II/Seneca';
                //green_school.url = 'https://takedownRest-tresback.rhcloud.com/High%20School/SC/3A/Region%20II/Chester';
                var schools = new Schools();
                this.matches = new Matches();
                this.matches.url = BASEURL + '/matches';
                //this.matches.url = 'http://localhost:5001/matches';
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
                        var green_wrestlers = setup_school_wrestlers(model.get('wrestlers'));
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
                        var red_wrestlers = setup_school_wrestlers(model.get('wrestlers'));
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

        setup_school_wrestlers = function( wrestlers ) {
            var rawWrest = _.values(wrestlers);
            var inList = [];
            _(rawWrest).each(function(raw, index) {
                var rw = new Wrestler(raw);
                rw.id = raw['wrestler_id'];
                inList.push(rw);
            });
            return new Wrestlers(inList);
        }

        //mainV = new MainView();

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
                this.model.url = BASEURL + '/'+ this.model.get('competition') 
                //this.model.url = 'http://localhost:5001/'+ this.model.get('competition') 
                //this.model.url = 'https://takedownRest-tresback.rhcloud.com/'+ this.model.get('competition') 
                    +'/'+ this.model.get('area') +'/'+ this.model.get('size')
                    +'/'+ this.model.get('conference') +'/'+ this.model.get('school_name');
                var that = this;
                this.model.set('wrestlers', setup_school_wrestlers(this.model.get('wrestlers')));
                this.model.get('wrestlers').on('add', this.render, this);
            },
            render: function() {
                var wrview = new WrestlersView(this.model.get('wrestlers'));
                $(this.el).html( this.template( this ) );
                wrview.el = $(this.el).children("div").children("div#existingRoster");
                wrview.render();
                return this;
            },
            events: {
                'click .btn#create_wrestler': "store_wrestler"
            },
            store_wrestler: function(event) {
                var raw = { first_name: this.$('input[name=first_name]').val(),
                    last_name: this.$('input[name=last_name]').val(),
                    normal_weight: this.$('input[name=avg_wt]').val(),
                    qualified_weight: this.$('input[name=qual_wt]').val()
                };
                var nwrest = new Wrestler(raw);
                nwrest.set('wins', 0);
                nwrest.set('losses', 0);
                this.model.get('wrestlers').add(nwrest);
                this.model.get('wrestlers').url = this.model.url;
                nwrest.url = this.model.url;
                nwrest.save(nwrest.attributes[0]);
            }
        });

    var load_school_page = function( school_id ) {
        var school = new School();
        school.id = school_id;
        school.url = BASEURL + '/schools/'+ school.id +'?qschedule=true';
        //school.url = 'http://localhost:5001/schools/'+ school.id +'?qschedule=true';
        //school.url = 'https://takedownRest-tresback.rhcloud.com/schools/'+ school.id +'?qschedule=true';
        var matches;
        school.fetch({
            success: function(model, response, options) {
                school = new School(model.attributes[0]);
                matches = new Matches(model.get('schedule'));
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

