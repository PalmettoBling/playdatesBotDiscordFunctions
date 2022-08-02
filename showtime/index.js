const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    const options = req.body.options;

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;

    let host = options[0].value;
    let name = options[1].value;
    let game = options[2].value;
    let date = options[3].value;
    let hour = options[4].value;
    let minute = options[5].value;
    let duration = options[6].value;

    let showName = name + " with " + host;
    context.log("Show Name: " + showName);

    let apiResponse = await axios.post('https://www.xboxplaydates.us/api/scheduleambassadorshow', {
        "showName": showName,
        "showHour": hour,
        "showMin": minute,
        "showDate": date,
        "showDuration": duration,
        "showGame": game
    });

    console.log("API Response: " + apiResponse.data);

    if (apiResponse.status == "200") {
        const responseMessage = apiResponse.data.info;
        try {
            axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/${interactionId}`, {
                "content": responseMessage
            },
            { 
                "Content-Type": "application/json"
            });
        } catch (error) {
            context.log(error);
            throw error;
        }
    } else {
        const responseMessage = "There was an error processing this request."
        try {
            axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/${interactionId}`, {
                "content": responseMessage
            },
            { 
                "Content-Type": "application/json"
            });
        } catch (error) {
            context.log(error);
            throw error;
        }
    }
    
}