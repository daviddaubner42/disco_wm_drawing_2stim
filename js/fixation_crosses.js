var local_jsPsych = initJsPsych({});

// The fixation cross used between stimulus and recall
const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:60px;">+</div>`,
    choices: "NO_KEYS",
    trial_duration: 3000,
    on_start: function(trial) {
        document.body.style.cursor= "none";
    },
    on_finish: function(trial) {
        document.body.style.cursor= "auto";
    }
}

// The fixation cross used in the intertrial interval
const iti_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:60px;">+</div>`,
    choices: "NO_KEYS",
    trial_duration: function(){
            return local_jsPsych.randomization.sampleWithoutReplacement([2000, 2500, 3000], 1)[0];
    },
    on_start: function(trial) {
        document.body.style.cursor= "none";
    },
    on_finish: function(trial) {
        document.body.style.cursor= "auto";
    }
}

export { fixation as fixation, iti_fixation as iti_fixation };