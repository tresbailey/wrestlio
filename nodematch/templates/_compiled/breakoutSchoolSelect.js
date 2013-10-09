var breakoutSchoolSelect = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul class="nav nav-pills">\n    <li class="dropdown">\n      <a href="#" data-toggle="dropdown" id="school_selection" class="dropdown-toggle">Opponent <b class="caret"></b></a>\n      <ul class="dropdown-menu" id="menu1">\n        ';
 _.each(_.pairs(select_values), function(states, ind1) { 
__p+='\n        <li class="dropdown-submenu">\n          <a href="#">'+
((__t=( states[0] ))==null?'':__t)+
'</a>\n          <ul class="dropdown-menu">\n            ';
 _.each(_.pairs(states[1]), function(classes, ind2) { 
__p+='\n            <li class="dropdown-submenu"><a href="#">'+
((__t=(classes[0] ))==null?'':__t)+
'</a>\n                <ul class="dropdown-menu">\n                ';
 _.each(_.pairs(classes[1]), function(region, ind3) { 
__p+='\n                    <li class="dropdown-submenu"><a href="#">'+
((__t=(region[0] ))==null?'':__t)+
'</a>\n                        <ul class="dropdown-menu">\n                            ';
 _.each(region[1], function(school, ind4) { 
__p+='\n                            <li><a class="school_select" href="#">\n                                '+
((__t=( school.school_name ))==null?'':__t)+
'\n                                <input type="hidden" value="'+
((__t=(school._id ))==null?'':__t)+
'" />\n                            </a></li>\n                            ';
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