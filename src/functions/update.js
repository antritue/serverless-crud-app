const db = require('../utils/db')
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.update = async (event) => {
    const response = { statusCode: 201 };

    try {
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);

        const params = {
            TableName: process.env.TABLE_NAME,
            Key: marshall({ noteId: event.pathParameters.noteId }),
            // 'SET #key1 = :value1, #key2 = :value2'
            UpdateExpression: `SET ${objKeys.map((key, index) => `#key${index} = :value${index}`).join(", ")}`,
            // '{#key1 : realKey1, #key2 : realKey2}'
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            // '{:value1 : newValue1, :value2 : newValue2}'
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
            ConditionExpression: 'attribute_exists(noteId)',
        };
        const updatedNote= await db.send(new UpdateItemCommand(params));

        if (updatedNote) {
            response.body = JSON.stringify({
                message: "Successfully updated note.",
                rawData: updatedNote
            })
        } else {
            response.statusCode = 404;
            response.body = JSON.stringify({
                message: "ID does not exist."
            });
        }

    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update note.",
            errorMessage: e.message,
        });
    }

    return response;
};
