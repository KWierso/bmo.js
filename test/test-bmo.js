var bmo = require("./bmo");

/*
 *  Test get()ing the count of open P4 SDK bugs
 */
exports["test count"] = function(assert, done) {
  bmo.count({
    "product": "Add-on%20SDK",
    "priority": "P4",
    "resolution": "---"
  }).then(function success(data) {
    assert.ok(data >= 0, "test that count() returns a number");
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down three ways
 */
exports["test count split3"] = function(assert, done) {
  bmo.count({
    "product": "Add-on%20SDK",
    "priority": "P4",
    "resolution": "---"
  },"severity","component","op_sys").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(Array.isArray(data.y_labels) == true, "test that returned y labels are an array");
    assert.ok(Array.isArray(data.z_labels) == true, "test that returned z labels are an array");
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down two ways
 */
exports["test count split2"] = function(assert, done) {
  bmo.count({
    "product": "Add-on%20SDK",
    "priority": "P4",
    "resolution": "---"
  },"severity","component").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(Array.isArray(data.y_labels) == true, "test that returned y labels are an array");
    assert.ok(data.z_labels == undefined, "test that z labels is undefined");
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down one way
 */
exports["test count split"] = function(assert, done) {
  bmo.count({
    "product": "Add-on%20SDK",
    "priority": "P4",
    "resolution": "---"
  },"severity").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(data.y_labels == undefined, "test that y labels is undefined");
    assert.ok(data.z_labels == undefined, "test that z labels is undefined");
    done();
  });
}


/*
 *  Test get()ting a single bug, default fields
 */
// Let's get bug 722597, all default fields
exports["test bug get"] = function(assert, done) {
  bmo.bug("722597").then(function success(bug) {
    assert.ok(bug.error == undefined, "test that bug get() doesn't return an error");
    done();
  });
}

/*
 *  Test get()ting a single bug, only id and summary fields
 */
exports["test bug get specific fields"] = function(assert, done) {
  bmo.bug(722597,"id,summary").then(function success(bug) {
    assert.ok(bug.id == 722597, "test bug id is correct");
    assert.ok(typeof bug.summary == "string", "test bug id is a string");
    
    let other = false;
    for(i in bug) { 
      if(i != "id" && i != "summary") {
        other = true;
      }
    }
    assert.ok(other == false, "test bug only includes id and summary");
    done();
  });
}

/*
 *  Test get()ting a bug's comments
 */
exports["test bug get comments"] = function(assert, done) {
  bmo.comments(722597).then(function success (comments) {
    assert.ok(comments[0].hasOwnProperty("is_private") && 
              comments[0].hasOwnProperty("creator") && 
              comments[0].hasOwnProperty("text") && 
              comments[0].hasOwnProperty("creation_time") && 
              comments[0].hasOwnProperty("id"), 
              "test that first comment object has expected properties");
    assert.ok(typeof comments[0].text == "string", "test that first comment text is a string");
    done();
  });
}

/*
 *  Test searching for all open P4 SDK bugs
 */
exports["test search"] = function(assert, done) {
  bmo.search({
    "product": "Add-on SDK",
    "priority": "P4",
    "resolution": "---"
  }).then(function success(results) {
    assert.ok(results.error == undefined, "test that search didn't return an error");
    assert.ok(typeof results[0].id == "number", "test that first search result has a bug id");
    done();
  });
}

require("sdk/test").run(exports);