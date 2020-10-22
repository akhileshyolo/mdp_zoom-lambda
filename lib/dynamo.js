import AWS from 'aws-sdk';

/**
 * @name call
 * @param {*} action
 * @param {*} params
 */
const call = (action, params) => {
  // mandatory since we are not operating in the default region
  AWS.config.update({ region: 'us-east-1' });

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
};

export default { call };
