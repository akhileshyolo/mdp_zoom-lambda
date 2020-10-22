import uuid from 'uuid';

import dynamo from './dynamo';
import { failure, success } from './response';

exports.putItem = async function(obj, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'

  const data = {
    userId: uuid.v1(),
    createdAt: Date.now() // timestamp
  }

  const params = {
    TableName: obj.tableName,
    Item: Object.assign(data, obj.item)
  };

  try {
    await dynamo.call('put', params);
    return success(params.Item);
  }
  catch (error) {
    return failure({ status: false, error });
  }
}

exports.deleteItem = async function(obj, context) {
  const params = {
    TableName: obj.tableName,
    Key: obj.item
  };

  try {
    await dynamo.call('delete', params);
    return success({ status: true });
  }
  catch (error) {
    return failure({ status: false, error });
  }
}


exports.scanAll = async function(obj, context) {
  const params = {
    TableName: obj.tableName
  };

  try {
    const result = await dynamo.call('scan', params);
    return result.Items ?
      success(result.Items) :
      failure({ status: false, error: 'Organisation unknown' });
  }
  catch (error) {
    return failure({ status: false, error });
  }
}


exports.scanItemByKey = async function(obj, keyName, context) {
  const params = {
    TableName: obj.tableName,
    FilterExpression: keyName + ' = :parentId',
    ExpressionAttributeValues: {
      ':parentId': obj.id
    }
  };

  try {
    const result = await dynamo.call('scan', params);
    return result.Items ?
      success(result.Items) :
      failure({ status: false, error: 'Organisation unknown' });
  }
  catch (error) {
    return failure({ status: false, error });
  }
}


exports.getItem = async function(obj, context) {
  const params = {
    TableName: obj.tableName,
    Key: {
      pk: obj.id
    }
  };

  try {
    const result = await dynamo.call('get', params);
    return result.Item ? success(result.Item) : failure({ status: false, error: 'Organisation unknown' });
  }
  catch (error) {
    return failure({ status: false, error });
  }
}

exports.updateItem = async function(obj, context) {

  const params = {
    TableName: obj.tableName,
    Key: {
      pk: obj.id
    },
    ConditionExpression: 'orgId = :orgId',
    UpdateExpression: 'SET parentId = :parentId, foundedAt = :foundedAt, revenue = :revenue',
    ExpressionAttributeValues: {
      ':orgId': event.pathParameters.orgId,
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamo.call('update', params);
    return success({ status: true });
  }
  catch (error) {
    return failure({ status: false, error });
  }
}
