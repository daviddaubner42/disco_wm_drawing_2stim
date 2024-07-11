function isComplete = checkCompleteness(img)
    % Returns true if the drawing is a complete boundary of a polygon with no
    % holes

    img = im2bw(img, 0.99);
    invImg = imcomplement(img); % invert the image from black-on-white to white-on-black
    fillImg = imfill(invImg, "holes"); 

    % if the image is incomplete, imfill will not be able to fill anything
    % and the 'filled' image will be the same as the original
    isComplete = ~isequal(fillImg, invImg);
end