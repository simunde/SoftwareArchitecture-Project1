const numImages = 10;
const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

let fullUrl = apiUrl + '&count=' + numImages.toString();
let imageData = null;

// Get image data from api.
function fetchImageData() {
    fetch(fullUrl).then(function(response) { 
        response.json().then(
            function(result) { saveImageData(result); }, 
            function(error) { console.error(error); });
    }, function(error) {
        console.error(error);
    });
}

// Save image data to local storage.
function saveImageData(data) {
    // Todo: When implementing a loading screen, may want to disable it here once data is retrieved.
    try {
        if (Array.isArray(data)) {
            imageData = data;
            
            // Store JSON data locally to reduce loading times
            localStorage.setItem('imageData', data);
            console.log("data fetched.");

            // Data fetched, now display it.
            displayImageData();
        } else {
            displayStaticImage();
            console.log("Probably hit NASA API call limit...wait a bit and refresh!");
        }        
    } catch (error) {
        console.error(error);
    }    
}

// Load image data from local storage or pull new data.
function loadImageData() {
    // Todo: Add logic here to load stored JSON data, to reduce API calls and load time on refresh. 
    try {
        console.log("fetching data...");
        fetchImageData();                                
    } catch (error) {
        console.error(error);
    }
}

// Utility function to check if image url is valid.
function isUrl(string) {
    try {
        _ = new URL(string);
        return true;
    } catch (_) {
        return false;
    }
} 

// Display image data on webpage.
function displayImageData() {    
        
    // Check to see if imageData is still null, if so don't attempt to display it.
    if (imageData !== null) {
        
        /* JSON API returns the following items:
        - copyright [optional]
        - date
        - explanation
        - hdurl
        - media_type
        - service_version
        - title
        - url
        */

        //console.log(Object.keys(imageData));
        
        var col1 = document.createElement("div");
        col1.className = "w3-half";
        
        var col2 = document.createElement("div");
        col2.className = "w3-half";

        var count = 0;
        imageData.forEach(image => {
            var div = document.createElement("div");
            div.className = "container";
                        
            var img = document.createElement("img");
            img.src = (isUrl(image["hdurl"])) ? image["hdurl"] : image["url"];
            img.alt = image["title"];
            
            div.appendChild(img);

            if (image["copyright"]) {
                var cDiv = document.createElement("div");
                cDiv.className = "copyright-label";
                cDiv.innerText = "\u00A9" + " " + image["copyright"];
                div.appendChild(cDiv);
            }
            
            if (count < (numImages/2)) {
                col1.appendChild(div);
            } else {
                col2.appendChild(div);
            }
            
            count++;            
        });
        
        // Add each column of images to the row div
        document.getElementById("imageDiv").appendChild(col1);
        document.getElementById("imageDiv").appendChild(col2);

    } else {
        console.error("No image data available.");
    }
}

function displayStaticImage() {
    document.getElementById("oops").style.display = "block";
}
