'use strict';
const resMethods = require("utils");

exports.handler = async(event, context, callback) => {
    // TODO implement
    //console.log({event});
    const response = {
        statusCode: 200,
        body: event.path //JSON.stringify(event),
    };

    if (event.resource === "/zoom/auth") {
        const methodName = resMethods.route(event.resource);
    }
    else if (event.resource === "/zoom/callback") {
        return resMethods.authorize(event.queryStringParameters.code, callback);
    }
    else {
        return response;
    }
};
