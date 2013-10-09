var smallBoutTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="'+
((__t=(model.get('weight_class')))==null?'':__t)+
'Bout" class="row">\n    <div class="span4">\nName: '+
((__t=( model.get('green_wrestler').get('first_name') ))==null?'':__t)+
' '+
((__t=( model.get('green_wrestler').get('last_name') ))==null?'':__t)+
'\nWeight: '+
((__t=( model.get('green_wrestler').get('normal_weight') ))==null?'':__t)+
'\nWins: '+
((__t=( model.get('green_wrestler').get('wins') ))==null?'':__t)+
'\nLosses: '+
((__t=( model.get('green_wrestler').get('losses') ))==null?'':__t)+
'\n    </div>\n    <div class="span3 pagination-centered">\n        <button class="btn btn-inverse">Let\'s Wrestle!</button>\n    </div>\n    <div class="span4">\nName: '+
((__t=( model.get('red_wrestler').get('first_name') ))==null?'':__t)+
' '+
((__t=( model.get('red_wrestler').get('last_name') ))==null?'':__t)+
'\nWeight: '+
((__t=( model.get('red_wrestler').get('normal_weight') ))==null?'':__t)+
'\nWins: '+
((__t=( model.get('red_wrestler').get('wins') ))==null?'':__t)+
'\nLosses: '+
((__t=( model.get('red_wrestler').get('losses') ))==null?'':__t)+
'\n    </div>\n</div>\n';
}
return __p;
}