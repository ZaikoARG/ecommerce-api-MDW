import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Acceso denegado. No hay token" });
        }

        // Verifica y decodifica el token
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as { id: string };

        // Busca el usuario real en MongoDB
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Guarda el usuario en req.user (tipado desde index.d.ts)
        req.user = user;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido" });
    }
};