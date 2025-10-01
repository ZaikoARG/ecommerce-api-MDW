import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import moongose from "mongoose";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";


require('dotenv').config({path:__dirname+'/../.env'})
dotenv.config(); // Carga las variables de entorno

const app = express();
app.use(express.json()); // Permite leer los datos en formato JSON
app.use(cookieParser()); // Permite leer las cookies.

const connectionString = encodeURI(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mdw-cluster.hn1goza.mongodb.net/?retryWrites=true&w=majority&appName=MDW-Cluster`);
moongose.connect(connectionString)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Error al conectar a MongoDB", err));

// Rutas
app.post("/test-user", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const user = new User({name, email, password});
        await user.save();
        res.json({message: "Usuario Creado", userId: user._id});
    } catch (error) {
        res.status(400).json({message: "Error al crear usuario", error: error});
    }
})
app.get("/", (req, res) => {
    res.send("¡Hola! El servidor funciona.");
})
app.get("/ping", (req, res) => {
    res.send("pong");
})
app.use('/api/auth', authRoutes); // Monta rutas en /api/auth
app.use('/api/products', productRoutes); // Monta en /api/products

export default app;