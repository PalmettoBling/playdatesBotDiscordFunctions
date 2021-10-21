const { verifyKey } = require("discord-interactions");
const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = req.rawBody;

    context.log('Req Body: ');
    context.log(JSON.stringify(req.body));

    const verifiedRequest = verifyKey(rawBody, signature, timestamp, process.env.PUBLICKEY);

    if (!verifiedRequest) {
        context.log("Invalid request signature");
        return context.res = { 
            status: 401,
        };
    } else if (req.body.type == 1) {
        context.log(`Message type ${req.body.type}, sending ACK type 1`);
        return context.res = { 
            body: { "type": 1 }
        };
    } else {
        context.log(`Message type ${req.body.type}, responding and triggering function`)
        try {
            // req.body.data.name = name of slash function from discord
            // Need to send all options array to process if there are more than 2 options in command...
            axios.post(`https://playdatesbotdiscord.azurewebsites.net/api/${req.body.data.name}`, {
                options: req.body.data.options,
                interaction_token: req.body.token,
                application_id: req.body.application_id
            });

            return context.res = {
                body: { 
                    "type": 4,
                    "data": {
                        "content": "Processing your request."
                    }
                }
            };
        } catch (err) {
            context.log.error("ERROR", err);
            throw err;
        }
    }
}