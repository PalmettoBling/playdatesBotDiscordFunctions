const { verifyKey } = require("discord-interactions");
const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = req.rawBody;

    context.log('Headers: ' + JSON.stringify(req.headers));
    context.log('Raw Body: ' + JSON.stringify(req.body));

    const verifiedRequest = await verifyKey(rawBody, signature, timestamp, process.env.PUBLICKEY);

    if (!verifiedRequest) {
        context.log("Invalid request signature");
        return context.res = { 
            status: 401,
        };
    } else if (req.body.type == 1) {
        context.log("Message type 1, sending ACK type 1");
        return context.res = { 
            body: {"type": 1 }
        };
    } else {
        context.res = {
            body: {
                "type": 4,
                "data": {
                    "content": "Working on your request..."
                }
            }
        };

        // req.body.data.name = name of slash function from discord
        axios.post(`https://playdatesbotdiscord.azurewebsites.net/api/${req.body.data.name}`, {
            hostName: req.body.data.options[0].value,
            gameName: req.body.data.options[1].value,
            interaction_token: req.body.token
        });
    }
}