(function() {
  var Program, Step, StepOutput, Steps;

  StepOutput = (function() {
    function StepOutput() {}

    StepOutput.prototype.out = function(step) {
      return [step.temp(), step.time()];
    };

    StepOutput.prototype.hold = function(step) {
      return [step.temp(), 0];
    };

    StepOutput.prototype.ramp = function(fromStep, toStep, degPerMin) {
      var time;
      time = Math.round((toStep.temp() - fromStep.temp()) / degPerMin);
      time = Math.max(time, 1);
      return [fromStep.temp(), time];
    };

    StepOutput.prototype.toObject = function(step) {
      return {
        'temp': step.temp(),
        'time': step.time(),
        'hold': step.hold(),
        'ramp': step.ramp()
      };
    };

    return StepOutput;

  })();

  Step = (function() {
    function Step(temp, time, ramp) {
      if (ramp == null) {
        ramp = false;
      }
      this._temp = temp;
      this._time = time;
      this._ramp = ramp;
    }

    Step.prototype.ramp = function() {
      return this._ramp;
    };

    Step.prototype.temp = function() {
      return this._temp;
    };

    Step.prototype.time = function() {
      return this._time;
    };

    Step.prototype.setRamp = function(ramp) {
      return this._ramp = ramp;
    };

    Step.prototype.setTemp = function(temp) {
      return this._temp = temp;
    };

    Step.prototype.setTime = function(time) {
      return this._time = time;
    };

    return Step;

  })();

  Program = (function() {
    function Program(number, output, holdBeforeStart, rampDegPerMin) {
      if (holdBeforeStart == null) {
        holdBeforeStart = true;
      }
      if (rampDegPerMin == null) {
        rampDegPerMin = 1;
      }
      this._number = number;
      this._output = output;
      this._holdBeforeStart = holdBeforeStart;
      this._rampDegPerMin = rampDegPerMin;
      this._steps = [];
    }

    Program.prototype.addStep = function(step) {
      return this._steps.push(step);
    };

    Program.prototype.setSteps = function(steps) {
      var j, len, results, step;
      this._steps = [];
      results = [];
      for (j = 0, len = steps.length; j < len; j++) {
        step = steps[j];
        results.push(this._steps.push(step));
      }
      return results;
    };

    Program.prototype.toArray = function() {
      var i, j, len, out, ref, step;
      out = [];
      ref = this._steps;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        step = ref[i];
        if (this._holdBeforeStart && i === 0) {
          out.push(this._output.hold(step));
        }
        out.push(this._output.out(step));
        if ((this._steps.length - 1) === i) {
          out.push(this._output.hold(step));
        } else {
          if (!step.ramp()) {
            out.push(this._output.ramp(step, this._steps[i + 1], this._rampDegPerMin));
          }
        }
      }
      return out;
    };

    Program.prototype.toTemplate = function(template) {
      var d, j, len, out, ref, s, step, t;
      out = $('<div/>');
      ref = this._steps;
      for (j = 0, len = ref.length; j < len; j++) {
        step = ref[j];
        s = template.clone();
        t = s.find('*[name="temp"]');
        d = s.find('*[name="duration"]');
        t.val(step.temp());
        d.val(step.time());
        t.data('step', step);
        d.data('step', step);
        t.change((function(_this) {
          return function(e) {
            var input;
            input = $(e.target);
            step = input.data('step');
            step.setTemp(input.val());
            return input.data('step', step);
          };
        })(this));
        d.change((function(_this) {
          return function(e) {
            var input;
            input = $(e.target);
            step = input.data('step');
            step.setTime(input.val());
            return input.data('step', step);
          };
        })(this));
        s.appendTo(out);
      }
      return out;
    };

    return Program;

  })();

  Steps = {
    init: function() {
      var i, j, k, len, output, p, program, ref, results, step, template;
      template = $("#stepTemplate");
      output = new StepOutput();
      results = [];
      for (i = j = 0; j <= 5; i = ++j) {
        program = new Program(i, output);
        ref = this["default"]();
        for (k = 0, len = ref.length; k < len; k++) {
          step = ref[k];
          program.addStep(new Step(step.temp, step.time, step.hold, step.ramp));
        }
        p = $('[data-program="' + i + '"]');
        results.push(program.toTemplate(template).appendTo(p));
      }
      return results;
    },
    "default": function() {
      return [
        {
          'temp': 66.0,
          'time': 60,
          'hold': false,
          'ramp': false
        }, {
          'temp': 78.0,
          'time': 10,
          'hold': false,
          'ramp': false
        }
      ];
    }
  };

  jQuery(function() {
    Steps.init();
    return $(document).foundation();
  });

}).call(this);
