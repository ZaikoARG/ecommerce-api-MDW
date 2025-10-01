import moongose, {Schema} from "mongoose";


const cartItemSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true}, // Referencia a producto
    quantity: {type: Number, required: true, min: 1},
})

const cartSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true}, // Un carrito por usuario
    items: [cartItemSchema], // Array de items
})


export default moongose.model("Cart", cartSchema);