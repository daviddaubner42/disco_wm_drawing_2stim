function img = dataURLtoImage(dataURL, i)
    % Takes a dataURL of an image (the format from jsPsych sketchpad
    % component), and transforms it into a Matlab image

    commaIndex = strfind(dataURL, ','); % finds the end of the 'data:image/png;base64,' beginning that is not the actual data URL
    base64String = dataURL(commaIndex+1:end); % selects the actual data URL
    decodedBytes = matlab.net.base64decode(base64String); % decodes the base64 data URL
    
    % This section transforms the decoded data URL to a Matlab image. This
    % is done by writing it to a file and then loading. Maybe there is a
    % more elegant way to do this, I haven't found it
    imgFile = fopen("img/temp_" + i + ".png", 'wb');
    fwrite(imgFile, decodedBytes, 'uint8');
    fclose(imgFile);
    img = imread("img/temp_" + i + ".png");
    delete ("img/temp_" + i + ".png");
end