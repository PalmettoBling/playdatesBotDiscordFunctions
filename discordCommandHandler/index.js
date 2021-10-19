const { verifyKey } = require("discord-interactions");
const axios = require('axios');

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
            status: 401,
        };
    } else if (req.body.type == 1) {
        context.log("Message type 1, sending ACK type 1");
        return context.res = { 
            body: {"type": 1 }
        };
    } else {
        messageBack = await handleCommand(req.body.data.name);
        context.log("messageBack: " + messageBack);
        return context.res = {
            status: 200, 
            body: {
                "type": 4,
                "data": {
                    "tts": False,
                    "content": `${messageBack}`,
                    "embeds": [],
                    "allow_mentions": {"parse": []}
                }
            }
        };
    }
}

async function handleCommand(commandName) {
    switch(commandName) {
        case 'gameplan':
            context.log(`Valid request, type: ${req.body.type}`);
            const playHost = req.body.data.options[0].value;
            context.log("Have playhost: " + playHost);
            const game = req.body.data.options[1].value;
            context.log("Have game: " + game);
            axios.put('https://www.xboxplaydates.us/ambassadorschedule/discordShowUpdate', 
                {hostName: `${playHost}`, gameName: `${game}`})
                .then(res => {
                    if (res.status(200)) {
                        context.log("Status 200");
                        context.log(res.body);
                        return `${res.body.title} on ${res.body.date} has been updated to ${res.body.game}`;
                    }
            });
            break;
    }
}