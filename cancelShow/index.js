const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const host = req.body.options[0].value;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    context.log("command: " + command);

    const apiResponse = await axios.put('https://www.xboxplaydates.us/ambassadorschedule/discord', {
        hostName: host,
        commandName: command
    });

    if (apiResponse.status == "200") {
        const responseMessage = `The show ${apiResponse.data.title} on ${apiResponse.data.date} has been cancelled.`;        
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
        const responseMessage = `${apiResponse.info}`;
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
    
    context.done();
}