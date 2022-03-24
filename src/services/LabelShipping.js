const MultiCarrierShippingDbDao = require('../daos/MultiCarrierShippingDbDao')
const ServicesConstants = require('../supports/services.constants')
const ServiceSupport = require('../supports/services.functions')
const S3Dao = require('../daos/S3Dao')

const createLabelShipping = async (id, orders) => {
    const parameters = {
        id,
        status: ServicesConstants.status_label.processing
    }
    await MultiCarrierShippingDbDao.updateStatusMasterLabelShipping(parameters)
    const codeLabel = await MultiCarrierShippingDbDao.getDataMarterLabelShipping(id)
    const informationCarrier = await MultiCarrierShippingDbDao.getCarrierApiInformation(ServicesConstants.services)
    const urlsPdf = await ServiceSupport.getListUrlPdf(informationCarrier, orders)
    if (!urlsPdf.error) {
        const parameters = {
            id,
            status: ServicesConstants.status_label.completed
        }
        await MultiCarrierShippingDbDao.updateStatusMasterLabelShipping(parameters)
    }
    const bufferZip = await ServiceSupport.getZipFile(urlsPdf)
    const urlS3 = await S3Dao.uploadFileToS3(bufferZip, codeLabel)
    await MultiCarrierShippingDbDao.updateUrlMasterLabelShipping(id, urlS3.Location)
    return {
        idSolicitud: codeLabel
    }
}

const getStatusLabelShipping = async (codeLabel) => {
    const statusLabel = await MultiCarrierShippingDbDao.getStatusLabelShipping(codeLabel)
    if (statusLabel) {
        return {
            status: statusLabel.status,
            url: statusLabel.url.s3
        }
    }
    if (!statusLabel) {
        return {
            msg: ServicesConstants.message.messageNotfound
        }
    }
}

const getUrlLabelShipping = async (codeLabel) => {
    const codeUrlLabel = await MultiCarrierShippingDbDao.getUrlLabelShipping(codeLabel)
    if (codeUrlLabel) {
        const zipFileBase64 = await ServiceSupport.dowloadFileToS3(codeUrlLabel.code.label)
        return {
            data: zipFileBase64
        }
    }
    if (!codeUrlLabel) {
        return {
            msg: ServicesConstants.message.messageNotfound
        }
    }
}

module.exports = {
    createLabelShipping,
    getStatusLabelShipping,
    getUrlLabelShipping
}  