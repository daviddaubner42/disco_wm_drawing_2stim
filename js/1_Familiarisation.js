import { enter_fullscreen } from "./fullscreen.js";

// This is a wrapper function for the Familiarisation part of the experiment.
// It defines the individual components and specifies their order.
function familiarisation_builder(jsPsych) {

    const handedness = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Are you right-handed or left-handed?</h2>",
        choices: ['Left-handed', 'Right-handed'],
        data: {
            task: 'handedness'
        }
    }

    const familiarisation_instructions = {
        type: jsPsychImageKeyboardResponse,
        stimulus: function () {
            var hand = jsPsych.data.get().filter({task: 'handedness'}).trials[0].response;
            // Different instructions are displayed depending on participant's handedness.
            if (hand == 0) {
                return "img/tablet-left.png";
            } else {
                return "img/tablet-right.png";
            }
        },
        prompt: "<h1>Welcome to our experiment!</h1></br>"
                    + "<h2>First you should familiarise yourself with the drawing tablet.</h2>"
                    + "</br><h2>You will always use the tablet to draw within the drawing area, " 
                    + "please never use the mouse. You can also use the pen to click on buttons on the screen, just as you would use a touchpad."
                    + "</br>To continue, press the \"Next\" button indicated in the picture above. </br>"
                    + "You will use this button throughout the experiment. "
                    + "You might find it faster and more convenient to use your non-dominant hand to press this button, and your dominant hand to draw with the pen.</h2>",
        choices: [' '],
        stimulus_width: 600,
        response_ends_trial: true
    }

    // The images participant will be asked to reproduce in familiarisation.
    const familiarisation_vars = [
        {stimulus: "img/fam-apple.png"},
        {stimulus: "img/fam-cat.png"}
    ];

    const familiarisation_stim = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<div class='text_instructions'><br>" 
        + "<h2>In a while you will be asked to reproduce the following drawing.</br></h2>"
        + "<img src=\"img/fam-triangle.png\" style=\"width: 250px; height: 250px;\"></img>"
        + "<h2>If it's more comfortable for you, you can rest your hand on the drawing pad while using the pen, this will not impact its function.</br>"
        + "You can move the cursor around the screen by hovering the pen tip slightly above the tablet screen, and then draw/click by touching the tablet screen with the pen tip. "
        + "First we will walk you through the sketchpad functionality.</h2>"
        + "Press the \"Next\" button to continue.</div>",
        choices: [' ']
    }

    const familiarisation_sketchpad_eraser = {
        type: jsPsychSketchpad,
        prompt: function () {
            return "<div style=\"padding: 10px;\">" 
                + "<div style=\"float: right; display: block; margin-right: 5%;\"><img src=\"img/fam-triangle.png\" style=\"width: 200px; height: 200px; display: inline;\"></img></div>" 
                + "<div style=\"float: left; display: block; margin-top: 3%; width: 80%;\"><h2 style=\"margin: 0;\">On the bottom left, you can choose between the pen (black) or an eraser (white). Try it out!</h2>"
                + "Press the \"Next\" button to continue.</div>"
        },
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 180000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'familiarisation',
            stimulus_path: 'img/fam-triangle.png'
        }
    }

    const familiarisation_sketchpad_buttons = {
        type: jsPsychSketchpad,
        prompt: function () {
            return "<div style=\"padding: 10px;\">" 
                + "<div style=\"float: right; display: block; margin-right: 5%;\"><img src=\"img/fam-triangle.png\" style=\"width: 200px; height: 200px; display: inline;\"></img></div>" 
                + "<div style=\"float: left; display: block; width: 80%; margin-top: 1%;\"><h2 style=\"margin: 0;\">On the bottom right, you can see three buttons.</br>"
                + "You can use the \"Clear\" button to erase everything,"
                + "the \"Undo\" button to erase your last stroke, "
                + "and the \"Redo\" button to draw the erased stroke back. Try it out!</h2>"
                + "Press the \"Next\" button to continue.</div>"
        },
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 180000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'familiarisation',
            stimulus_path: 'img/fam-triangle.png'
        }
    }

    const familiarisation_sketchpad_submit = {
        type: jsPsychSketchpad,
        prompt: function () {
            return "<div style=\"padding: 10px;\">" 
            + "<div style=\"float: right; display: block; margin-right: 5%;\"><img src=\"img/fam-triangle.png\" style=\"width: 200px; height: 200px; display: inline;\"></img></div>" 
            + "<div style=\"float: left; display: block; margin-top: 3%; width: 80%;\"><h2 style=\"margin: 0;\">Now go ahead and reproduce the image on the right.</br>"
            + "When you are ready, press the \"Next\" button to submit your drawing.</h2>"           
        },
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 180000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'familiarisation',
            stimulus_path: 'img/fam-triangle.png'
        }
    }

    // This component checks if the participant drew something and submitted. If either is not true,
    // the participant is notified and the trial repeats.
    const familiarisation_feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            if (jsPsych.data.get().last(1).values()[0].strokes.length === 0) {
                return '<h2>You didn\'t draw anything!</h2> Press the \"Next\" button to continue.';
            } else if (jsPsych.data.get().last(1).values()[0].response != ' ') {
                return '<h2>You didn\'t submit your drawing. Please always press the \"Next\" button to submit your work.</h2> Press the \"Next\" button to continue.';
            } else {
                return '<h2>Well done!</h2> Press the \"Next\" button to continue.';
            }
        },
        choices: [' ']
    }

    // Ensures the trial repeats as long as either the participant didn't draw anything or didn't submit.
    const looping_familiarisation_feedback_first = {
        timeline: [familiarisation_sketchpad_submit, familiarisation_feedback],
        loop_function: function () {
            return (jsPsych.data.get().last(2).values()[0].strokes.length === 0 || jsPsych.data.get().last(2).values()[0].response != ' ');
        }
    }

    const familiarisation_middle_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<h2>Now you will be asked to reproduce two more drawings to get some practice with the drawing tablet.</h2>"
                    + "Press the \"Next\" button to continue",
        choices: [' ']
    }

    const familiarisation_sketchpad = {
        type: jsPsychSketchpad,
        prompt: function () {
            return "<div style=\"padding: 10px;\">" 
            + "<div style=\"float: right; display: block; margin-right: 15%;\"><img src=\"" + jsPsych.timelineVariable('stimulus') + "\" style=\"width: 200px; height: 200px; display: inline;\"></img></div>" 
            + "<div style=\"float: left; display: block; margin-top: 3%; width: 70%;\"><h2 style=\"margin: 0;\">Please reproduce the image on the right.</h2>"
            + "When you are ready, press the \"Next\" button to submit your drawing.</div>"
        },
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 180000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'familiarisation',
            stimulus_path: jsPsych.timelineVariable('stimulus')
        }
    }

    // Ensures the trial repeats as long as either the participant didn't draw anything or didn't submit.
    const looping_familiarisation_feedback = {
        timeline: [familiarisation_sketchpad, familiarisation_feedback],
        loop_function: function () {
            return (jsPsych.data.get().last(2).values()[0].strokes.length === 0 || jsPsych.data.get().last(2).values()[0].response != ' ');
        }
    }

    // Specifies the stimuli (timeline variables) to be used in the familiarisation trials
    const familiarisation = {
        timeline: [looping_familiarisation_feedback],
        timeline_variables: familiarisation_vars
    }

    const freedraw_sketchpad = {
        type: jsPsychSketchpad,
        prompt: "<h2>Feel free to practice for a few more minutes if you like.</h2>"
                + "When you are ready, press the \"Next\" button to continue.",
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 180000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'familiarisation',
            stimulus_path: ''
        }
    }

    // The familiarisation timeline
    const familiarisation_exp = {
        timeline: [
            handedness,
            enter_fullscreen,
            familiarisation_instructions, 
            familiarisation_stim, 
            familiarisation_sketchpad_eraser, 
            familiarisation_sketchpad_buttons, 
            looping_familiarisation_feedback_first,
            familiarisation_middle_instructions,
            familiarisation,
            freedraw_sketchpad
        ]
    }

    return familiarisation_exp;
}

export { familiarisation_builder as familiarisation };