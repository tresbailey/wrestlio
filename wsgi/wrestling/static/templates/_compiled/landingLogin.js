var landingLogin = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if ( !userSession.get('open_id') ) { 
__p+='\n    <a class="btn" href="new_user.html">Register</a>\n    <a class="janrainEngage" href="#">Login</a>\n';
 } else { 
__p+='\n    '+
((__t=( userSession.get('preferred_name')))==null?'':__t)+
'\n    <img src="'+
((__t=( userSession.get('photo')))==null?'':__t)+
'" />\n';
 } 
__p+='\n';
}
return __p;
}