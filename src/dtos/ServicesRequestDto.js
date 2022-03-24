class ServicesRequestDto{
    constructor({
        body = undefined,
        pathParameters = undefined,
        queryStringParameters = undefined
    }){
        this.body = JSON.parse(body)
        this.pathParameters = pathParameters
        this.queryParameters = queryStringParameters
    }
}

module.exports = ServicesRequestDto