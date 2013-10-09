var actionOccurred = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 _(_.filter(actions.models, function(mod) { return (mod.get('actor') == wrestler.id && round == mod.get('round_number')) ;})).each(function(val, index) { 
__p+='\n    <button class="btn btn-'+
((__t=( color == 'red' ? 'danger': 'success' ))==null?'':__t)+
'">'+
((__t=( val.get('point_value') ))==null?'':__t)+
'</button>\n';
});
__p+='\n';
}
return __p;
}