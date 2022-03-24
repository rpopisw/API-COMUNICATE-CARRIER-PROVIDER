jest.mock("../src/daos/MultiCarrierShippingDbDao")

const data = require('./data/get-status-label.fake.json')
const MultiCarrierShippingDbDao = require('../src/daos/MultiCarrierShippingDbDao')


const Controller = require('../src/controllers/LabelShipping')

const { requestGetLabelShipping, responseStatusLabelShipping,statusLableShipping } = data

describe("Test Service",()=>{
    describe("GET Label status",()=>{
        it("get url zip s3", async()=>{
            await MultiCarrierShippingDbDao.getStatusLabelShipping.mockReturnValue(statusLableShipping)
            const result = await Controller.getStatusLabelShipping(requestGetLabelShipping)
            console.log(result)
            expect.assertions(1);
            expect(JSON.parse(result.body)).toEqual(responseStatusLabelShipping)
        })
    })
})