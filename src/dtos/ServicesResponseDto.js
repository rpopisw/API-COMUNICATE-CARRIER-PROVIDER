class ServicesResponseDto {
    constructor(httpResponse,body){
        this.statusCode = httpResponse.statusCode
        this.headers  = httpResponse.headers
        this.body = JSON.stringify({
            payload:{
                ...body
            }
        })
    }
}

module.exports = ServicesResponseDto