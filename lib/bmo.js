const request = require("sdk/request");
const { defer } = require('sdk/core/promise');

// Things each request needs to work properly
var baseURI = "https://api-dev.bugzilla.mozilla.org/latest/";
var headers = {"Accept": "application/json", "Content-Type": "application/json"}

// Take a JSON object and parse it out into a string usable for search parameter
function buildSearchURL(obj, method) {
    var url = baseURI + method + "?";
    
    for(i in obj) {
        if(url[url.length-1] != "?")
            url = url + "&";
        url = url + i + "=" + obj[i];
    }
    return url;
}

// Create a promise that resolves to the specified bug in Bugzilla
exports.bug = function bug(id, includeString) {
    var deferred = defer();
    var url = baseURI + "bug/" + id;

    if(includeString) {
        url = url + "?include_fields=" + includeString;
    }

    request.Request({
        url: url,
        headers: headers,
        onComplete: function(response) {
            if(response.json) {
                deferred.resolve(response.json);
            } else {
                deferred.reject(response.status);
            }
        }
    }).get();
    
    return deferred.promise;
}

// Create a promise that resolves to the bugs object containing all bugs in 
// Bugzilla that match the search parameters
exports.search = function search(searchObj) {
    var deferred = defer();
    var url = buildSearchURL(searchObj, "bug");
    request.Request({
        url: url,
        headers: headers,
        onComplete: function(response) {
            if(response.json) {
                deferred.resolve(response.json.bugs);
            } else {
                deferred.reject(response.status);
            }
        }
    }).get();
    
    return deferred.promise;
}

// Create a promise that resolves to the total number of bugs in Bugzilla
// that match the search parameters
exports.count = function count(searchObj, xAxis, yAxis, zAxis) {
    var deferred = defer();
    var url = buildSearchURL(searchObj, "count");
    if(xAxis) {
        url = url + "&x_axis_field=" + xAxis;
    }
    if(yAxis) {
        url = url + "&y_axis_field=" + yAxis;
    }
    if(zAxis) {
        url = url + "&z_axis_field=" + zAxis;
    }

    request.Request({
        url: url,
        headers: headers,
        onComplete: function(response) {
            if(response.json) {
                var data = {}

                if(response.json.data && response.json.x_labels 
                                      && response.json.y_labels 
                                      && response.json.z_labels) {
                    data.data = response.json.data;
                    data.x_labels = response.json.x_labels;
                    data.y_labels = response.json.y_labels;
                    data.z_labels = response.json.z_labels;
                    deferred.resolve(data);
                } else if(response.json.data && response.json.x_labels && response.json.y_labels) {
                    data.data = response.json.data;
                    data.x_labels = response.json.x_labels;
                    data.y_labels = response.json.y_labels;
                    deferred.resolve(data);
                } else if(response.json.data && response.json.x_labels) {
                    data.data = response.json.data;
                    data.x_labels = response.json.x_labels;
                    deferred.resolve(data);
                } else if(response.json.data) {
                    deferred.resolve(response.json.data);
                } else {
                    deferred.reject("Ugh");
                }
                
            } else {
                deferred.reject(response.status);
            }
        }
    }).get();
    
    return deferred.promise;
}

// Create a promise that resolves to an object containing
// all of the comments for a given bug
exports.comments = function comments(id) {
  var deferred = defer();

  var url = baseURI + "bug/" + id + "/comment";

  request.Request({
    url: url,
    headers: headers,
    onComplete: function(response) {
      if(response.json) {
        deferred.resolve(response.json.comments);
      } else {
        deferred.reject(response.status);
      }
    }
  }).get();
  
  return deferred.promise;
}

// Create a promise that resolves to an object containing
// all of the comments for a given bug
exports.attachments = function attachments(id, data) {
  var deferred = defer();

  var url = baseURI + "bug/" + id + "/attachment";

  if(data) {
    url = url + "?attachmentdata=1";
  }
 
  request.Request({
    url: url,
    headers: headers,
    onComplete: function(response) {
      if(response.json) {
        deferred.resolve(response.json.attachments);
      } else {
        deferred.reject(response.status);
      }
    }
  }).get();
  
  return deferred.promise;
}
