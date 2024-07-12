import { fixation, isi_fixation, iti_fixation } from "./fixation_crosses.js";

function countdown(seconds) {
    // This function is necessary for the countdown during pause to work.

    var init_time = new Date().getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = 1000*seconds - (now - init_time);

        var left = Math.floor(distance / 1000);

        // Display the result in the element with id="counter"
        if (distance < -3000) {
            clearInterval(x);
        } else if (distance < 0) {
            document.getElementById("counter").innerHTML = "GET READY";    
        } else {
            document.getElementById("counter").innerHTML = left + "s ";
        }

    }, 1000); // repeat every second
}

// This is a wrapper function for the Main part of the experiment.
// It defines the individual components and specifies their order.
function main_builder(jsPsych) {

    // Define parameters
    const num_blocks = 2; // 6
    const trials_in_block = 2; // 30
    const pause_length = 180; // 180

    var stim_names1 = [];
    for (var i = 0; i < num_blocks; i++) {
        for (var j = 0; j < Math.ceil(trials_in_block); j++) {
            stim_names1.push("img/main/stim_" + (i*trials_in_block + j + 1) + ".png");
        }
    }
    var stim_names2 = [];
    for (var i = num_blocks; i < 2*num_blocks; i++) {
        for (var j = 0; j < Math.ceil(trials_in_block); j++) {
            stim_names2.push("img/main/stim_" + (i*trials_in_block + j + 1) + ".png");
        }
    }

    // Shuffle the stimulus names before constructing the trial variables
    stim_names1 = stim_names1.sort((a, b) => 0.5 - Math.random());
    stim_names2 = stim_names2.sort((a, b) => 0.5 - Math.random());

    var main_vars = [];
    for (var i = 0; i < num_blocks*trials_in_block; i++) {
        main_vars.push({ stim_1: stim_names1[i], stim_2: stim_names2[i]});
    }

    // Create list of cues to be used in the trials
    var cues = jsPsych.randomization.sampleWithReplacement([1, 2], num_blocks*trials_in_block);

    // Add the cues to the trial variables
    for (var i = 0; i < main_vars.length; i++) {
        main_vars[i]['cue'] = cues[i];
    }

    // Append the block number to each of the timeline variables
    // This leads to structure like { stim_1: "stim/path/something.png", stim_2: "stim/path/something_else.png", block: 2 }
    for (var i = 0; i < main_vars.length; i++) {
        main_vars[i]['block'] = Math.floor(i/trials_in_block) + 1;
    }

    console.log(main_vars);

    const main_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<h2><strong>Now it\'s time for the experiment!</strong></br>' 
                + 'The experiment is divided into 6 blocks.</br>'
                + 'If you would like to take a longer break this is the right time! '
                + 'The experiment will take around 100 minutes, '
                + 'but you will have an opportunity to take a 3 minute break cca every 15 minutes.</br>'
                + 'Remember, your goal is to memorize the shape you see, and then draw it '
                + 'as accurately as possible in the given time limit.</br>'
                + 'In the experiment, you won\'t see the countdown above the drawing area anymore, '
                + 'but you will have the same amount of time as you did in the demo trials.</h2>'
                + 'Press the \"Next\" button to continue.',
        choices: [' ']
    }

    const last_confirmation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<h2>Press "Next" to start the experiment</h2>',
        choices: [' ']
    }

    const main_stimulus1 = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stim_1'),
        choices: "NO_KEYS",
        trial_duration: 750,
        stimulus_width: 400,
        stimulus_height: 400,
        // Make the cursor disappear while the stimulus is displayed
        on_start: function(trial) {
            document.body.style.cursor = "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor = "auto";
        }
    }

    const main_stimulus2 = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stim_2'),
        choices: "NO_KEYS",
        trial_duration: 750,
        stimulus_width: 400,
        stimulus_height: 400,
        // Make the cursor disappear while the stimulus is displayed
        on_start: function(trial) {
            document.body.style.cursor = "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor = "auto";
        }
    }

    const cue = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<h1 style=\"font-size: 800%;\"><strong>" + jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0] + "</strong></h1>",
        choices: "NO_KEYS",
        trial_duration: 500,
        on_start: function(trial) {
            document.body.style.cursor= "none";
        },
        on_finish: function(trial) {
            document.body.style.cursor= "auto";
        },
        data: {
            task: 'cue'
        }
    }

    const main_recall = {
        type: jsPsychSketchpad,
        stroke_color_palette: ['black', 'white'],
        stroke_color: 'black',
        stroke_width: 5,
        canvas_width: 1500,
        canvas_height: 700,
        canvas_border_width: 1,
        trial_duration: 200000,
        show_countdown_trial_duration: false,
        show_finished_button: false,
        choices: [' '],
        data: {
            task: 'main_experiment',
            stimulus_path: jsPsych.timelineVariable('stimulus'),
            block: jsPsych.timelineVariable('block'),
            cue: jsPsych.data.get().filter({task: 'cue'}).last(1).values()[0]
        },
        on_finish: function (data) {
            // Save whether the participant drew anything
            data.blank = data.strokes.length === 0;
            // and whether they submitted anything.
            data.submitted = data.response == ' ';
        }
    }

    // This component checks if the participant drew something and submitted. If either is not true,
    // the participant is notified and the trial repeats.
    const main_feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            if (jsPsych.data.get().last(1).values()[0].strokes.length === 0) {
                return '<h2>You didn\'t draw anything!</h2>'
            } else if (jsPsych.data.get().last(1).values()[0].response != ' ') {
                return '<h2>You didn\'t submit your drawing. Please always press the \"Next\" button to submit your work.</h2>'
            } else {
                return ''
            }
        },
        choices: 'NO_KEYS',
        trial_duration: 3000
    }

    // Ensures the trial repeats as long as either the participant didn't draw anything or didn't submit.
    const main_feedback_conditional = {
        timeline: [main_feedback],
        conditional_function: function () {
            return (jsPsych.data.get().last(1).values()[0].strokes.length === 0 || jsPsych.data.get().last(1).values()[0].response != ' ');
        }
    }

    var curr_block = 0; // keeps track of the current block
    const pause = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
                    curr_block++;

                    // Displays the pause message until the last block is completed, then it shows the final message.
                    if (curr_block == num_blocks) {
                        return "<h1>Block " + curr_block + " of " + num_blocks + " is done!</h1>" 
                                + "<hr width='90%'> <br>" 
                                + "<h2>Fantastic, that's the end of the experimental part!</h2>"
                                + "Press the \"Next\" button to continue.";
                    } else {
                        return "<h1>Block " + curr_block + " of " + num_blocks + " is done!</h1>" 
                                + "<hr width='90%'> <br>" 
                                + "<h2>Small break!" + "<br><br>" 
                                + "<b><div style='font-size:60px'; id='counter';>" // show countdown here
                                + "</div></b>" + "<br><br></h2>" + "<h2>If you'd like to skip the remaining break time, press the \"Next\" button.</h2>";
                    }
                },
        choices: [' '],
        trial_duration: (pause_length+3)*1000,
        on_load: function () {
            countdown(pause_length);
        }
    }

    var main_timeline = []

    main_timeline.push(main_instructions);
    main_timeline.push(last_confirmation);

    // This loop builds each block and adds it to the timeline
    for (var i = 0; i < num_blocks; i++) {
        
        // Submits a file with the results from the current block to the server.
        // This should make it possible to collect data even online (but should be tested).
        var submit_data = {
            type: jsPsychCallFunction,
            func: function () {
                jatos.uploadResultFile(jsPsych.data.get().filter({block: this.data.block+1}).json(), "main_block_" + (this.data.block+1) + ".json")
                    .then(() => console.log("File was successfully uploaded"))
                    .catch(() => console.log("File upload failed"));
            },
            data: {
                block: i
            }
        }

        // Creates the trials to be used in this block
        const procedure = {
            timeline: [main_stimulus1, isi_fixation, main_stimulus2, isi_fixation, cue, fixation, main_recall, main_feedback_conditional, iti_fixation],
            timeline_variables: main_vars.slice(i*trials_in_block, (i+1)*trials_in_block),
            randomize_order: true
        }

        main_timeline.push(iti_fixation);
        main_timeline.push(procedure);
        main_timeline.push(pause);
        main_timeline.push(submit_data);
    }

    // Submits the data collected so far to the server. 
    // (Won't work with more than cca 150 trials online, only locally.)
    var submit_all_data = {
        type: jsPsychCallFunction,
        func: function () {
            jatos.uploadResultFile(jsPsych.data.get().json(), "main_results.json")
                .then(() => console.log("File was successfully uploaded"))
                .catch(() => console.log("File upload failed"));
        }
    }

    main_timeline.push(submit_all_data);

    const main_experiment = {
        timeline: main_timeline
    }

    return main_experiment;
}

export { main_builder as main };