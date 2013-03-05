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