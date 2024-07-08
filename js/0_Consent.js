// This is a wrapper function for the Instructions and Consent form in the beginning of the experiment.
// The individual pages of the form are loaded from separate HTML files saved in the /consent folder.

var check_consent = function(elem) {
    // This function is necessary for the check button in the final declaration to work.
    // It checks if consent has been given, and only then allows the participant to continue.

    if (document.getElementById('checkConsent').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
    }
};

function consent_builder (jsPsych) {
    const purpose_duration = {
        type: jsPsychExternalHtml,
        url: "./consent/1_purpose_duration.html",
        cont_btn: "start"
    };
    
    const requirements_instructions = {
        type: jsPsychExternalHtml,
        url: "./consent/2_requirements_instructions.html",
        cont_btn: "start"
    };
    
    const voluntariness_compensation = {
        type: jsPsychExternalHtml,
        url: "./consent/3_voluntariness_compensation.html",
        cont_btn: "start"
    };
    
    const data_protection = {
        type: jsPsychExternalHtml,
        url: "./consent/4_data_protection.html",
        cont_btn: "start"
    };
    
    const declaration = {
        type: jsPsychExternalHtml,
        url: "./consent/5_declaration.html",
        cont_btn: "start",
        check_fn: check_consent
    };
    
    const consent_exp = {
        timeline: [
            purpose_duration,
            requirements_instructions,
            voluntariness_compensation,
            data_protection,
            declaration
        ]
    };

    return consent_exp;
}

export { consent_builder as consent };