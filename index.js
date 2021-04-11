var AWS = require('aws-sdk');
const axios = require('axios');

const message_template = require('./message_body_template');
/**
 * Lambda environment variables
 */
const HWEI_APP_ID = process.env.HWEI_APP_ID
const HWEI_CLIENT_ID = process.env.HWEI_CLIENT_ID
const HWEI_CLIENT_SECRET = process.env.HWEI_CLIENT_SECRET


// Authentication and push api endpoints
const hwei_oauth_token_url = "https://oauth-login.cloud.huawei.com/oauth2/v3/token"
const hwei_push_api_base_url = `https://push-api.cloud.huawei.com/v1/${HWEI_APP_ID}/messages:send`


exports.handler = async (event) => {

    try {

        /**
         * Check if SNS is invoking this lambda.
         */
        if (event.Records && event.Records[0].Sns) {

            // request token
            const tokenReq = await requestHwOauthAccessToken(HWEI_CLIENT_ID, HWEI_CLIENT_SECRET)

            if (!tokenReq.data || !tokenReq.data.access_token) throw "Error retrieving access token"

            // get the access token for next request
            const appAccessToken = tokenReq.data.access_token


            // prepare a simple push notification payload with an example device token
            // You can find the details below

            /**
             * Example template for message payload, uncomment to use
             * const simpleNotificationPayload = message_template.pushMessagePayloadTemplate("Hello From SNS",
             *      "This is a simple Message",
             *      ["IQAAAACy0bkXAAB0mmCPl4iJpQLsSezHUqe7ILS8EIRdUj8mX62FIl9xo928N1EUrqMY2AkakQbhGTe18hqszB8jbJn4ON4on6o-lJPZtHNISW8X0A"])
             */



                // Forward SNS message payload to the push service, The topic should send a payload in this format:
                // https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/rest-sample-code-0000001050040242-V5
            const simpleNotificationPayload = event.Records[0].Sns.Message


            // send
            const postMessageReq = await postPushMessage(appAccessToken, simpleNotificationPayload)
            // console.log(appAccessToken)

            if (!postMessageReq.data || !postMessageReq.data.code) {
                throw "Error Sending Message"
            }

            if (postMessageReq.data.code !== "80000000")
                throw `Message Sending failed with error: ${JSON.stringify(postMessageReq.data)}`

            return {
                statusCode: 200
            }
        }

    } catch (ex) {

        console.error(ex)

        // handle or log the exception

    }

};


/**
 * The app-level access token required for the push request
 * https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section12493191334711
 */
async function requestHwOauthAccessToken(clientId, clientSecret) {

    let path = hwei_oauth_token_url;

    // x-www-form-urlencoded params
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);


    return await axios.post(path, params)
}


/**
 * The app-level access token required for the push request
 * https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section12493191334711
 */
async function postPushMessage(accessToken, messagePayloadObj) {

    let path = hwei_push_api_base_url;

    const reqParams = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    return await axios.post(path, messagePayloadObj, reqParams)
}
