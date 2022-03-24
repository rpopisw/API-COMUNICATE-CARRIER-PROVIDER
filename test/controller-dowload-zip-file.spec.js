jest.mock("../src/daos/MultiCarrierShippingDbDao")
jest.mock("../src/daos/S3Dao")

const data = require('./data/dowload-zipfile-labeo.fake.json')
const MultiCarrierShippingDbDao = require('../src/daos/MultiCarrierShippingDbDao')
const S3Dao = require('../src/daos/S3Dao')


const Controller = require('../src/controllers/LabelShipping')

const { requestDowloadtLabelShipping, responseDowloadLabelShipping,urlCodeLableShipping
, fileBaseS3 } = data

describe("Test Service",()=>{
    describe("dowload Label status",()=>{
        it("dowload file zip from s3", async()=>{
            await MultiCarrierShippingDbDao.getUrlLabelShipping.mockReturnValue(urlCodeLableShipping)
            await S3Dao.dowloadFileToS3.mockReturnValue(fileBaseS3)
            const result = await Controller.dowloadZipLabelShipping(requestDowloadtLabelShipping)
            expect.assertions(1);
            expect(JSON.parse(result.body)).toEqual(responseDowloadLabelShipping)
        })
    })
})