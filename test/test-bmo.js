var bmo = require("./bmo");

// We'll call setBaseURI() in each test to make sure the URI is set regardless of test order
//var baseURI = "https://api-dev.bugzilla.mozilla.org/latest/"; 
var baseURI = "https://api-dev.bugzilla.mozilla.org/test/latest/";

var email = "testbzapi@outlook.com";
var pass = "bztest";

/*
 *  Test comment creation
 */
/*
exports["test add comment"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  var authString = "username=" + email + "&password=" + pass;
  var comment = "test";

  bmo.addComment(721, authString, comment).then(function success (response) {
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}
*/

/*
 *  Test that getting a bug's history works as expected.
 */
exports["test history"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.history(721).then(function success(data) {
    assert.ok(data[0].changes[0], "ensure that it returns at least one changeset");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test that getting a bug's flags works as expected.
 */
exports["test flags"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.flags(721).then(function success(data) {
    assert.ok(data, "ensure flags are returned");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs
 */
exports["test count"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.count({
    "product": "WorldControl",
    "priority": "P4",
    "resolution": "---"
  }).then(function success(data) {
    assert.ok(data >= 0, "test that count() returns a number");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down three ways
 */
exports["test count split3"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.count({
    "product": "WorldControl",
    "priority": "P4",
    "resolution": "---"
  },"severity","component","op_sys").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(Array.isArray(data.y_labels) == true, "test that returned y labels are an array");
    assert.ok(Array.isArray(data.z_labels) == true, "test that returned z labels are an array");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down two ways
 */
exports["test count split2"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.count({
    "product": "WorldControl",
    "priority": "P4",
    "resolution": "---"
  },"severity","component").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(Array.isArray(data.y_labels) == true, "test that returned y labels are an array");
    assert.ok(data.z_labels == undefined, "test that z labels is undefined");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ing the count of open P4 SDK bugs, broken down one way
 */
exports["test count split"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.count({
    "product": "WorldControl",
    "priority": "P4",
    "resolution": "---"
  },"severity").then(function success(data) {
    assert.ok(Array.isArray(data.data) == true, "test that returned data is an array");
    assert.ok(Array.isArray(data.x_labels) == true, "test that returned x labels are an array");
    assert.ok(data.y_labels == undefined, "test that y labels is undefined");
    assert.ok(data.z_labels == undefined, "test that z labels is undefined");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}


/*
 *  Test get()ting a single bug, default fields
 */
// Let's get bug 722597, all default fields
exports["test bug get"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.getBug("721").then(function success(bug) {
    assert.ok(bug.error == undefined, "test that bug get() doesn't return an error");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ting a single bug, only id and summary fields
 */
exports["test bug get specific fields"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.getBug(721,"id,summary").then(function success(bug) {
    assert.ok(bug.id == 721, "test bug id is correct");
    assert.ok(typeof bug.summary == "string", "test bug id is a string");
    
    let other = false;
    for(i in bug) { 
      if(i != "id" && i != "summary") {
        other = true;
      }
    }
    assert.ok(other == false, "test bug only includes id and summary");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test get()ting a bug's comments
 */
exports["test bug get comments"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.getComments(721).then(function success (comments) {
    assert.ok(comments[0].hasOwnProperty("is_private") && 
              comments[0].hasOwnProperty("creator") && 
              comments[0].hasOwnProperty("text") && 
              comments[0].hasOwnProperty("creation_time") && 
              comments[0].hasOwnProperty("id"), 
              "test that first comment object has expected properties");
    assert.ok(typeof comments[0].text == "string", "test that first comment text is a string");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test searching for all open P4 SDK bugs
 */
exports["test search"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.search({
    "product": "WorldControl",
    "priority": "P4",
    "resolution": "---"
  }).then(function success(results) {
    assert.ok(results.error == undefined, "test that search didn't return an error");
    assert.ok(typeof results[0].id == "number", "test that first search result has a bug id");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test retrieving a bug's attachments
 */
exports["test attachments"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.getAttachments(721).then(function success(results) {
    assert.ok(results.length >= 1, "test that request returns at least one attachment");    
    assert.ok(typeof results[0].id == "number", "test that first returned attachment has an id");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Test retrieving a bug's attachments with data
 */
exports["test attachments with data"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  bmo.getAttachments(721, true).then(function success(results) {
    assert.ok(results.length >= 1, "test that request returns at least one attachment");
    assert.ok(typeof results[0].data == "string", "test that the returned attachment includes data");
    done();
  }, function failure(reason) {
    console.error(reason);
    done();
  });
}

/*
 *  Make sure the baseURI has been set
 */
exports["test baseURI"] = function(assert, done) {
  bmo.setBaseURI(baseURI);
  assert.ok(bmo.getBaseURI() == baseURI, "baseURI was successfully retrieved");
  done();
}







require("sdk/test").run(exports);
