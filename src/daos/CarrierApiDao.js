const axios = require('axios')

const generatedShippingLabel = async (order, url, token) => {
    try {
        const response = await axios({
            method: "post",
            url: url,
            headers: { Authorization: `Bearer ${token}` },
            data: order
        })
        return response.data
    } catch (error) {
        return error.response.data

    }
}
module.exports ={ generatedShippingLabel }