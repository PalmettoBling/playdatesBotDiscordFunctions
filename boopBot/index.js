const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    context.log("command: " + command);

    axios.post(`https://prod-38.eastus.logic.azure.com:443/workflows/e49780c06aaa4377ac3cbdd7000969c2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TqKx6pM8fHEPp_VcS_7vyD5Ei3R1zoB1-to0ZixEVV4`);

    const responseMessage = `An attempt to restart the bot has been made.  Please allow a few minutes while it restarts.`;
    
    axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
        "content": responseMessage
    },
    { 
        "Content-Type": "application/json"
    }); 
}
