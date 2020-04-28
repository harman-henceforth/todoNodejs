exports.response = function (err, response, res, media = 0) {
    var status = 200;
    var errors = {
        400: "bad_request",
        401: "forbidden",
        403: "unauthorized",
        500: "internal_server_error"
    };
    if (err) {
        console.log("err: " + err);
        console.log("err is_numeric:", !isNaN(parseFloat(err)) && isFinite(err));
        var err_string = "";
        if (!isNaN(parseFloat(err)) && isFinite(err)) {
            status = err;
            response = errorResponse(response);
            response.error = errors[status];
        } else {
            status = 400;
            response = errorResponse(err);
            response.error = errors[status];
        }
    }
    res.status(status ? status : 200);
    if (media && status == 200) {
        res.set('Content-Type', 'image/jpeg');
        res.send(response);
    } else {
        res.send(JSON.stringify(response));
}
};

function errorResponse(response) {
    console.log(response);
    if (Array.isArray(response)) {
        console.log("array");
        response = {
            error: "",
            error_description: response.join(". ")
        };
    } else if (typeof response === 'object') {
        console.log("object");
        response = {
            error: "",
            error_description: response.sqlMessage,
            code: response.code,
            sql: response.sql
        }
    } else {
        console.log("string");
        response = {
            error: "",
            error_description: response
        };
    }
    return response;
}