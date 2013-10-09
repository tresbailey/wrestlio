var landingSchoolsTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul >\n    <li class="">\n      <ul class="" id="">\n        ';
 _.each(_.pairs(select_values['High School']), function(states, ind1) { 
__p+='\n        <li class="">\n          '+
((__t=( states[0] ))==null?'':__t)+
'\n          <ul class="">\n            ';
 _.each(_.pairs(states[1]), function(classes, ind2) { 
__p+='\n            <li class="">'+
((__t=(classes[0] ))==null?'':__t)+
'\n                <ul class="">\n                ';
 _.each(_.pairs(classes[1]), function(region, ind3) { 
__p+='\n                    <li class="">'+
((__t=( region[0] ))==null?'':__t)+
'\n                        <ul class="">\n                            ';
 _.each(region[1], function(sch, ind4) { 
__p+='\n                            <li><a href="#schedule/'+
((__t=( sch._id ))==null?'':__t)+
'">'+
((__t=( sch.school_name ))==null?'':__t)+
'</a></li>\n                            ';
 }) 
__p+='\n                        </ul>\n                    </li>\n                ';
 }) 
__p+='\n                </ul>\n            </li>\n            ';
 }) 
__p+='\n          </ul>\n        </li>  \n        ';
 }) 
__p+='\n      </ul>\n    </li>\n</ul>\n';
}
return __p;
}