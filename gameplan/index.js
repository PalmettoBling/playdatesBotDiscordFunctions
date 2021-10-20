const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const host = req.body.hostName;
    const game = req.body.gameName;
    const interactionToken = req.body.interaction_token;
    
    const apiResponse = await axios.put('https://www.xboxplaydates.us/ambassadorschedule/discord', {
        hostName: host,
        gameName: game
    });
    
    context.log("Response?: " + JSON.stringify(apiResponse.data));

    const responseMessage = `The show ${apiResponse.data.title} on ${apiResponse.data.date} has been updated to ${apiResponse.data.game}`;

    const discordResponse = await axios.patch(`https://discord.com/api/webhooks/${process.env.APPLICATION_ID}/${interactionToken}`, {
        content: responseMessage
    });
    
    if(discordResponse) {
        context.log("Discord response: " + JSON.stringify(discordResponse.data));
    }
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}