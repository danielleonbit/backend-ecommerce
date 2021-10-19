const { Schema, model } = require('mongoose')

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true},
        id_category: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: true
        },
        price:{ type: Number, required: true}
      
    },
    {
        timestamp: true,
        versionKey: false,
    }
);

module.exports = model("Products", ProductSchema)