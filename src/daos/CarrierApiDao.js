const axios = require('axios')
class CarrierApiDao {
    constructor(url, token) {
        this.url = url
        this.token = token
    }

    async generatedShippingLabel(order) {
        try {
            const response = await axios({
                method: "post",
                url: this.url,
                headers: { Authorization: `Bearer ${this.token}` },
                data: order
            })
            return response.data
        } catch (error) {
            return error.response.data
        }
    }
}

module.exports = CarrierApiDao