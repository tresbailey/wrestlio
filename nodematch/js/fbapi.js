window.fbAsyncInit = function() {
    FB.init({
      appId      : '273015446166960', // App ID
      channelUrl : BASEURL +'/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // connected
        console.log("CONNECTED TO FACEBOOK");
        FB.api('/me', function(response) {
            Backbone.defaultSyncOptions = {
                headers: { Authorization: response.id }
            };
            document.location.hash = "facebook/"+ response.id;
        });
      } else if (response.status === 'not_authorized') {
        // not_authorized
      } else {
        // not_logged_in
      }
   });
    // Additional init code here

};

function getUser(loginView) {
    FB.api('/me', function(response) {
        loginView.userSession.set('facebook_id', response.id);
        loginView.userSession.set('fb_first', response.first_name);
        loginView.userSession.set('fb_last', response.last_name);
        FB.api('/me/picture', function(picres) {
            loginView.userSession.set('fb_pic', picres.data.url);
            loginView.render();
        });
        Backbone.defaultSyncOptions = { 
            'headers': {'Authorization': response.id}
        };
    });
}

function login(loginView) {
    FB.getLoginStatus( function(response) {
        if ( response.status !== 'connected' && response.status !== 'not_authorized' ) { 
            FB.login(function(response) {
                if (response.authResponse) {
                    getUser( loginView );
                } else {
                    // cancelled
                }
            });
        } else {
            getUser( loginView );
        }
    });
}


// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));
