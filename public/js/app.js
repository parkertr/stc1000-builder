(function() {
  var programSteps;

  this.AddStep = {
    add: function() {
      var elem;
      console.log("1. Add next step fields with ramp");
      elem = $("#addStep-0-0").click(function(e) {
        var el;
        el = e.target.parent();
        console.log(el);
        return el.clone().appendTo(el.parent());
      });
      return console.log("2. Move data from this step to that one");
    },
    init: function() {
      var buttons, mashStep;
      mashStep = $(".stepTemplate");
      console.log(mashStep);
      buttons = $(".addStepButton");
      return buttons.each(function(index, button) {
        return console.log(button);
      });
    }
  };

  this.doDivThing = {
    "do": function() {}
  };

  programSteps = [[['', '', false]], [['', '', false]], [['', '', false]], [['', '', false]], [['', '', false]], [['', '', false]]];

  jQuery(function() {
    AddStep.init();
    doDivThing["do"]();
    return $(document).foundation();
  });

}).call(this);
