import moongose, {Schema} from "mongoose";

const productSchema: Schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, default: 0},
})

export default moongose.model("Product", productSchema);