const crypto = require('crypto');
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const db = require('../utils/db')
const validateNote = require('../utils/validator')

module.exports.create = async (event) => {
    const response = { statusCode: 200 };

    try {
        const body = JSON.parse(event.body);

        const { error, value } = validateNote(body);
        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message })
            };
        }

        const params = {
            TableName: process.env.TABLE_NAME,
            Item: marshall({
                noteId: crypto.randomUUID(),
                ...value
            }),
        };

        await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully created item.",
            item: body,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create item.",
            errorMessage: e.message,
        });
    }

    return response;
};
