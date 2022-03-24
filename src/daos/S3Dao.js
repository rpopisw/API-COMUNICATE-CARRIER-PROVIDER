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

module.exports = {
    uploadFileToS3
}