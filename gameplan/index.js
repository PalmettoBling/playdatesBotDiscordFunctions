const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const host = req.body.options[0].value;
    const game = req.body.options[1].value;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;

    const apiResponse = await axios.put('https://www.xboxplaydates.us/ambassadorschedule/discord', {
        hostName: host,
        gameName: game
    });

    const responseMessage = `The show ${apiResponse.data.title} on ${apiResponse.data.date} has been updated to ${apiResponse.data.game}`;

    try {
        await axios.post(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}`, {
            content: responseMessage
        });
    } catch (err) {
        context.log.error("ERROR", err);
        throw err;
    }
    
    context.done();
}