function poly = imageToPolygon(img, blur_strength, reduction_strength)
    % Transforms an image to a Matlab Polygon object
    % - blur_strength - sets the strength of blurring of the edges 
    %                   (1 = no blur, 2 = cca double edge width, etc)
    %                   see https://www.mathworks.com/help/images/ref/imdilate.html 
    % - reduction_strength - sets the extent to which the polygon
    %                        complexity is reduced
    %                        (0 = original polygon, 0.01 = quite a big
    %                        reduction already, etc)
    %                       see https://www.mathworks.com/help/images/ref/reducepoly.html?searchHighlight=reducepoly&s_tid=srchtitle_support_results_1_reducepoly


    img = im2bw(img, 0.99); % transform to black and white binary image
    invImg = imcomplement(img); % invert the image from black-on-white to white-on-black

    se90 = strel('line', blur_strength, 90);
    se0 = strel('line',blur_strength, 0);
    invImg = imdilate(invImg,[se90 se0]); % blurr the image edges with the preset strength
   
    fillImg = imfill(invImg, "holes"); % fill the inside of the shape
    [B,L] = bwboundaries(fillImg,'noholes'); % extract the boundaries of the shape into B

    % Uncomment section bellow to visualise the detected polygon

    % figure
    % imshow(label2rgb(L, @jet, [.5 .5 .5]))
    % hold on
    % for k = 1:length(B)
    %    boundary = B{k};
    %    plot(boundary(:,2), boundary(:,1), 'w', 'LineWidth', 2)
    % end
    % s_reduced = reducepoly(B{1}, 0.01);
    % line(s_reduced(:,2),s_reduced(:,1), ...
    %        'color','b','linestyle','-','linewidth',1.5,...
    %        'marker','o','markersize',5);
    
    p = B{1}; % select the boundaries
    p = reducepoly(B{1}, reduction_strength); % reduce polygon complexity with preset strength
    
    n = size(p, 1)-1;
    vertices = p(1:n,:); % extract the vertex coordinates
    poly = polyshape(vertices); % transform the vertex coordinates into
end