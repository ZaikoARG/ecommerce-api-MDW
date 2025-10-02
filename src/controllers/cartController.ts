import {Request, Response} from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";

export const getCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // Obtiene el ID del usuario del token (del middleware)
    try {
        let cart = await Cart.findOne({user: userId}).populate("items.product"); // Busca carrito y pobla productos
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({message: "Error al obtener el carrito"});
    }
};

export const addToCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body; // Obtiene el ID del producto y la cantidad desde el cuerpo del request
    if (!productId || !quantity || quantity < 1)
    {
        return res.status(400).json({message: "ProductID y cantidad (min. 1) son requeridos"});
    }

    try {
        const product = await Product.findById(productId); // Verfica que el producto exista
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        let cart = await Cart.findOne({ user: userId }); // Busca carrito existente
        if (!cart) {
            cart = new Cart({ user: userId, items: [] }); // Crea un nuevo carrito si no existe
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId); // Busca si ya esta en el carrito
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity; // Incrementa la cantidad del producto si es que ya existe
        } else {
            cart.items.push({ product: productId, quantity }); // Agrega nuevo item
        }

        await cart.save(); // Guarda los cambios
        await cart.populate("items.product"); // Pobla productos para la respuesta
        res.json(cart); // Devuelve el carrito actualizado
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error al agregar al carrito"});
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
        return res.status(404).json({message: "ProductId y cantidad (mín. 1) son requeridos."});
    }

    try {
        const cart = await Cart.findOne({ user: userId });  // Busca el carrito
        if (!cart) {
            return res.status(404).json({message: "Carrito no encontrado"});
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId) // Busca el item en el carrito
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito.' });
        }

        cart.items[itemIndex].quantity = quantity; // Actualiza la cantidad
        await cart.save() // Guarda
        await cart.populate("items.product"); // Pobla
        res.json(cart);
    } catch (error) {
        res.status(500).json({message: "Error al actualizar el carrito"});
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId; // ID del producto desde la URL

    try {
        const cart = await Cart.findOne({ user: userId }); // Busca el carrito
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        for (let i = cart.items.length - 1; i >= 0; i--) {
            if (cart.items[i].product.toString() === productId) {
                cart.items.splice(i, 1); // Elimina el item del carrito
            }
        }
        await cart.save(); // Guarda
        await cart.populate("items.product"); // Pobla
        res.json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error al eliminar el producto del carrito"});
    }
};