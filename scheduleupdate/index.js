const { BlobServiceClient } = require('@azure/storage-blob');
const { default: axios } = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    const connectionString = 'DefaultEndpointsProtocol=https;AccountName=playdatesbotdiscord;AccountKey=ipHq0NtkpPbQniH32DJC32QU8pmEYxoptX2jY0eqc8MiAGZUhBNZw54CLIXhlb0I2fnFkq3vtSEk6fh1h9kbMQ==;EndpointSuffix=core.windows.net'
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString); 
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;
    
    const imageId = req.body.options[0].value;
    context.log("Image ID: " + imageId);
    const scheduleImage = req.body.resolved.attachments.imageId.url;
    context.log("Image Url: " + scheduleImage);

    const containerClient = blobServiceClient.getContainerClient('images');
    const blobName = 'amby_calendar.png';
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.syncUploadFromUrl(scheduleImage);

    const responseMessage = "I think the show schedule image is updated...";
    try {
        axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/${interactionId}`, {
            "content": responseMessage
        },
        { 
            "Content-Type": "application/json"
        });
    } catch (error) {
        context.log(error);
        throw error;
    }
} 