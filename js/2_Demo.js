// This is a wrapper function for the Demo part of the experiment.
// It defines the individual components and specifies their order.
function demo_builder(jsPsych) {

    const demo_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<h2>Please read the following instructions carefully.</br>'
                + 'We will first explain the experiment step-by-step, then you will do a short demo version of the task.</h2>'
                + 'Press \"Next\" button to continue.',
        choices: [' '],
        response_ends_trial: true
    }

    const demo_fixation_1 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-size:60px; margin-bottom: 7%;">+</div>`,
        choices: [' '],
        prompt: "<div class='text_instructions'><br><hr width='90%'>"
            + "<h2>In each trial, you will first see a cross in the center of the screen. "  
            + "Please keep your eyes fixed on this cross.</h2>"
            + "Press the \"Next\" button to continue.</div>"
    }

    const demo_stimulus_inst = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<img src="img/demo/stim_1.png" style="width: 400px; height=400px;"></img>',
        choices: [' '],
        stimulus_width: 250,
        stimulus_height: 250,
        prompt: "<div class='text_instructions'><br><hr width='90%'>"
            + "<h2>Afterwards, you will see a shape on the screen.</br>"
            + "Later you will be asked to draw it, so try to remember it as accurately as possible.</br>" 
            + "In the actual experiment, this shape will only appear for a very short time. </h2>"
            + "Press the \"Next\" button to continue.</div>"
    }

    const demo_fixation_2 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-size:60px; margin-bottom: 7%;">+</div>`,
        choices: [' '],
        prompt: "<div class='text_instructions'><br><hr width='90%'>"
            + "<h2>After the shape disappears, there will be several seconds of delay when you should keep your eyes " 
            + "fixed on the cross in the center of the screen. </h2> Press the \"Next\" button to continue.</div>"
    }

    const demo_close_shape = {
        type: jsPsychImageKeyboardResponse,
        stimulus: 'img/shape_closing_example.png',
        choices: [' '],
        prompt: "<div class='text_instructions'><br><hr width='90%'>"
                + "<h2>Next you will be asked to draw the shape you saw at the beginning of the trial."
                + "<br> Please only draw the contour of the shape (don't colour the inside!).</br>" 
                + "Also make sure to <strong><u>draw the entire outline, without any holes</u></strong>.</h2>"
                + "Press the \"Next\" button to continue.</div>"
    }

    const demo_recall = {
        type: jsPsychSketchpad,
        prompt_location: 'belowcanvas',
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        prompt: "<div class='text_instructions'>" 
        + "<h2><br>Try it out now! Don't forget to submit your drawing.</h2>"
        + "Please only draw the contour of the shape (don't colour the inside!).</br>" 
        + "Also make sure to <strong><u>draw the entire outline, without any holes</u></strong>.",
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'demo',
            stimulus_path: 'img/demo/stim_1.png'
        }
    }

    // This component checks if the participant drew something and submitted. If either is not true,
    // the participant is notified and the trial repeats.
    const demo_feedback = {
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
    const looping_recall_feedback = {
        timeline: [demo_recall, demo_feedback],
        loop_function: function () {
            return (jsPsych.data.get().last(2).values()[0].strokes.length === 0 || jsPsych.data.get().last(2).values()[0].response != ' ');
        }
    }

    const demo_iti_fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-size:60px; margin-bottom: 7%;">+</div>`,
        choices: [' '],
        prompt: "<div class='text_instructions'><br><hr width='90%'>"
            + "<h2>After you submit your drawing, there will be a short delay before the next trial begins, " 
            + "when you should keep your eyes fixed on the cross. </h2> Press the \"Next\" button to continue.</div>"
    }

    var demo = [demo_fixation_1, demo_stimulus_inst, demo_fixation_2, demo_close_shape, looping_recall_feedback, demo_iti_fixation];

    // The demo timeline
    const demo_exp = {
        timeline: [demo_instructions, ...demo]
    }

    return demo_exp;
}

export { demo_builder as demo };