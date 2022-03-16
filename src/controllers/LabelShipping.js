const HttpConstants = require('../supports/http.constants')
const ServicesResponseDto = require('../dtos/ServicesResponseDto')

const createLabelShipping = async (event)=>{
    return new ServicesResponseDto(HttpConstants.succefullResponse,'hello')
  }

module.exports = {
    createLabelShipping
}  