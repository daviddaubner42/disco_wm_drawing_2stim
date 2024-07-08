import { consent } from "./js/0_Consent.js";
import { familiarisation } from "./js/1_Familiarisation.js";
import { demo } from "./js/2_Demo.js";
import { practice } from "./js/3_Practice.js";
import { main } from "./js/4_Main_Experiment.js";
import { questionnaire } from "./js/5_Questionnaire.js";

import { exit_fullscreen } from "./js/fullscreen.js";

var jsPsych = initJsPsych({
    on_trial_start: jatos.addAbortButton,
    on_finish: function () {
        // The default jatos.endStudy() has a limit on the size of the data it can save.
        // Data from this experiment is over the limit, so we save it by uploading a 
        // separate result file to the server.
        jatos.uploadResultFile(jsPsych.data.get().json(), "final_results.json")
            .then(() => console.log("File was successfully uploaded"))
            .catch(() => console.log("File upload failed"));
        // Default jatos data saving on experiment finish. Only works for < cca 150 trials.
        jatos.endStudy(jsPsych.data.get().json())
    }
});

var timeline = [];

// The number of stimuli in the practice and main experiment. Needs to be specified
// so that all the stimuli images can be preloaded bellow.
const n_practice = 10;
const n_main = 120;

// Creating a list of images to be preloaded
var images = [];
for (var i = 1; i <= n_practice; i++) {
    images.push("img/practice/stim_" + i + ".png")
}
for (var i = 1; i <= n_main; i++) {
    images.push("img/main/stim_" + i + ".png")
}

const preload = {
    type: jsPsychPreload,
    auto_preload: true,
    images: images,
    show_detailed_errors: true
}

const thankyou_message = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h1>Thank you for participating!</br>The experiment is over, click the "Next" button to finish.</h1>',
    choices: [' ']
}

// The experiment timeline
timeline.push(preload);
timeline.push(consent(jsPsych));
timeline.push(familiarisation(jsPsych));
timeline.push(demo(jsPsych));
timeline.push(practice(jsPsych));
timeline.push(main(jsPsych));
timeline.push(exit_fullscreen);
timeline.push(questionnaire(jsPsych));
timeline.push(thankyou_message);

jatos.onLoad(() => {
    jsPsych.run(timeline);
});
