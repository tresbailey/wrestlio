if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } }

    (function($) {

        var App = App || {};
        App.Views = App.Views || {};

        Backbone._nativeSync = Backbone.sync;

        Backbone.defaultSyncOptions = {};

        Backbone.sync = function( method, model, options ) {
            Backbone._nativeSync( method, model, _.extend( {}, Backbone.defaultSyncOptions, options ) );
        }

        var CreateUserView = ModalView.extend({
            el: $("#mainMatch"),
            template: setupUser,
            initialize: function( options ) {
                this.userSession = options;
                this.render();
            },
            render: function() {
                $(this.el).html( this.template( this ) );
                return this;
            },
            events: {
                'click .btn#makeUser': "store_user_fields"
            },
            store_user_fields: function() {
                $(this).children(".modal").addClass("hide");
            }
        });

        var LandingView = Backbone.View.extend({
            el: $("#mainMatch"),
            template: landingSchoolsTemplate,
            initialize: function() {
                select_request = $.ajax( {
                    url: BASEURL +'/staticData/school_hash',
                    type: 'GET',
                    dataType: 'json'
                });
                var that = this;
                select_request.done( function(data) {
                    that.select_values = data;
                    that.render();
                });
            },
            render: function() {
                $(this.el).html( this.template( this ) );
                return this;
            },
        });

        var SessionView = Backbone.View.extend({
            el: $("#loginDetails"),
            template: landingLogin,
            initialize: function() {
                this.userSession = new Session();
                if ($.cookie('remember_token')) {
                    this.userSession.url = '/me';
                    var that = this;
                    this.userSession.fetch({
                        success: function(model, response, options) {
                            that.userSession = model;
                            that.render();
                            window.userSession = that.userSession;
                        },
                        error: function(model, xhr, options) {
                            console.log(xhr);
                        }
                    });
                }
                this.render();
            },
            render: function() {
                $(this.el).html( this.template( this ) );
            },
            events: {
                'click .btn': 'login_user'
            },
            login_user: function() {
                login(this);
            }
        });
        
        var landing = new LandingView();
        var sessionView = new SessionView();

        window.userSession = landing.userSession;

        var MainView = Backbone.View.extend({

            initialize: function() {
                console.log("Initing the main view!!");
                var red_school = new School();
                red_school.url = BASEURL + '/High%20School/SC/3A/Region%20II/Broome';
                var green_school = new School();
                green_school.url = BASEURL + '/High%20School/SC/3A/Region%20II/Chester';
                var schools = new Schools();
                this.matches = new Matches();
                this.matches.url = BASEURL + '/matches';
                this.matches.add( new Match() );
                this.currentMatch = this.matches.at(0);
                this.currentMatch.id = '510d3883319d7d3728000001';
                this.currentMatch.set('date', new Date());
                this.currentMatch.set('home_school', green_school);
                this.currentMatch.set('visit_school', red_school);
                this.currentMatch.set('home_score', 0);
                this.currentMatch.set('visit_score', 0);
                this.currentMatch.set('individual_bouts', new Bouts() );
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

        var ScheduleView = Backbone.View.extend({
            el: $("#mainMatch"),
            template: scheduleTemplate,
            initialize: function() {
            },
            render: function() {
                this.selectSchool = new SchoolSelectView(); 
                this.all_schools = {};
                var that = this;
                /*
                new Schools().fetch({
                    success: function(collection, response, opts) {
                        collection.each(function(model, index, list) {
                            that.all_schools[model.get('_id')] = model.get('school_name');
                        });
                        $(that.el).html( that.template( that ) );
                    }
                });
                */
                $(that.el).html( that.template( that ) );
                return this;
            },
            events: {
                'click .btn#create_match': "store_match",
                'click a.school_select': function(event) {
                    $("form[name=create_match] input[name=opponent]").val($(event.target).children("input").val());
                    $(".dropdown-toggle#school_selection:first-child").text($(event.target).text());
                }
            },
            store_match: function(event) {
                var home_away = $("#home_away .activte").data("value");
                var opponent = this.$('input[name=opponent]').val();
                var home = home_away == 'away' ? opponent : this.school.id;
                var away = home_away == 'home' ? this.school.id : opponent;
                var raw = { match_date: this.$('input[name=date]').val(),
                    home_school: home, visit_school: away, 
                    home_score: 0, visit_score: 0, individual_bouts: []
                };
                var match = new Match(raw);
                this.matches.add(match);
                this.matches.url = BASEURL + '/matches';
                var that = this;
                match.save(match.attributes, {success: function(model, response, options) {
                    that.render();
                }});
            }

        });

        var RosterEditView = Backbone.View.extend({
            
            el: $("#fullMatch"),
            template: createWrestlerTemplate,
            initialize: function( school ) {
                this.model = school;
                this.wrestlers = new Wrestlers();
                this.model.url = BASEURL + '/'+ this.model.get('competition') 
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
        var matches;
        school.fetch({
            success: function(model, response, options) {
                school = new School(model.attributes[0]);
                school.id = model.attributes[0]._id;
                matches = new Matches();
                _.each(model.attributes[0].schedule, function(mup, index,list) {
                    var match = new Match(mup);
                    matches.add(match);
                    match.set('home_school', new School(match.get('home_school')));
                    match.set('visit_school', new School(match.get('visit_school')));
                });
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

    var load_login_user = function( login_id ) {
        var userSession = sessionView.userSession;
        userSession.id = login_id;
        userSession.url = BASEURL + '/login_user/' + login_id;
        sessionView.login_user();
    }

    var show_matchup = function( school_id, opponent_id, match_id ) {
        var match = new Match();
        match.url = BASEURL + '/matches/'+ match_id;
        match.id = match_id;
        match.fetch({
            success: function(model, response, options) {
                match = model;
                match.set('home_score', 0);
                match.set('visit_score', 0);
                match.set('individual_bouts', new Bouts() );
                get_teams = $.ajax( {
                    url: BASEURL +'/schools/'+ school_id +','+ opponent_id,
                    type: 'GET',
                    dataType: 'json'
                });
                var schools = new Schools();
                get_teams.done( function(data) {
                    var t_schools = new Backbone.Collection(data);
                    my_team = t_schools.get( school_id );
                    my_team.url = BASEURL + '/'+ my_team.get('competition') +'/'+
                        my_team.get('area') +'/'+ my_team.get('size') +'/'+
                        my_team.get('conference');
                    var my_wrestlers = setup_school_wrestlers(my_team.get('wrestlers'));
                    my_team.set('wrestlers', my_wrestlers);
                    schools.add(my_team);
                    opponent = t_schools.get(opponent_id);
                    opponent.url = BASEURL + '/'+ opponent.get('competition') +'/'+
                        opponent.get('area') +'/'+ opponent.get('size') +'/'+
                        opponent.get('conference');
                    var opp_wrestlers = setup_school_wrestlers(opponent.get('wrestlers'));
                    opponent.set('wrestlers', opp_wrestlers);
                    schools.add(opponent);
                    var home_school = my_team.id == match.get('home_school') ? my_team : opponent;
                    var visit_school = my_team.id == match.get('home_school') ? opponent: my_team ;
                    match.set('home_school', home_school);
                    match.set('visit_school', visit_school);
                    var matchView = new MatchView({model: match, el: $("#matchDetails")});
                    matchView.add_schools();
                });
            },
            error: function(model, xhr, options) {

            }
        });
    
    }

    app_router.on("route:school_schedule", load_school_page);
    app_router.on("route:user_login", load_login_user);
    app_router.on("route:show_match", show_matchup);


    })(jQuery);

