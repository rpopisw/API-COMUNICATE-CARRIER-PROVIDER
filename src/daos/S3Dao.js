const AWS = require('aws-sdk')


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

const dowloadFileToS3 = async(codeUrlLabel)=>{
    const s3 = new AWS.S3({
        accessKeyId: process.env.SECRET_ID,
        secretAccessKey: process.env.SECRET_KEY,
    });
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${codeUrlLabel}.zip`,
    };
    const response = await s3.getObject(params).promise();
    return response.Body.toString('base64')
}

module.exports = {
    uploadFileToS3,dowloadFileToS3
}