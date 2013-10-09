var teamWrestlersTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 var total = 0 
__p+='\n';
 _.each( collection.models, function(wrestler, index) { 
__p+='\n    ';
 if ( index % 2 == 0 ) { 
__p+='\n    <div class="row">\n    ';
 } 
__p+='\n        <div class="span5 thumbnail smallCat">\n            <div class="pagination-centered">\n                Name: '+
((__t=( wrestler.get('first_name') ))==null?'':__t)+
' '+
((__t=( wrestler.get('last_name') ))==null?'':__t)+
'\n                Weight: '+
((__t=( wrestler.get('normal_weight') ))==null?'':__t)+
'\n                Wins: '+
((__t=( wrestler.get('wins') ))==null?'':__t)+
'\n                Losses: '+
((__t=( wrestler.get('losses') ))==null?'':__t)+
'\n            </div>\n        </div>\n    ';
 total = index 
__p+='\n    ';
 if ( index % 2 == 1 ) { 
__p+='\n    </div>\n    ';
 } 
__p+='\n';
 }) 
__p+='\n';
 if ( total % 2 == 0 ) { 
__p+='\n</div>\n';
 } 
__p+='\n';
}
return __p;
}