'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var who = JSON.stringify(record.dynamodb.NewImage.ID.S);
            var whoEmail = JSON.stringify(record.dynamodb.NewImage.Email.S);
            //var when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
            var whatSubject = JSON.stringify(record.dynamodb.NewImage.Subject.S);
            var whatMessage = JSON.stringify(record.dynamodb.NewImage.Message.S);
            var params = {
                Subject: 'A new message from ' + who + whoEmail,
                Message: 'Message user ' + who + ' message the following at ' + ':\n\n ' + whatSubject + whatMessage,
                TopicArn: 'arn:aws:sns:us-east-1:126091198073:New-Messages'
            };
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   