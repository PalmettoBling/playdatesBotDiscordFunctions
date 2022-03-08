const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    const options = req.body.options;

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;

    let showHost = options[0].host;
    let showName = options[0].title;
    let showGame = options[0].game;
    let showDate = options[0].date;
    let showHour = options[0].hour;
    let showMinute = options[0].minute;
    let showDuration = options[0].duration;

    const apiResponse = await axios.put('https://www.xboxplaydates.us/api/scheduleambassadorshow', {
        host: showHost,
        title: showName,
        game: showGame,
        date: showDate,
        hour: showHour,
        minute: showMinute,
        duration: showDuration
    });

    context.log("API Response: ");
    context.log(apiResponse);

    if (apiResponse.status == "200") {
        let showOptions = [
            {
                "value": showHost
            },
            {
                "value": showGame
            }
        ];            

        axios.post(`https://playdatesbotdiscord.azurewebsites.net/api/gameplan`, {
            options: showOptions,
            interaction_token: interactionToken,
            application_id: applicationId,
            interaction_id: interactionId,
            command: "upcoming"
        });
    }
}