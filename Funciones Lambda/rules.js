import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
   const command = new PutCommand({
      TableName: 'ph_value',
      Item: {
         timestamp: event.timestamp,
         thing_name: event.Thing_name,
         sn: event.sn,
         phValue: event.phValue,
      }
   });
   const response = await docClient.send(command);
   console.log(response);
};