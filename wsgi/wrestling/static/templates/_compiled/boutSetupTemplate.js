var boutSetupTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="modal show">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>Choose Your Matchups</h3>\n  </div>\n  <div class="modal-body">\n      ';
 _.each(weightClasses, function(weight, index) { 
__p+='\n        <div id="matchup_select_'+
((__t=( weight ))==null?'':__t)+
'" class="row thumbnail">\n            <div class="green"></div>\n            <div class="span1 pagination-centered ">\n            <h3><small><b>\n            '+
((__t=( weight ))==null?'':__t)+
' \n            </b></small></h3>     \n            </div>   \n            <div class="red"></div>\n        </div>\n      ';
 }) 
__p+='\n  </div>\n  <div class="modal-footer">\n    <a href="#" class="btn completed btn-inverse"><b>Start Match</b></a>\n  </div>\n</div>\n\n';
}
return __p;
}