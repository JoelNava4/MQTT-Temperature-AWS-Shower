import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
   const command = new PutCommand({
      TableName: 'valve_Activation',
      Item: {
         timestamp: event.timestamp,
         thing_name: event.Thing_name,
         sn: event.sn,
         state_valve: event.state_valve,
      }
   });
   const response = await docClient.send(command);
   console.log(response);
};