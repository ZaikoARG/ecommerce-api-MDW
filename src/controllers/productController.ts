import {Request, Response} from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find(); // Obtiene todos los productos
        res.json(products); // Los devuelve como JSON
    } catch (error) {
        res.status(500).json({message: "Error al obtener los productos"});
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id); // Busca por ID
        if (!product) {
            return res.status(404).json({message: "Producto no encontrado"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: "Error al obtener el producto"});
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const {name, description, price, stock} = req.body; // Obtiene los datos del body
    if (!name || !price)
    {
        return res.status(400).json({message: "Nombre y precio son requeridos"});
    }

    try {
        const product = new Product({name, description, price, stock}); // Crea el nuevo producto
        await product.save(); // Guarda el producto en MongoDB
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({message: "Error al crear el producto"});
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try
    {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, // Actualiza con los datos del body
            { new: true } // Devuelve el documento actualizado
        );
        if (!product)
        {
            return res.status(404).json({message: "Producto no encontrado"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: "Error al actualizar el producto"});
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try
    {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product)
        {
            return res.status(404).json({message: "Producto no encontrado"});
        }
        res.status(200).json({message: "Producto eliminado correctamente"});
    } catch (error) {
        res.status(500).json({message: "Error al eliminar el producto"});
    }
};