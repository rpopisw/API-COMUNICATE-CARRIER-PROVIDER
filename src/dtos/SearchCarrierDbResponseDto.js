class SearchCarrierDbResponseDto{
    constructor({
        name=undefined,
        url = undefined,
        token = undefined
    }){
        this.name = name
        this.url = url
        this.token = token
    }
}

module.exports = SearchCarrierDbResponseDto