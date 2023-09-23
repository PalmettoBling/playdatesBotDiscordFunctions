const { default: axios } = require ("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;

    const userName = req.body.options[0].value;
    const bskyDid = req.body.options[1].value;
    context.log('Got options, username and DID');
    context.log("user: " + userName);
    context.log("bsky DID: " + bskyDid);

    const triggerDnsFunction = await axios.post('https://bskydnsdid.azurewebsites.net/api/psDnsCreate?code=sk7GZ1pwEmvpS5f8sHJ7l7B1rvtJpLhhjIcaAzjxvi4CAzFuB7ZT7Q==', {
        user: userName,
        did: bskyDid
    });
    context.log("Posted to DNS Function");

    if (triggerDnsFunction.status == "200") {
        const responeMessage = `Processing records for @${userName}.XboxPlaydates.me`
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
        const responseMessage = "What did you do?  It was _something_ wrong, I can tell you that.";
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