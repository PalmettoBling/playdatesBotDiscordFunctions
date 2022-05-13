const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const host = req.body.options[0].value;
    const game = req.body.options[1].value;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;
    
    context.log("Game: " + game);
    context.log("Host: " + host);

    const apiResponse = await axios.put('https://www.xboxplaydates.us/ambassadorschedule/discord', {
        hostName: host,
        gameName: game,
        commandName: command
    });

    if (apiResponse.status == "200") {
        if (apiResponse.data.info === 'Was unable to update Segment, not sure why, though...') {
            const responseMessage = `Something went wrong. I'm not sure what. I'm not sure where. But _something_ is wrong.  Check to see if the command stuck with an /upcoming ${host} ?  I don't know, I'm a programmer not a damn wizard.`;
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
        } else if (apiResponse.data.info === 'Show not updated.  Please check spelling or be more specific...') {
            const responseMessage = apiResponse.data.info;
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
        } else {
            const responseMessage = `The show ${apiResponse.data.title} on ${apiResponse.data.date} has been updated to ${apiResponse.data.game}`;        
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
    } else {
        const responseMessage = apiResponse.data.info;        
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