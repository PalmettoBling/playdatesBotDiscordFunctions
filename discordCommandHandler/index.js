const { verifyKey } = require("discord-interactions");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = req.rawBody;

    context.log('Headers: ' + JSON.stringify(req.headers));
    context.log('Raw Body: ' + JSON.stringify(rawBody));

    const verifiedRequest = await verifyKey(rawBody, signature, timestamp, process.env.PUBLICKEY);

    if (!verifiedRequest) {
        context.log("Invalid request signature");
        return context.res = { 
            status: 401
        };
    } else if (req.body.type == 1) {
        context.log("Message type 1, sending ACK type 1");
        return context.res = { 
            "type": 1 
        };
    } else {
        context.log("Valid request, not type 1 req, sending res 200, type 1");
        return context.res = {
            status: 200, 
            "type": 1
        };
    }
}