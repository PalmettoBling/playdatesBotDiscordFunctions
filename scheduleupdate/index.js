const { default: axios } = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const blobServiceClient = new BlobServiceClient(process.env.AzureWebJobsStorage);
    const containerClient = blobServiceClient.getContainerClient("images");
    const blobClient = containerClient.getBlobClient("amby_calendar.png");

    context.log("Req Body: ");
    context.log(req.body);

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;
    
    const imageId = req.body.options[0].value;
    context.log("Image ID: " + imageId);
    const resolvedObject = req.body.resolved.attachments;
    const attachmentObject = resolvedObject[`${imageId}`];
    const scheduleImage = attachmentObject.url;

    const blobUploadResponse = await blobClient.beginCopyFromURL(scheduleImage);
    const result = await blobUploadResponse.pollUntilDone();

    context.log("Blob Upload Response: " + result);
    
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