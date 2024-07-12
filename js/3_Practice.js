import { fixation, isi_fixation, iti_fixation } from "./fixation_crosses.js";

// This is a wrapper function for the Practice part of the experiment.
// It defines the individual components and specifies their order.
function practice_builder(jsPsych) {

    // how many practice trials can a participant fail before they have to repeat the practice
    const allowed_misses = 1;

    const practice_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<h2>Now you will do two practice rounds to familiarise yourself with the task.</br>'
            + 'In these practice rounds, you will see how much time you have left to draw the shape,'
            + ' and you will be informed if you fail to submit any drawing. This won\'t be the case in the actual experiment.</h2>'
            + 'Press the \"Next\" button to continue.',
        choices: [' ']
    }

    var missed = 0; // counts how many trials the participant failed so far

    var n_practice = 6; // the number of practice trials to be done

    // Create lists of stimuli to be used in practice.
    var practice_stims1 = [];
    for (var i = 1; i <= n_practice; i++) {
        practice_stims1.push("img/practice/stim_" + i + ".png");
    }
    var practice_stims2 = [];
    for (var i = 1; i <= n_practice; i++) {
        practice_stims2.push("img/practice/stim_" + (n_practice + i) + ".png");
    }

    // Shuffle the stimulus names before constructing the trial variables
    practice_stims1 = practice_stims1.sort((a, b) => 0.5 - Math.random());
    practice_stims2 = practice_stims2.sort((a, b) => 0.5 - Math.random());

    var practice_vars = [];
    for (var i = 0; i < n_practice; i++) {
        practice_vars.push({ stim_1: practice_stims1[i], stim_2: practice_stims2[i]});
    }

    // Create list of cues to be used in the trials
    var cues = jsPsych.randomization.sampleWithReplacement([1, 2], n_practice);

    // Add the cues to the trial variables
    for (var i = 0; i < n_practice; i++) {
        practice_vars[i]['cue'] = cues[i];
    }

    console.log(practice_vars);

    const practice_stimulus1 = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stim_1'),
        choices: "NO_KEYS",
        trial_duration: 750,
        stimulus_width: 400,
        stimulus_height: 400,
        on_start: function(trial) {
            document.body.style.cursor= "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor= "auto";
        }
    }

    const practice_stimulus2 = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stim_2'),
        choices: "NO_KEYS",
        trial_duration: 750,
        stimulus_width: 400,
        stimulus_height: 400,
        on_start: function(trial) {
            document.body.style.cursor= "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor= "auto";
        }
    }

    const cue = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            return "<h1 style=\"font-size: 800%;\"><strong>" + jsPsych.timelineVariable('cue').toString() + "</strong></h1>";
        },
        choices: "NO_KEYS",
        trial_duration: 500,
        on_start: function(trial) {
            document.body.style.cursor= "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor= "auto";
        },
        data: {
            task: 'cue',
            cue: jsPsych.timelineVariable('cue')
        }
    }

    const practice_recall = {
        type: jsPsychSketchpad,
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 20000,
        show_countdown_trial_duration: true,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'practice',
            stimulus_path: jsPsych.timelineVariable('stimulus'),
            block: 'practice',
            cue: function () {
                return jsPsych.data.get().filter({task: 'cue'}).trials.slice(-1)[0].cue;
            }
        },
        on_finish: function (data) {
            // Save whether the participant drew anything
            data.blank = data.strokes.length === 0;
            // and whether they submitted the drawing.
            data.submitted = data.response == ' ';
        }
    }

    // This component checks if the participant drew something and submitted. If either is not true,
    // the participant is notified and the trial repeats.
    const practice_feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            if (jsPsych.data.get().last(1).values()[0].strokes.length === 0) {
                missed++;
                return '<h2>You didn\'t draw anything!</h2> Press the \"Next\" button to continue.';
            } else if (jsPsych.data.get().last(1).values()[0].response != ' ') {
                missed++;
                return '<h2>You didn\'t submit your drawing. Please always press the \"Next\" button to submit your work.</h2> Press the \"Next\" button to continue.';
            } else {
                return '';
            }
        },
        choices: [' ']
    }

    // Ensures the trial repeats as long as either the participant didn't draw anything or didn't submit.
    const practice_feedback_conditional = {
        timeline: [practice_feedback],
        conditional_function: function () {
            return (jsPsych.data.get().last(1).values()[0].strokes.length === 0 || jsPsych.data.get().last(1).values()[0].response != ' ');
        }
    }

    // Creates the practice trials
    var practice = {
        timeline: [practice_stimulus1, isi_fixation, practice_stimulus2, isi_fixation, cue, fixation, practice_recall, practice_feedback_conditional, iti_fixation],
        timeline_variables: practice_vars,
        randomize_order: true
    }

    // This component checks whether the participant failed more than the allowed number of practice trials.
    // If they did, they get notified and the practice repeats.
    const debrief = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            if (missed > allowed_misses) {
                return '<div class="text_instructions"><br>'
                        +'<h2>Unfortunately it seems you had some trouble complying with the instructions.</br>'
                        + 'You will now go through the practice trials one more time. Please remember to </h2>'
                        + '<ol> <li><h2>Always draw the shape you saw at the beginning of the trial.</h2></li>'
                        + '<li><h2>Always submit your drawing using the \"Next\" button.</h2></li></ol>'
                        + 'Press the \"Next\" button to try again.</div>';
            } else {
                return '<div class="text_instructions"><br>'
                        + '<h2><strong>Well done!</strong></h2></br>'
                        + '<h2>You have successfully completed the practice trials! '
                        + 'Now you can continue to the experiment.</h2>'
                        + 'Press the \"Next\" button to continue.'
            }
        },
        choices: [' ']
    }

    // Ensures the practice repeats if the participant failed too many trials.
    var looping_practice = {
        timeline: [iti_fixation, practice, debrief],
        loop_function: function () {
            var loop = missed > allowed_misses;
            missed = 0;
            return loop;
        }
    }

    // Submits the data collected so far to the server.
    var submit_data = {
        type: jsPsychCallFunction,
        func: function () {
            jatos.uploadResultFile(jsPsych.data.get().json(), "practice_results.json")
                .then(() => console.log("File was successfully uploaded"))
                .catch(() => console.log("File upload failed"));
            jatos.submitResultData(jsPsych.data.get().json());
        }
    }

    // The practice timeline
    const practice_exp = {
        timeline: [practice_instructions, looping_practice, submit_data]
    }

    return practice_exp;
}

export { practice_builder as practice };