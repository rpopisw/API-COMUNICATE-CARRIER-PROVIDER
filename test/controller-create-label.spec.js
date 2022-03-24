jest.mock("../src/daos/MultiCarrierShippingDbDao")
jest.mock("../src/daos/CarrierApiDao")
jest.mock("../src/daos/S3Dao")


const data = require('./data/create-label.fake.json')

const MultiCarrierShippingDbDao = require('../src/daos/MultiCarrierShippingDbDao')
const CarrierApiDao = require('../src/daos/CarrierApiDao')
const S3Dao = require('../src/daos/S3Dao')


const Controller = require('../src/controllers/LabelShipping')

const { payload,resultInsertMasterLabel,informationCarrier, codeLabel, responseApiCarrier
,responseAwsS3,responseServices } = data

describe("Test Service",()=>{
    describe("Create Label Shipping",()=>{
        it("send file to s3", async()=>{
            await MultiCarrierShippingDbDao.saveMasterLabelShipping.mockReturnValueOnce(resultInsertMasterLabel)
            await MultiCarrierShippingDbDao.getCarrierApiInformation.mockReturnValueOnce(informationCarrier)
            await CarrierApiDao.generatedShippingLabel.mockReturnValueOnce(responseApiCarrier)
            await CarrierApiDao.generatedShippingLabel.mockReturnValueOnce(responseApiCarrier)
            await CarrierApiDao.generatedShippingLabel.mockReturnValueOnce(responseApiCarrier)
            await MultiCarrierShippingDbDao.getDataMarterLabelShipping.mockReturnValue(codeLabel)
            await S3Dao.uploadFileToS3.mockReturnValueOnce(responseAwsS3)
            const result = await Controller.createLabelShipping({body:JSON.stringify(payload.body)})
            expect.assertions(1);
            expect(JSON.parse(result.body)).toEqual(responseServices)
        })
    })
})