class RequestCarrierApiDto {
      constructor({
            address_from = undefined,
            address_to = undefined,
            parcels = undefined
      }) {
            this.shipment = {
                  address_from,
                  address_to,
                  parcels
            }
      }
}

module.exports = RequestCarrierApiDto