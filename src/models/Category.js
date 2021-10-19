const { Schema, model } = require('mongoose')

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }
    },
    {
        timestamp: true,
        versionKey: false,
    }
);
module.exports = model("Categories", CategorySchema)