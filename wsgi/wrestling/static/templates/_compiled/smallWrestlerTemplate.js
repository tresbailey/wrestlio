var smallWrestlerTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="span1 smallCat ">\n    <h3>\n    <small>\n        <div><b>Name:</b> '+
((__t=( wrestler.get('first_name') ))==null?'':__t)+
' '+
((__t=( wrestler.get('last_name') ))==null?'':__t)+
'</div>\n        <div><b>Weight:</b> '+
((__t=( wrestler.get('normal_weight') ))==null?'':__t)+
'</div>\n        <div><b>Wins:</b> '+
((__t=( wrestler.get('wins') ))==null?'':__t)+
'</div>\n        <div><b>Losses:</b> '+
((__t=( wrestler.get('losses') ))==null?'':__t)+
'</div>\n        <input type="hidden" value="'+
((__t=( wrestler.id ))==null?'':__t)+
'" name="wrest_id" />\n    </small>\n    </h3>\n</div>\n<div class="span1 smallCat">\n    <button class="btn choose btn-'+
((__t=( color=='green'? 'success' : 'danger' ))==null?'':__t)+
'">Select</button>\n</div>\n\n';
}
return __p;
}