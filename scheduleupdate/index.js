const { default: axios } = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;
    
    const imageId = req.body.options[0].value;
    context.log("Image ID: " + imageId);
    const scheduleImage = req.body.resolved.attachments.imageId.url;
    context.log("Image Url: " + scheduleImage);


    
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