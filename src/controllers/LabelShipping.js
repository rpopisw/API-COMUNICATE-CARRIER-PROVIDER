const HttpConstants = require('../supports/http.constants')
const ServicesResponseDto = require('../dtos/ServicesResponseDto')
const ServicesRequestDto = require('../dtos/ServicesRequestDto')
const Validation = require('../validation')


const createLabelShipping = async (event)=>{
    const request = new ServicesRequestDto(event)
    const error = await Validation.validateRequestCreateLabelShipping(request)
    if(error){
        return new ServicesResponseDto(HttpConstants.errorRequestResponse,error)
    }
    return new ServicesResponseDto(HttpConstants.succefullResponse,'hello')
  }

module.exports = {
    createLabelShipping
}  