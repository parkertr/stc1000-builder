@AddStep =
    add: ->
        console.log "1. Add next step fields with ramp"
        elem = $("#addStep-0-0").click((e) ->
            el = e.target.parent()
            console.log el
            el.clone().appendTo el.parent()
        )
        console.log "2. Move data from this step to that one"

    init: ->
        mashStep = $(".stepTemplate")
        console.log mashStep
        buttons =  $(".addStepButton")
        buttons.each (index, button) ->
            console.log button
            # console.log button.parent().parent().data



@doDivThing =
    do: ->
        # $("div").click ->
        #     console.log this

programSteps = [
    [['','',false]], # Program 0, Step 0
    [['','',false]], # Program 1, Step 0
    [['','',false]], # Program 2, Step 0
    [['','',false]], # Program 3, Step 0
    [['','',false]], # Program 4, Step 0
    [['','',false]], # Program 5, Step 0
]

jQuery ->
    AddStep.init()
    doDivThing.do()

    $(document).foundation()
