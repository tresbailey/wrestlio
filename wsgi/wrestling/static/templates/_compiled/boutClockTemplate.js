var boutClockTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="boutClock" class="row">\n      <div class="span2 offset5 centered">\n          <div style="padding-left: 5px;">\n              <div class="photo-group thumbnail">\n                  <div href="#" class="photo-wrapper">\n                      <div class="photo">\n                          <canvas id="pie-countdown" class="runningClock" height="150px" width="300px"> \n                          Sorry, it doesn\'t work for you.\n                          </canvas>\n                          <div class="vote-group">\n                              <a href="#" id="voteBtn" class="vote-wrapper voteBtn">\n                                  <div class="vote">\n                                      <div class="vote-label-left" style="left: -92px; bottom: 22px">\n                                          <h1 class="btnText">\n                                              <small>\n                                                  <div id="left" style="color: #aaaaaa">\n                                                      '+
((__t=( model.get('str_clock') ))==null?'':__t)+
'\n                                                  </div>                \n                                                  <div id="secondsleft" style="display: none">\n                                                      '+
((__t=( model.get('left') ))==null?'':__t)+
'\n                                                  </div>\n                                              </small>\n                                          </h1>\n                                      </div>\n                                  </div>\n                              </a>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n          </div>\n      </div>\n  </div>\n';
}
return __p;
}