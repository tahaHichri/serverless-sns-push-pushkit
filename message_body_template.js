/**
 * TODO: this is a simple template a message with a title and body text
 * 
 * Find more properties on this guide:
 * https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/rest-sample-code-0000001050040242-V5
 */

exports.pushMessagePayloadTemplate = (title, bodyText, deviceTokensArray) => {
    return {
        "validate_only": false,
        "message": {
            "notification": {
                "title": "SNS",
                "body": "body"
            },
            "android": {
                "notification": {
                    "title": title,
                    "body": bodyText,
                    "click_action": {
                        "type": 1,
                        "intent": "#Intent;compo=com.rvr/.Activity;S.W=U;end"
                    }
                }
            },
            "token": deviceTokensArray

        }
    }
}
