% Default values for the p parameter to the rnd_obj function

function p = stimulus_parameter


%%%% Changes makes recreation of trials and samples necessary


p.comp = 10; % number of points
p.rng = 0.2; % radius range

%%%% Free to change
p.sz = 280; % size of the image
p.shade = 0; %p.comp;
p.rotate = 0;

p.screen = 0.5;
p.back = 1; % background colour
p.fill = 0; % shape colour
p.obj_sz = 0.8; % size of the object
p.mask = 0;
p.fovea = 0;

% Brightness
p.bright = 1;

% Correction
p.ait_correct = 1;
p.size_correction = 1;