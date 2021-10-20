module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

/*
async function handleCommand(context, commandData) {
    switch(commandData.name) {
        case 'gameplan':
            context.log("Switch GamePlan");
            const playHost = commandData.options[0].value;
            context.log("Have playhost: " + playHost);
            const game = commandData.options[1].value;
            context.log("Have game: " + game);
            axios.put('https://www.xboxplaydates.us/ambassadorschedule/discord', 
                {
                    hostName: `${playHost}`, gameName: `${game}`
                })
                .then(function(response) {
                    context.log("Response status: " + response.status);
                    context.log("Response Body: " + response.data);
                    let messageBack = `${response.body.title} on ${response.body.date} has been updated to ${response.body.game}`;
                    context.log("messageBack: " + messageBack);
                    context.res = {
                        status: 200, 
                        body: {
                            type: 4,
                            data: {
                                tts: false,
                                content: `${messageBack}`,
                                embeds: [],
                                allow_mentions: {parse: []}
                            }
                        }
                    };
            });
            break;
    }
}*/