const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    context.log("command: " + command);

    const azureResponse = await axios.post(`https://management.azure.com/subscriptions/5934043a-40c8-4591-89e2-9d0cab20b8b9/resourceGroups/playdatesBot/providers/Microsoft.Web/sites/playdatesChatBot/restart?api-version=2021-02-01`);

    if (azureResponse == "200") {
        const responseMessage = `The bot has been restarted.`;
        try {
            await axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
                "content": responseMessage
            },
            { 
                "Content-Type": "application/json"
            });
        } catch (err) {
            context.log.error("ERROR", err);
            throw err;
        }
    } else {
        const responseMessage = `${azureResponse.info}`;
        try {
            await axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
                "content": responseMessage
            },
            { 
                "Content-Type": "application/json"
            });
        } catch (err) {
            context.log.error("ERROR", err);
            throw err;
        }
    }
}
