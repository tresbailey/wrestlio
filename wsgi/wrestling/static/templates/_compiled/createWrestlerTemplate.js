var createWrestlerTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div>\n';
 if (userSession && userSession.get('school_id') == this.model.get('id')) { 
__p+='\n    <form>\n        <div class="row">\n        <div class="span6 offset3 thumbnail smallCat">\n            <div class="pagination-centered">\n                <div>First Name: <input type="text" name="first_name" /></div>\n                <div>Last Name: <input type="text" name="last_name" /></div>\n                <div>Normal Weight: <input type="text" name="avg_wt" /></div>\n                <div>Qualified Weight: <input type="text" name="qual_wt" /></div>\n                <a href="#" id="create_wrestler" class="btn btn-inverse">Save Wrestler</a>\n            </div>\n        </div>\n    </div>\n    </form>\n    ';
 } 
__p+='\n    <div id="existingRoster">\n    </div>\n</div>\n\n';
}
return __p;
}