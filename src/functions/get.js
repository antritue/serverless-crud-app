const db = require('../utils/db')
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.get = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: marshall({ noteId: event.pathParameters.noteId }),
        };
        const { Item } = await db.send(new GetItemCommand(params));

        if (Item) {
            response.body = JSON.stringify({
                message: "Successfully retrieved note.",
                data: unmarshall(Item)
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
            message: "Failed to get note.",
            errorMessage: e.message,
        });
    }

    return response;
};
