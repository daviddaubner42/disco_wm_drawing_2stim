% ----------------------------------------------------------------

% Script that generates the stimuli for the VWM drawing experiment
% and saves them in the 'img' folder

% ----------------------------------------------------------------

% Number of stimuli to generate for each part of the experiment
n_demo = 2;
n_practice = 12;
n_main = 120;

% Demo
for i = 1:n_demo
    S = rnd_obj();
    imwrite(S.img, "../img/demo/stim_" + i + ".png");
    S_out = rmfield(S, "img");
    S_out = jsonencode(S_out);
    out_file = fopen("../img/demo/stim_" + i + ".json", "wb");
    fwrite(out_file, S_out);
    fclose(out_file);
end

% Practice
for i = 1:n_practice
    S = rnd_obj();
    imwrite(S.img, "../img/practice/stim_" + i + ".png");
    S_out = rmfield(S, "img");
    S_out = jsonencode(S_out);
    out_file = fopen("../img/practice/stim_" + i + ".json", "wb");
    fwrite(out_file, S_out);
    fclose(out_file);
end

% Main
for i = 1:n_main
    S = rnd_obj();
    imwrite(S.img, "../img/main/stim_" + i + ".png");
    S_out = rmfield(S, "img");
    S_out = jsonencode(S_out);
    out_file = fopen("../img/main/stim_" + i + ".json", "wb");
    fwrite(out_file, S_out);
    fclose(out_file);
end


