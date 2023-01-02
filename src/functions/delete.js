const db = require('../utils/db')
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

module.exports.delete = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: marshall({ noteId: event.pathParameters.noteId }),
        };
        await db.send(new DeleteItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully deleted post.",
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to deleted post.",
            errorMessage: e.message,
        });
    }

    return response;
};
