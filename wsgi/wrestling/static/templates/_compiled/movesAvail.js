var movesAvail = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 _(_.filter(_.values(move_lookup), function(val) { return moveComparison(val, wrestler);})).each(function(move, index) { 
__p+='\n    <button class="btn btn-'+
((__t=( color == 'red' ? 'danger': 'success' ))==null?'':__t)+
'" id="'+
((__t=( move.get('move_id') ))==null?'':__t)+
'">'+
((__t=( move.get('move_name') ))==null?'':__t)+
'</button>\n';
});
__p+='\n\n';
}
return __p;
}