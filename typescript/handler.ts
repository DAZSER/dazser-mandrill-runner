import * as request from "request-promise-native";
import checkMessage from "./dynamo";

export const sendPayloadToMandrill = async (event: AWSLambda.SQSEvent) => {

  // This function will send the payload to mandrill
  // console.log(JSON.stringify(event));
  const options = {
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
    json: true,
    method: "POST",
    uri: "https://mandrillapp.com/api/1.0/messages/send-template.json",
  };

  // Loop through the event.Records
  for (const record of event.Records) {

    if (await checkMessage(record.messageId, record.receiptHandle)) {
      console.error("Duplicate!", record);
      continue;
    }

    // Get the body of the record. It's JSON
    const json = JSON.parse(record.body);

    // For each payload in the json body
    for (const payload of json) {
      // Take the payload and send it to Mandrill
      options.body = payload;

      // Now that we have the json set up, call mandrill
      await request.post(options);

    }
  }
  return { message: "Payloads sent successfully!" };
};
