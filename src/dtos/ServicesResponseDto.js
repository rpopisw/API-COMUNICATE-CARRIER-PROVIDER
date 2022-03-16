class ServicesResponseDto {
    constructor(httpResponse,body){
        this.statusCode = httpResponse.statusCode
        this.headers  = httpResponse.headers
        this.body = JSON.stringify(body)
    }
}

module.exports = ServicesResponseDto