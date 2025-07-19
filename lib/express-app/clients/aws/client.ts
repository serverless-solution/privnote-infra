// Initializes AWS SDK clients
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// create docClient
let _docClientInstance: DynamoDBDocumentClient;
const getDocClient = (): DynamoDBDocumentClient => {
  return (_docClientInstance ??= DynamoDBDocumentClient.from(
    new DynamoDBClient()
  ));
};

export const docClient = getDocClient();
