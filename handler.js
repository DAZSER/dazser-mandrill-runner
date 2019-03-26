"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("request-promise-native"));
const dynamo_1 = __importDefault(require("./dynamo"));
exports.sendPayloadToMandrill = async (event) => {
    const options = {
        body: {},
        headers: {
            "Content-Type": "application/json",
        },
        json: true,
        method: "POST",
        uri: "https://mandrillapp.com/api/1.0/messages/send-template.json",
    };
    for (const record of event.Records) {
        if (await dynamo_1.default(record.messageId, record.receiptHandle)) {
            console.error("Duplicate!", record);
            continue;
        }
        const json = JSON.parse(record.body);
        for (const payload of json) {
            options.body = payload;
            await request.post(options);
        }
    }
    return { message: "Payloads sent successfully!" };
};
