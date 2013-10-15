var scheduleTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if (userSession && userSession.get('school_id') == school.id) { 
__p+='\n<form name="create_match">\n   <div class="row">\n        <div class="span6 offset3 thumbnail smallCat">\n            <div class="pagination-centered">\n                <div id="createMatchOpp">Opponent</div>\n                <input type="hidden" name="opponent" />\n                My team is \n                <div class="btn-group" id="home_away" data-toggle="buttons-radio">\n                  <button type="button" class="btn btn-info" data-value="away">Away</button>\n                  <button type="button" class="btn btn-warning" data-value="home">Home</button>\n                </div>\n                <div>Date: <input type="date" name="date" /></div>\n                <a href="#" id="create_match" class="btn btn-inverse">Save Match</a>\n            </div>\n        </div>\n    </div>\n</form>\n';
 } 
__p+='\n<ul>\n    ';
 _.each(matches.models, function(match, index) { 
__p+='\n        <li>\n        '+
((__t=( match.get('match_date') ))==null?'':__t)+
' - \n        ';
 if ( match.get('home_school').id == school.get('id') ) { 
__p+='\n            VS - <a href="#match/'+
((__t=( school.get('id') ))==null?'':__t)+
'/'+
((__t=( match.get('visit_school').id ))==null?'':__t)+
'/'+
((__t=( match.get('id') ))==null?'':__t)+
'">'+
((__t=( match.get('visit_school').get('school_name') ))==null?'':__t)+
'</a>\n        ';
 } else { 
__p+='\n            AT - <a href="#match/'+
((__t=( school.get('id') ))==null?'':__t)+
'/'+
((__t=( match.get('home_school').id ))==null?'':__t)+
'/'+
((__t=(match.get('id')))==null?'':__t)+
'">'+
((__t=( match.get('home_school').get('school_name') ))==null?'':__t)+
'</a>\n        ';
 } 
__p+='\n        </li>\n    ';
 }) 
__p+='\n\n</ul>\n';
}
return __p;
}