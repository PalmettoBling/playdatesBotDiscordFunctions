const { default: axios } = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');

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
    
    const logicAppResponse = await axios.post('https://prod-05.eastus.logic.azure.com:443/workflows/bbd3850e68be43a4923323ae5da5cc82/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fWfh-YzuGV_x1eLwfv0d636kuT4jrYBt83_C6N6GvqE', {
        scheduleImage
    });
    context.log("Logic App contacted...");
    
    const responseMessage = "I think the show schedule image is updated...";
    context.log("Response message set.");

    try {
        axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
            content: responseMessage
        },
        {
            "Content-Type": "application/json"
        });
    } catch (error) {
        context.log(error);
        throw error;
    }
} 