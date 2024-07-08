function S = rnd_obj_simp(p,S,mode)

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
    
    % set the radiuses to be minimum p.rng and maximum 1
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
        S2 = rnd_obj_simp(p2,S); % generate the shape calculated so far

        area_all = p.sz^2; % area of the whole image
        area_obj = sum(sum(S2.img)); % area of the shape calculated so far
        area_ratio = area_obj/area_all;        
        area_shouldbe = (0.5^2 * pi * mean(S.s) * p.obj_sz^2 * 2/3);

        % resize the shape to constant size
        S.r = S.r * sqrt(area_shouldbe/area_ratio);      


        [xs ys] = pol2cart(S.d,S.r);
        S.x = xs;
        S.y = ys;

        % show the shape before and after resizing
        if p.size_correction == 2
            S3 = rnd_obj_simp(p2,S);
            [my1 mx1] = ait_centroid(S3.img);           
            figure(2), imshow(S2.img),
            figure(3), imshow(S3.img)
            (1-area_ratio/area_shouldbe)
            area_all = p.sz^2;
            area_obj = sum(sum(S3.img));
            area_ratio = area_obj/area_all;
            (1-area_ratio/area_shouldbe)  
        end;
    end;    
    

    if p.ait_correct

        p2 = p;
        p2.ait_correct = 0;
        p2.size_correction = 0;
        p2.mask = 0;
        p2.fill = 1;
        p2.back = 0;
        p2.obj_sz = 1;

        S2 = rnd_obj_simp(p2,S); % generate the shape calculated so far
       

        [my mx] = ait_centroid(S2.img); % find the center of mass of the current shape

        xs = S.x - (mx - hsz)/hsz;
        ys = S.y - (my - hsz)/hsz;

        [ds,rs] = cart2pol(xs,ys); 

        S.r = rs; 
        S.d = ds;
        S.x = xs;
        S.y = ys;

        % show the shape before and after correction
        if p.ait_correct == 2
            S3 = rnd_obj_simp(p2,S);
            [my1 mx1] = ait_centroid(S3.img);            
            figure(1), imshow(S2.img), figure(2), imshow(S3.img)
            disp(my1)
            disp(mx1)
        end;
    end;  


 
end;


if mode > 1
    img  = zeros([p.sz p.sz]) + p.back; % create an image with background only
    
    if p.shade % shade each segment differently
        cmap = p.back+((p.fill-p.back)/(p.comp+p.shade-1) *p.shade):((p.fill-p.back)/(p.comp+p.shade-1)):p.fill;
        x = (S.x([1:p.comp 1])* p.obj_sz+1)/2 * p.sz;
        y = (S.y([1:p.comp 1])* p.obj_sz+1)/2 * p.sz;
        m = p.sz/2;
        
        for n = 1:p.comp
            img  =  bitmapplot([m x(n:n+1) m],[m y(n:n+1) m],img,struct('LineWidth',5,'Color',repmat(cmap(n),1,4),'FillColor',repmat(cmap(n),1,4)));
            
        end;
    else % generate uniformly filled shape image        
        img  = bitmapplot((S.x* p.obj_sz+1)/2 * p.sz ,(S.y * p.obj_sz+1)/2 * p.sz,img,struct('LineWidth',0,'FillColor',repmat(p.fill,1,4)));
    end;
    
    if p.mask
        img(get_mask(p) == 0) = p.screen;
    end;
    
    S.img = img * p.bright;
    
    if all(S.img(:) == 0)
        keyboard
    end;
%     ns = numel(S.s);
%     h = fill(S.x([ns 1:ns]),S.y([ns 1:ns]),c);
%     set(h,'EdgeColor',c)
%     set(gca,'Ytick',[],'Xtick',[],'box','off');
%     ylim([-(S.rng(1)) S.rng(1)]), xlim([-(S.rng(1)) S.rng(1)])
else
    S.img = [];
    
end;