const succefullResponse = {
    statusCode: 200,
    headers: 'application/json'
}

const succefullResponseBase64 = {
    statusCode: 200,
    headers: 'application/zip'
}

const errorRequestResponse = {
    statusCode: 400,
    headers: 'application/json'
}


module.exports = {
    succefullResponse,
    errorRequestResponse,
    succefullResponseBase64
}