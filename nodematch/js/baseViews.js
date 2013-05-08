
var ModalView = Backbone.View.extend({
    initialize: function() {

    },
    events: {
        "click button.close": "close_modal"
    },
    close_modal: function(event) {
        var parentModal = $(this.el).children(".modal"); 
        $(parentModal).removeClass("show");
        $(parentModal).addClass("hide");
    }
});
