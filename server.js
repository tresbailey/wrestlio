#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            var ip = process.env.HOMEIP
            console.warn('No OPENSHIFT_NODEJS_IP var, using '+ ip);
            self.ipaddress = ip;
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };
<<<<<<< HEAD
    
        var host_name = process.env.OPENSHIFT_APP_DNS ? 'http://'+process.env.OPENSHIFT_APP_DNS : 
                'http://localhost:8080'
        var service_host = process.env.OPENSHIFT_APP_DNS ? 'https://takedownRest-tresback.rhcloud.com': 
                'http://localhost:5001'
        url_template = "var BASEURL='"+ service_host +"'"

        self.routes['/'] = function(req, res) {
            res.redirect(host_name +'/pages/hotcatz.html');
        };

        self.routes['/pages/*.html'] = function(req, res) {
            console.log("Retrieving path: "+ req.path);
            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync('nodematch/'+req.path));
        };
    
        self.routes['/js/base_url.js'] = function(req, res) {
            res.setHeader('Content-Type', 'text/javascript');
            res.end(url_template);
        };

        self.routes['/js/*.js'] = function(req, res) {
            res.setHeader('Content-Type', 'text/js');
            res.send(fs.readFileSync('nodematch/'+req.path));
        }
        self.routes['/images/*.png'] = function(req, res) {
            res.setHeader('Content-Type', 'image/png');
            res.send(fs.readFileSync('nodematch/'+req.path));
        }
        self.routes['/css/*.css'] = function(req, res) {
            res.setHeader('Content-Type', 'text/css');
            res.send(fs.readFileSync('nodematch/'+req.path));
        }
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

