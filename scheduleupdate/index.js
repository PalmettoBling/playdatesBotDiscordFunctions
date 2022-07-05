const { default: axios } = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');
const download = require('image-downloader');
const path = require('path');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const blobServiceClient = new BlobServiceClient(process.env.AzureWebJobsStorage);
    const containerClient = blobServiceClient.getContainerClient("images");
    const blockBlobClient = containerClient.getBlockBlobClient("amby_calendar.png");

    context.log("Req Body: ");
    context.log(req.body);

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;
    
    const imageId = req.body.options[0].value;
    context.log("Image ID: " + imageId);
    const resolvedObject = req.body.resolved.attachments;
    const attachmentObject = resolvedObject[`${imageId}`];
    const scheduleImage = attachmentObject.proxy_url;
    context.log("URL: " + scheduleImage);
    const filePath = path.resolve(__dirname, "amby_calendar.png");
    context.log("File Path: " + filePath);

    const file = await download.image({
        url: scheduleImage, 
        dest: filePath
    });

    //const file = FS.createWriteStream("scheduleupdate/amby_calendar.png");

    // const response = await axios({
    //     method: 'GET',
    //     url: scheduleImage,
    //     responseType: 'stream'
    // });

    //context.log("Response data pipe.");
    //await response.data.pipe(file);

    context.log("update to blockblob.");
    await blockBlobClient.uploadFile(file);
    
    //await blockBlobClient.beginCopyFromURL(scheduleImage);
    //context.bindings.imageBlob = await axios.get(scheduleImage);
    //========================    
    //await blockBlobClient.uploadStream(response.data, response.data.length);
    
    context.log("Response message set.");
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