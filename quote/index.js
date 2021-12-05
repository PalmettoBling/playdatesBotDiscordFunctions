const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    context.log("Req Body: ");
    context.log(req.body);

    const options = req.body.options;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const channel = options[0].value;
    let id;

    context.log("Options: ");
    context.log(JSON.stringify(options));

    if (options[1]) {
        id = options[1].value;
    }

    context.log("Channel: " + channel);
    context.log("ID: " + id);

    const apiResponse = await axios.post('https://www.xboxplaydates.us/playdatesquotes/specificquote', {
        channelName: channel,
        quoteId: id
    });
    context.log("sent req to playdatesbot.");

    if (apiResponse.status == "200") {
        const responseMessage = `#${apiResponse.data.id}: ${apiResponse.data.quote} -${apiResponse.data.attribution} ${apiResponse.data.dateOfQuote} ${apiResponse.data.game} (${channel})`;
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