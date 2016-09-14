class StepOutput
    out: (step) ->
        [step.temp(), step.time()]
    hold: (step) ->
        [step.temp(), 0]
    ramp: (fromStep, toStep, degPerMin) ->
         time = Math.round ((toStep.temp() - fromStep.temp()) / degPerMin)
         time = Math.max time, 1
         [fromStep.temp(), time]
    toObject: (step) ->
        {'temp':step.temp(),'time':step.time(),'hold':step.hold(),'ramp':step.ramp()}

class Step
    constructor: (temp, time, ramp=false) ->
        @_temp = temp
        @_time = time
        @_ramp = ramp
    ramp: ->
        @_ramp
    temp: ->
        @_temp
    time: ->
        @_time
    setRamp: (ramp) ->
        @_ramp = ramp
    setTemp: (temp) ->
        @_temp = temp
    setTime: (time) ->
        @_time = time

class Program
    constructor: (number, output, holdBeforeStart=true, rampDegPerMin=1) ->
        @_number = number
        @_output = output
        @_holdBeforeStart = holdBeforeStart
        @_rampDegPerMin = rampDegPerMin
        @_steps = []
    addStep: (step) ->
        @_steps.push step
    setSteps: (steps) ->
        @_steps = []
        for step in steps
            @_steps.push step
    toArray: ->
        out = []
        for step, i in @_steps
            out.push @_output.hold(step) if @_holdBeforeStart and i is 0
            out.push @_output.out(step)
            if (@_steps.length-1) is i
                out.push @_output.hold(step)
            else
                out.push @_output.ramp(step, @_steps[i+1], @_rampDegPerMin) if not step.ramp()
        out
    toTemplate: (template) ->
        out = $('<div/>')
        for step in @_steps
            s = template.clone()
            t = s.find('*[name="temp"]')
            d = s.find('*[name="duration"]')

            t.val(step.temp())
            d.val(step.time())
            t.data('step', step)
            d.data('step', step)

            t.change (e) =>
                input = $(e.target)
                step = input.data('step')
                step.setTemp input.val()
                input.data 'step', step
            d.change (e) =>
                input = $(e.target)
                step = input.data('step')
                step.setTime input.val()
                input.data 'step', step

            s.appendTo out
        out

Steps =
    # Add 5 empty programs
    init: () ->
        template = $("#stepTemplate")

        output = new StepOutput()

        for i in [0..5]
            program = new Program(i, output)
            for step in @default()
                program.addStep(
                    new Step(step.temp, step.time, step.hold, step.ramp)
                )
            # program.toArray()
            p = $('[data-program="'+i+'"]')
            program.toTemplate(template).appendTo p

    default: () ->
        [
            {'temp':66.0,'time':60,'hold':false,'ramp':false},
            {'temp':78.0,'time':10,'hold':false,'ramp':false},
        ]

jQuery ->
    Steps.init()

    $(document).foundation()
