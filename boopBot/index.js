const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    context.log("command: " + command);

    const azureResponse = await axios.put(`https://www.xboxplaydates.us/api/boopbot`);

    const responseMessage = `An attempt to restart the show has been made.  Please allow a few minutes while the bot restarts.`;
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
