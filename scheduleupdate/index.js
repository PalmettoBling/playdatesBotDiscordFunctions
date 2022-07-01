module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("Req Body: ");
    context.log(req.body);

    const interactionToken = req.body.interaction_token;
    const applicationId = req.body.application_id;
    const interactionId = req.body.id;

}