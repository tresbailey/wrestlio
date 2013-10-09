var setupUser = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="modal ">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>You\'re Almost Ready</h3>\n  </div>\n  <div class="modal-body">\n    <div>\n        Tell us about yourself:\n        First Name: <input type="text" name="fb_first" value="'+
((__t=( userSession.get('fb_first') ))==null?'':__t)+
'" />\n    </div>\n  </div>\n  <div class="modal-footer">\n    <a href="#" id="makeUser" class="btn btn-inverse">Create Me</a>\n  </div>\n</div>\n\n';
}
return __p;
}