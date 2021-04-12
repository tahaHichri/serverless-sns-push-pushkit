# HMS Push Serverless Application

An AWS serverless application for sending push notifications to Huawei devices without Google Play Services
using [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
and [Amazon Simple Notification Service](https://aws.amazon.com/sns/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc)
.

![](https://i.imgur.com/LOenwX9.jpg)

The application can be included in your existing projects with minimal code change and has no impact on your current
architecture.

## How it works

The application creates an SNS topic and a lambda function that handles the authentication and the message sending to
Huawei push service.

It allows you to send push messages by
simply [publishing an SNS message](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-publishing-messages.html)
to that topic and including the push payload in
the [Message](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html#API_Publish_Examples) Parameter.

## Resources Stack

When you deploy the application

1. The [SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html) _mobile-push-hms_ is created.
2. A [lambda function](https://github.com/tahaHichri/serverless-sns-push-pushkit) is deployed
3. The lambda is subscribed to the SNS topic.

---

## Getting Started

### 1. Deploy the application

You can deploy the application by just clicking "Deploy" on
the [Application's page](https://serverlessrepo.aws.amazon.com/applications/eu-west-1/436063517074/sns-push-hms).

The deployed application will look like this

![Deployed](https://i.imgur.com/FA86IE4.jpg)

### 2. Set Lambda Environment variables

The Huawei Push
Service [requires an OAuth 2.0 access token for authentication](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section12493191334711)
The lambda will manage that for you, but you need to set your App Credentials.
[Here is how to get those credentials](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section15949191714611)

Once you have the credentials, add them as environment variables of the deployed lambda.

```bash
aws lambda update-function-configuration \ 
  --function-name YOUR-FUNCTION-NAME-HERE \
  --environment Variables="{HWEI_APP_ID=YOUR-HUAWEI-APP-ID-HERE, HWEI_CLIENT_ID=YOUR-HUAWEI-CLIENT-ID-HERE, HWEI_CLIENT_SECRET=YOUR-HUAWEI-CLIENT-SECRET-HERE}" 
```

You can find the function name by searching for the lambda in your lambda's page. The name should look like this:

```
serverlessrepo-sns-push-hms-snspushhms-1PJ111R3S6D59

```

Here is an example:

```bash

aws lambda update-function-configuration \
--function-name serverlessrepo-sns-push-hms-snspushhms-1PJ111R3S6D59 \
--environment Variables="{HWEI_APP_ID=102620955, HWEI_CLIENT_ID=102620955, HWEI_CLIENT_SECRET=ad363e473f9647e8334b8efcf177c043085893270e6201dcaf4bb37d861ce5b8}" 



```

___*Note the app id can be the same as the client id.*___

### 3. Publish Test Push Message

To send push messages, simply publish a message to the SNS topic, set the payload in the "Message" parameter.

Example Payload
template: [Check the project repo](https://github.com/tahaHichri/serverless-sns-push-pushkit/blob/master/message_body_template.js)

* deviceTokensArray: Array of device tokens
* title: Title of the push
* bodyText: Body of the push

More
details: [on the ref page]( https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/rest-sample-code-0000001050040242-V5)




Example SNS topic message publishing (nodeJS)

```javascript
const exampleTopicMessagePushPayload = {
    "validate_only": false,
    "message": {
        "notification": {
            "title": "SNS",
            "body": "body"
        },
        "android": {
            "notification": {
                "title": "Hello From SNS",
                "body": "This is a simple Message",
                "click_action": {
                    "type": 1,
                    "intent": "#Intent;compo=com.rvr/.Activity;S.W=U;end"
                }
            }
        },
        "token": [
            "IQAAAACy0bkXAAB0mmCPl4iJpQLsSezHUqe7ILS8EIRdUj8mX62FIl9xo928N1EUrqMY2AkakQbhGTe18hqszB8jbJn4ON4on6o-lJPZtHNISW8X0A"
        ]
    }
}

var sns = new AWS.SNS();
var snsParams = {
    Subject: "example_subject",
    Message: JSON.stringify(exampleTopicMessagePushPayload),
    TopicArn: '<ARN of the created topic goes here>'
};

await sns.publish(snsParams).promise();


```


---

## LICENSE
```
MIT License

Copyright (c) 2021 Taha Hichri

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```