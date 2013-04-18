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
      } else if (response.status === 'not_authorized') {
        // not_authorized
      } else {
        // not_logged_in
      }
   });
    // Additional init code here

};

function login(userSession) {
    FB.login(function(response) {
        if (response.authResponse) {
            // connected
            FB.api('/me', function(response) {
                userSession.set('facebook_id', response.id);
            });
        } else {
            // cancelled
        }
    });
}

function checkForLogin( userSession ) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // connected
        console.log("CONNECTED TO FACEBOOK");
        userSession = window.userSession;
        FB.api('/me', function(response) {
            userSession.set('facebook_id', response.id);
        });
      } else if (response.status === 'not_authorized') {
        // not_authorized
      } else {
        // not_logged_in
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
