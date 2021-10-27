const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    //channelName, quoteId, game

    const channel = req.body.options[0].value;
    const id = req.body.options[1].value;
    const game = req.body.options[2].value;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    const apiResponse = await axios.get('https://www.xboxplaydates.us/playdatesquotes/specificquote', {
        channelName: channel,
        quoteId: id,
        game: game
    });

    if (apiResponse.status == "200") {
        const responseMessage = `${apiResponse.quote} -${apiResponse.attribution} ${apiResponse.dateOfQuote} ${apiResponse.game}`;
        try {
            await axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
                "content": responseMessage
            },
            { 
                "Content-Type": "application/json"
            });
        } catch(err) {
            context.log.error("Error: ", err);
            throw err;
        }
    } else {
        const responseMessage = "What did you do?  It was something _wrong_, I can tell you that.";
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