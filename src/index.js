const LabelShippingController = require ('./controllers/LabelShipping')

const createLabelShipping = async (event)=>{
  return LabelShippingController.createLabelShipping(event)
}


module.exports = {
  createLabelShipping
}