function S = rnd_obj(p,S,mode)

if nargin < 3
    mode = 2;
end;

% Check whether there is parameter p and if it is empty
if ~exist('p','var') || isempty(p)
    p = stimulus_parameter; % set to default values
end; 
hsz = p.sz/2; % half of the image size, used in correction

% Check whether there is a parameter S which is a struct
if ~exist('S','var') || ~isstruct(S)
    
    if ~exist('S','var') || isempty(S)
        S = struct; % if there is no such parameter, create a new struct S
    elseif ~isstruct(S)
        % if there is a parameter S which is not a struct, create a struct
        % S and set its field s to the initial S
        s = S;
        S = struct;
        S.s = s;
        %S.p = p;
    end;
    
    if isfield(S,'s') % check if relative radiuses of each vertex have already been supplied
        s = S.s;
    else % otherwise create a random array of relative radiuses to each vertex
        s = (1:p.comp)/p.comp;
        s = s(randperm(p.comp));
        S.s = s;    
    end;
    
    % set the radiuses to be minimum 1/p.comp*(1-p.rng)+p.rng and maximum 1
    rs = (s)*(1-p.rng)+p.rng;
    
    S.r = rs; 
    S.or = S.r; % save original radiuses
    
end;    
    
if mode > 0
    % test if there is an x field in S and whether there are any nonzero elements in p.rotate
    if ~isfield(S,'x') ||  any(p.rotate) 
        % get the degree part of polar coordinates of each rotated vertex
        S.d = (360 * ((1:p.comp)/p.comp) +p.rotate) *pi/180; 
        % transform these polar coordinates into cartesian coordinates
        [xs ys] = pol2cart(S.d,S.r);  

        S.x = xs;
        S.y = ys;
    end;
    
   if p.size_correction
        p2 = p;
        p2.ait_correct = 0;
        p2.size_correction = 0;
        p2.mask = 0;
        p2.fill = 1;
        p2.back = 0;        
        S2 = rnd_obj(p2,S); % generate the shape calculated so far

        area_all = p.sz^2; % area of the whole image
        area_obj = sum(sum(S2.img)); % area of the shape calculated so far
        area_ratio = area_obj/area_all;        
        area_shouldbe = (0.5^2 * pi * mean(S.s) * p.obj_sz^2 * 2/3);

        % resize the shape to constant size
        S.r = S.r * sqrt(area_shouldbe/area_ratio);      


        [xs ys] = pol2cart(S.d,S.r);
        S.x = xs;
        S.y = ys;
    end;    
    

    if p.ait_correct

        p2 = p;
        p2.ait_correct = 0;
        p2.size_correction = 0;
        p2.mask = 0;
        p2.fill = 1;
        p2.back = 0;
        p2.obj_sz = 1;

        S2 = rnd_obj(p2,S); % generate the shape calculated so far
       

        [my mx] = ait_centroid(S2.img); % find the center of mass of the current shape

        xs = S.x - (mx - hsz)/hsz;
        ys = S.y - (my - hsz)/hsz;

        [ds,rs] = cart2pol(xs,ys); 

        S.r = rs; 
        S.d = ds;
        S.x = xs;
        S.y = ys;
    end;  
end;


if mode > 1
    img  = zeros([p.sz p.sz]) + p.back; % create an image with background only
    
    img  = bitmapplot((S.x* p.obj_sz+1)/2 * p.sz ,(S.y * p.obj_sz+1)/2 * p.sz,img,struct('LineWidth',0,'FillColor',repmat(p.fill,1,4)));
    
    S.img = img * p.bright;
    
    if all(S.img(:) == 0)
        keyboard
    end;
else
    S.img = [];    
end;






