var mainBoutTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+=''+
((__t=( _.template($("#boutClockTemplate").html())({model: bout.get('clock')}) ))==null?'':__t)+
'\n    <div class="row">\n        <div class="span1">\n            <h1>\n                '+
((__t=( bout.get('green_wrestler').get('points') ))==null?'':__t)+
'\n            </h1>\n        </div>\n        <div class="span2">\n            <div>\n            </div>\n            <div class="photo-group thumbnail">\n                <div href="#" class="photo-wrapper">\n                    <h2>\n                        <small>\n                            '+
((__t=( bout.get('green_wrestler').get('first_name') ))==null?'':__t)+
'\n                        </small>\n                    </h2>\n                    <div class="photo">\n                        <img class="fixedHeight" src="../images/silhuoette.png" />\n                        <div class="photo-label-left">        \n                            <div class="vote-group">\n                                <a href="#" id="greenPin" class="vote-wrapper voteBtn">\n                                <div class="vote">\n                                    <button class="btn btn-success" >PIN!</button>\n                                    <div class="vote-label-left">\n                                        <small class="btnText">\n                                        </small>        \n                                    </div>  \n                                </div>\n                                </a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n        <div class="span3">\n            <div id="greenMoves" class="well">\n                ';
 var green = this.model.get('green_wrestler');
__p+='\n                ';
 var red = this.model.get('red_wrestler');
__p+='\n                '+
((__t=( _.template($("#movesAvail").html())({wrestler: green, color: 'green'}) ))==null?'':__t)+
'\n            </div>\n            <div class="accordion" id="accordion1">\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion1" href="#1collapseOne">\n                        Round 1\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 1 ? 'in' : '' ))==null?'':__t)+
'"  id="'+
((__t=( green.id ))==null?'':__t)+
'collapse1">\n                        <div class="accordion-inner">   \n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: green, round: 1, color: 'green', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion1" href="#1collapseTwo">\n                        Round 2\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 2 ? 'in' : '' ))==null?'':__t)+
'" id="'+
((__t=( green.id ))==null?'':__t)+
'collapse2">\n                        <div class="accordion-inner">   \n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: green, round: 2, color: 'green', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion1" href="#1collapseThree">\n                        Round 3\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 3 ? 'in' : '' ))==null?'':__t)+
'" id="'+
((__t=( green.id ))==null?'':__t)+
'collapse3">\n                        <div class="accordion-inner">   \n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: green, round: 3, color: 'green', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="span3">\n            <div id="redMoves" class="well">\n            '+
((__t=( _.template($("#movesAvail").html())({wrestler: red, color: 'red'}) ))==null?'':__t)+
'\n            </div>\n            <div class="accordion" id="accordion2">\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">\n                        Round 1\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 1 ? 'in' : '' ))==null?'':__t)+
'" id="'+
((__t=( red.id ))==null?'':__t)+
'collapse1">\n                        <div class="accordion-inner">\n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: red, round: 1, color: 'red', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo">\n                        Round 2\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 2 ? 'in' : '' ))==null?'':__t)+
'" id="'+
((__t=( red.id ))==null?'':__t)+
'collapse2">\n                        <div class="accordion-inner">\n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: red, round: 2, color: 'red', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n                <div class="accordion-group">\n                    <div class="accordion-heading">\n                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseThree">\n                        Round 3\n                        </a>\n                    </div>\n                    <div class="accordion-body collapse '+
((__t=( bout.get('current_round') == 3 ? 'in' : '' ))==null?'':__t)+
'" id="'+
((__t=( red.id ))==null?'':__t)+
'collapse3">\n                        <div class="accordion-inner">  \n                        '+
((__t=( _.template($("#actionOccurred").html())({wrestler: red, round: 3, color: 'red', actions: bout.get('actions')}) ))==null?'':__t)+
'\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n          \n        <div class="span2">\n            <div class="photo-group thumbnail">\n                <div href="#" class="photo-wrapper">\n                    <h2>\n                        <small>\n                            '+
((__t=( bout.get('red_wrestler').get('first_name') ))==null?'':__t)+
'\n                        </small>\n                    </h2>\n                    <div class="photo">\n                        <img class="fixedHeight" src="../images/silhuoette.png" />\n                        <div class="photo-label-right">                \n                            <div class="vote-group">\n                                <a href="#" id="redPin" class="vote-wrapper voteBtn">\n                                <div class="vote">\n                                    <button class="btn btn-danger" >PIN!</button>\n                                    <div class="vote-label-right">\n                                        <small class="btnText">\n                                        </small>        \n                                    </div>\n                                </div>\n                                </a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="span1">\n            <h1>\n                '+
((__t=( bout.get('red_wrestler').get('points') ))==null?'':__t)+
'\n            </h1>\n        </div>\n    </div>\n';
}
return __p;
}