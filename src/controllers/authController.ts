import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async(req: Request, res: Response) => {
    const { name, email, password } = req.body; // Obtiene los datos del cuerpo del request
    if (!name || !email || !password) {
        return res.status(400).json({message:"Datos invalidos. La longitud minima de la conteaseña es de 6 caracteres."});
    }

    try {
        const existingUser = await User.findOne({email}) // Busca si el email ya existe
        if (existingUser) {
            return res.status(400).json({message:"El email ya esta registrado"});
        }

        const user = new User({name, email, password}); // Crea el nuevo usuario
        await user.save(); // Guarda en MongoDB
        res.status(201).json({message:"Usuario registrado exitosamente"});
    } catch (error) {
        res.status(500).json({message:"Error del servidor"});
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Datos inválidos." });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        // Genera tokens
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        // CONFIG DE COOKIES
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 15 * 60 * 1000 // 15 min
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });

        // DEVUELVO USER PARA QUE EL FRONTEND TENGA LOS DATOS
        res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error del servidor" });
    }
};

export const logout = async(req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({message:"Logout Exitoso"});
}

export const refresh = async(req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken; // Lee el refresh token de la cookie
    if (!refreshToken)
    {
        return res.status(401).json({message:"No hay refresh token."});
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {id: string}; // Verifica el refresh token
        const accessToken = jwt.sign({id: decoded.id}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: '15m'}); // Nuevo access token

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'produccion' });
        res.json({message:"Token refrescado !"});
    } catch (error) {
        res.status(403).json({message:"Refresh token invalido"});
    }
}

export const getMe = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }
    res.json({
        user: req.user
    });
};