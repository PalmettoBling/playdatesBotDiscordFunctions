const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    let apiResponse;
    let action;
    let id;
    let responseMessage;
    const options = req.body.options;
    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    

    if (options[0]) {
        action = options[0].name;
        id = options[0].value;    
    }

    context.log("Action: " + action);
    context.log("ID: " + id);

    // action if there are no options
    // Gathers quotes available for review
    if (!action) {
        // database function trigger to get details?  All another azure function, get data and return...
        apiResponse = await axios.get("");
        context.log("Sent request for quotes");
        context.log("Response data: " + apiResponse.data.info);
        responseMessage = apiResponse.data.info;
    } else {
        //action if there are options to approve or deny a specific quote in the review database
        if (action == "approve") {
            // action to approve a quote and move to official database
            // call playdates bot API to add quote
            apiResponse = await axios.patch("", {
                "action": action,
                "id": id
            });
            responseMessage = apiResponse.data.info;
        } else if (action == "deny") { 
            //action to deny quote and remove from review database
            // call database azure function to remove item from DB
            apiResponse = await axios.patch("", {
                "action": action,
                "id": id
            });
            responseMessage = apiResponse.data.info;
        }
    }

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

    context.done();
}