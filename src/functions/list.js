// const db = require('./db')
// const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
// const { marshall } = require("@aws-sdk/util-dynamodb");

module.exports.list = async (event) => {
    const response = { statusCode: 200 };

    // try {
    //     const body = JSON.parse(event.body);
    //     const params = {
    //         TableName: process.env.TABLE_NAME,
    //         Item: marshall(body || {}),
    //     };
    // await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully get all item.",
        });
    // } catch (e) {
    //     console.error(e);
    //     response.statusCode = 500;
    //     response.body = JSON.stringify({
    //         message: "Failed to create item.",
    //         errorMessage: e.message,
    //     });
    // }

    return response;
};
