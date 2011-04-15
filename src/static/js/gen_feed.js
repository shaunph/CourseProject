// Uses JQuery to pull the feed data and place it inside the div

// pullURLTo(url,divID)
//    queries the supplied url and writes the returned data to the supplied div
//
function pullURLTo(url, divID) {
    $.get(url, function (data) {
        $("div.#" + divID).html(data);
    });
}
// pullGenFeedsTo(divID)
//  gets the feed data from the server and sets the content 
//  of the given divID to the feed data
function pullGenFeedsTo(divID) {
    pullURLTo('/feedGen?', divID);
}
