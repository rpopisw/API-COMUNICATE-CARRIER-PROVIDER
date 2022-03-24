const https = require('https');
const AdmZip = require("adm-zip");
const AWS = require('aws-sdk')

const CarrierApiDao = require('../daos/CarrierApiDao')
const RequestCarrierApiDto = require('../dtos/RequestCarrierApiDto')

const getZipFile = async (data) => {
    const zip = new AdmZip();
    let PromiseArray = data.map((dataItem) => {
        const response = new Promise((resolve, reject) => {
            https.get(dataItem, (res) => {
                var data = [];
                res.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    var buffer = Buffer.concat(data);
                    resolve(buffer)
                });
            }).on("error", (err) => {
                reject(err.message)
            });
        })
        return response
    });
    let dataPdf = await Promise.all(PromiseArray)
    dataPdf.map((bufferData, index) => {
        zip.addFile(`${index}.pdf`, bufferData);
    });
    return zip.toBuffer();
}

const getListUrlPdf = async (informationCarrier, orders) => {
    try {
        const [{ url, token }] = informationCarrier
        const carrierApiDao = new CarrierApiDao(url, token)
        const responses = orders.map(async (order) => {
            let requestCarrierApiDto = new RequestCarrierApiDto(order.shipment)
            let responseApicarrier = await carrierApiDao.generatedShippingLabel(requestCarrierApiDto)
            if (responseApicarrier.error) {
                while (responseApicarrier.error) {
                    responseApicarrier = await carrierApiDao.generatedShippingLabel(requestCarrierApiDto)
                }
            }
            return {
                order,
                responseApicarrier: responseApicarrier.data
            }
        })
        const dataResponse = await Promise.all(responses)
        return dataResponse.filter(data => data.responseApicarrier).map(data=>data.responseApicarrier.attributes.file_url)
    } catch (error) {
        return error
    }
}

const uploadFileToS3 = async(file,nameFile)=>{
    const s3 = new AWS.S3({
        accessKeyId: process.env.SECRET_ID,
        secretAccessKey: process.env.SECRET_KEY,
    });
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${nameFile}.zip`,
        Body: file
    };
    return await s3.upload(params).promise();
}

module.exports = { 
    getZipFile,
    getListUrlPdf,
    uploadFileToS3
}