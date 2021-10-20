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
    
    context.log("Response?: " + JSON.stringify(apiResponse.body));

    const responseMessage = "I've done a thing, and this is a test."

    const discordResponse = await axios.patch(`https://discord.com/api/webhooks/${process.env.APPLICATION_ID}/${interactionToken}/message/@original`, {
        content: `This is the updated message, about ${host} updating their show to ${game}`
    });
    context.log("Discord response: " + JSON.stringify(discordResponse.body));
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}