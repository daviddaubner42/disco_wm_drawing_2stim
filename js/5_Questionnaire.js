function questionnaire_builder(jsPsych) {

    var scale = ["0 Strongly Disagree", "1", "2", "3", "4", "5", "6", "7 Strongly Agree"];

    var handedness = {
        type: jsPsychSurveyLikert,
        preamble: "<b> <h3> You are nearly done. We have a few questions for you. </h3> </b> <br> <br> <br>",
        questions: [
            { prompt: "Are you left, right handed or do you use both hands?", name: 'handedness', labels: ["Left Handed", "Right Handed", "Both"], required: true }
        ],
        data: { event: 'handedness' },
        scale_width: 500
    }

    var general_questions = {
        type: jsPsychSurveyLikert,
        preamble: " <b> Please respond as quickly and spontaneous as you can. There are no right or wrong answers. </b>",
        questions: [
            { prompt: "I was thinking about the stimulus shape during the delay period.", name: 'Think_Relevant_Stim', labels: scale, required: true },
            { prompt: "I was thinking about irrelevant things during the delay period.", name: 'Irrelevant_Stim', labels: scale, required: true },
            { prompt: "I stayed concentrated and vigilant during the whole experiment.", name: 'Concentration', labels: scale, required: true },
            { prompt: "I was fixating on the fixation dot at the center of the screen when it was there.", name: 'Fixation', labels: scale, required: true },
            { prompt: "I had enough time to respond.", name: 'Time', labels: scale, required: true },
            { prompt: "I generally had difficulty in drawing the exact shape, even when I memorized the item accurately.", name: 'Recall_Adjust', labels: scale, required: true },
            // { prompt: "It was hard to select the right response to match the orientation", name: 'Difficult_response_Orientation', labels: scale, required: true },

            { prompt: "It was hard to perceive and memorize the shape", name: 'Difficult_Shape', labels: scale, required: true },
            { prompt: "I did not have to memorize anything to perform the task.", name: 'Memory_Used', labels: scale, required: true },
            // { prompt: "I have experience in playing an instrument and/or reading music.", name: 'Play_Instrument', labels: scale, required: true },
            
            { prompt: "I have experience with drawing / draw regularly.", name: 'Drawing_Experience', labels: scale, required: true },
            { prompt: "I was trained in drawing / painting.", name: 'Drawing_Training', labels: scale, required: true },
            { prompt: "I was familiar with using a drawing tablet prior to the experiment.", name: 'Tablet_Experience', labels: scale, requried: true },
            { prompt: "I was comfortable using the drawing tablet during the experiment.", name: 'Tablet_Comfort', labels: scale, requried: true },
            // { prompt: "I had to focus more when there were more orientations.", name: 'Focus_Load', labels: scale, required: true },
            // { prompt: "I knew which item should be recalled <b>before the response window</b> was shown to me.", name: 'Cue_Used', labels: scale, required: true },
            { prompt: "There were technical problems during the experiment.", name: 'Technical_Problems', labels: scale, required: true },
        ],
        randomize_question_order: true,
        data: { event: 'general' },
        scale_width: 500
    };



    var strategy_questions = {
        type: jsPsychSurveyLikert,
        preamble: "I memorized the <b>shape</b> during the delay period...",
        questions: [
            { prompt: "by using words to describe it.", name: 'words', labels: scale, required: true },
            { prompt: "by giving it some name, code or number.", name: 'number', labels: scale, required: true },
            { prompt: "through an associated smell or taste.", name: 'olfactory', labels: scale, required: true },
            { prompt: "through an associated action.", name: 'action', labels: scale, required: true },
            { prompt: "through an associated emotion.", name: 'affective', labels: scale, required: true },
            { prompt: "through an associated touch.", name: 'tactile', labels: scale, required: true },
            { prompt: "by what it might mean.", name: 'meaning', labels: scale, required: true },
            { prompt: "by how it might sound.", name: 'auditory', labels: scale, required: true },
            { prompt: "by how it looked.", name: 'visual', labels: scale, required: true },

            { prompt: "by thinking how I would draw it.", name: 'visual_drawing', labels: scale, required: true },
            { prompt: "by focusing on / remembering one or multiple features of the shape.", name: 'visual_features', labels: scale, required: true },
            { prompt: "by trying to simplify the shape in my mind.", name: 'visual_simplify', labels: scale, required: true},

            { prompt: "through an associated temperature.", name: 'temperature', labels: scale, required: true },
            { prompt: "by its intensity.", name: 'intensity', labels: scale, required: true }
        ],
        randomize_question_order: true,
        data: { event: 'orientation' },
        scale_width: 500
    };

    var strategy_open = {
        type: jsPsychSurveyText,
        questions: [
            { prompt: 'Did you memorize the <b>shape</b> during the delay period in a way that was not described before (if yes, please explain).', name: "ori_strategy_open", placeholder: 'How did you memorize it?', rows: 1, columns: 50 }
        ],
        data: { event: 'diff_strategy' }
    };

    var guess_number_items = {
        type: jsPsychSurveyText,
        preamble: "How many <i>different</i> ...",

        questions: [
            { prompt: "<b>shapes</b> do you think you had to memorize?", placeholder: "1-999", name: "num_orient", required: true, onlyNum: true, rows: 1, columns: 4 },
        ],
        randomize_question_order: true,
        data: { event: 'number_items_guess' },
    };


    var pilot_comment = {
        type: jsPsychSurveyText,
        preamble: "Thank you so much for participating in our experiment! </p> If you have any suggestions, please comment below!</p> For example, did you understand the instructions well? Did you experience any technical difficulties?",
        questions: [
            { prompt: 'Comment:', placeholder: 'Do you have any comments about the experiment?', name: "comment", rows: 5, columns: 75 }
        ],
        data: { event: 'comment' },
    };

    // Submits the questionnaire data to the server (should allow data collection online).
    var submit_data = {
        type: jsPsychCallFunction,
        func: function () {
            jatos.uploadResultFile(jsPsych.data.get()
                    .filterCustom(function(trial){ return trial.trial_type == 'survey-likert' || trial.trial_type == 'survey-text'; })
                    .json(), "questionnaire_results.json")
                .then(() => console.log("File was successfully uploaded"))
                .catch(() => console.log("File upload failed"));
            jatos.submitResultData(jsPsych.data.get().json());
        }
    }

    var questionnaire_timeline = [handedness, general_questions, strategy_questions, strategy_open, guess_number_items, pilot_comment, submit_data];

    var questionnaire = {
        timeline: questionnaire_timeline
    }

    return questionnaire;
}

export { questionnaire_builder as questionnaire };