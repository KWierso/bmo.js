This module provides access to Bugzilla's REST API.

<api name="bug">
@function
Looks up and returns a single bug.

@param id {number}
The ID of the bug to be returned.

    var bug = require("./bmo").bug(123456);

@param [includeString] {string}
Comma separated string of fields to be returned in the bug object. (optional)

    var bug = require("./bmo").bug(123456, "id,summary");

@returns {promise}
A promise that will resolve to the bug object with the given ID, including only the specified fields, if provided.
</api>

<api name="count">
@function
Searches Bugzilla and returns the total number of bugs returned from the search.

@param searchObj {object}
Object of JSON-paired search parameters.

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"});

@param [xAxis] {string}
Field name to break down the search results (optional)

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"}, "severity");

@param [yAxis] {string}
Field name to further break down the search results (optional)

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"}, "severity","component");

@param [zAxis] {string}
Field name to further break down the search results (optional)

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"}, "severity","component","op_sys");

@returns {promise}
A promise that will resolve to the results of the query. 
If no axis fields are provided, the promise resolves to a number. 

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4");
    count.then(function success(data) {
      console.log(data); // This will log a number like 26
    } 

If axis fields are provided, the promise resolves to an object with a `"data"`
  property, which is an array of bug counts, and properties for `"x_labels"`, 
  `"y_labels"`, and `"z_labels"` for each provided field.

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"}, "severity");
    count.then(function success(data) {
      console.log(data); // [object Object]
      console.log(data.data); // [23,1,2]
      console.log(data.x_labels); // [normal,minor,enhancement]
    });

Note that the search will fail if the y axis is provided without an x axis.
  Similarly, the search fails if z axis is provided without both x and y axes.
</api>

<api name="search">
@function
Searches Bugzilla and returns the bugs that are the result from the search.

@param searchObj {object}
Object of JSON-paired search parameters.

    var count = require("./bmo").count({"product": "Add-on SDK", "priority": "P4"});


@returns {promise}
A promise that will resolve to an object of bugs matching the parameters of the search.
</api>

<api name="comments">
@function
Searches Bugzilla for a specific bug's comments.

@param id {number}
ID of the bug whose comments should be returned.

    var comments = require("./bmo").comments(722597);

@returns {promise}
A promise that will resolve to an object of all comments from the given bug.
</api>
