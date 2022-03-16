const LabelShippingController = require ('./controllers/LabelShipping')

const createLabelShipping = async (event)=>{
  return LabelShippingController.createLabelShipping()
}


module.exports = {
  createLabelShipping
}