## The Visual Working Memory Drawing Experiment

`index.html` - imports the necessary jsPsych plugins, style files, and Jatos

`main.js` - the main jsPsych file, sets up Jatos, defines the overall structure of the experiment and imports all the other components.

## css/

Contains the styling files:
* `style.css` for the whole experiment.
* `preview_showcase.css` for the consent form.

## consent/

Contains the HTML files defining the individual pages of the consent form. These are then displayed through jsPsych.

## img/

Contains the images used in the instructions, and three folders with the stimuli images: `demo/`, `practice/`, and `main/`. The stimuli images are generated and saved to these folders by running a Matlab script. See the section on `shape_generation/` for details.

## js/

Contains the files defining the 6 parts of the experiment: Consent, Familiarisation, Demo, Practice, Main Experiment, and Questionnaire.

This folder also contains utility files defining jsPsych components used repeatedly in the experiment: `fixation_crosses.js` and `fullscreen.js`.

There is also the `plugin-sketchpad-custom.js`, which is the jsPsych sketchpad plugin file modified for the purposes of this experiment to include an eraser.

## jspsych/

Contains the jsPsych library

## shape_generation/

This folder contains the matlab scripts used to generate the stimuli images.

The most important script here is `generate_multiple.m`. This script allows you to set the number of stimuli to be generated for each category, and then generates and saves them in the `img/` folder. If you don't need to change the properties of the stimuli (e.g. colour, number of vertices, etc.), this is the only file you need.

If you need to change some properties of the stimuli, this can be done by modifying the `stimulus_parameter.m` file.

The actual generation script is in the `rnd_obj.m` file, but this does not need to be modified unless the desired changes go beyond the parameters in `stimulus_parameter.m`.

The other files are utility scripts used for stimulus generation.