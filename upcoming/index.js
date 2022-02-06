const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req body: ");
    context.log(req.body);
    
    const options = req.body.options;
    let designation;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const command = req.body.command;

    if (options) {
        designation = options[0].value;
    } else {
        designation = "next";
    }

    apiResponse = await axios.patch('https://www.xboxplaydates.us/api/upcoming', {
        option: designation
    });

    const responseMessage = apiResponse.data.info;
    try {
        axios.patch(`https://discord.com/api/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
            content: responseMessage
        },
        {
            "Content-Type": "application/json"
        });
    } catch (error) {
        context.log(error);
        throw error;
    }

    context.done();
}
