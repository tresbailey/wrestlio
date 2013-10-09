var mainMatchTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<h1>\n    <small>\n        <a href="#schedule/'+
((__t=(model.get('home_school').get('_id')))==null?'':__t)+
'">'+
((__t=( model.get('home_school').get('school_name') ))==null?'':__t)+
'</a>\n       '+
((__t=( model.get('scores')[0] ))==null?'':__t)+
'\n       |\n       '+
((__t=( model.get('scores')[1] ))==null?'':__t)+
'\n        <a href="#schedule/'+
((__t=(model.get('visit_school').get('_id')))==null?'':__t)+
'">'+
((__t=( model.get('visit_school').get('school_name') ))==null?'':__t)+
'</a>\n    </small>\n</h1>\n\n<div class="modal hide">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>Coin Toss</h3>\n  </div>\n  <div class="modal-body">\n    <div class="btn-group" data-toggle="buttons-radio">\n      <button type="button" class="btn btn-danger">'+
((__t=(model.get('visit_school').get('school_name') ))==null?'':__t)+
'</button>\n      <button type="button" class="btn btn-success">'+
((__t=(model.get('home_school').get('school_name') ))==null?'':__t)+
'</button>\n    </div>\n    <div>\n        Selects:\n        <div class="btn-group" data-toggle="buttons-radio">\n          <button type="button" class="btn btn-warning">Odd</button>\n          <button type="button" class="btn btn-info">Even</button>\n        </div>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <a href="#" class="btn btn-inverse">Start match</a>\n  </div>\n</div>\n\n';
}
return __p;
}