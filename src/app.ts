import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import moongose from "mongoose";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swagger';


require('dotenv').config({path:__dirname+'/../.env'})
dotenv.config(); // Carga las variables de entorno

const app = express();
app.use(express.json()); // Permite leer los datos en formato JSON
app.use(cookieParser()); // Permite leer las cookies.

const connectionString = encodeURI(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mdw-cluster.hn1goza.mongodb.net/?retryWrites=true&w=majority&appName=MDW-Cluster`);
moongose.connect(connectionString)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Error al conectar a MongoDB", err));

// Configuracion de Swagger
const specs = swaggerJsdoc(swaggerOptions);

// Rutas
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => {
    res.send("¡Hola! El servidor funciona.");
})
app.get("/ping", (req, res) => {
    res.send("pong");
})
app.use('/api/auth', authRoutes); // Monta rutas en /api/auth
app.use('/api/products', productRoutes); // Monta en /api/products
app.use('/api/cart', cartRoutes);  // Monta en /api/cart

export default app;