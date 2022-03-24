const succefullResponse = {
    statusCode: 200,
    headers: { "content-type": "application/json" },
}

const succefullResponseBase64 = {
    statusCode: 200,
    headers: { "content-type": "application/zip" },
}

const errorRequestResponse = {
    statusCode: 400,
    headers: { "content-type": "application/json" },
}


module.exports = {
    succefullResponse,
    errorRequestResponse,
    succefullResponseBase64
}