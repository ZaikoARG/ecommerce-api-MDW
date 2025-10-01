import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({message:"Acceso denegado. No hay token"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string); // Verifica el token con el secreto
        (req as any).user = decoded; // Agrega el usuario decodificado a req para usarlo después
        next();
    } catch (error) {
        res.status(403).json({message:"Token Invalido"});
    }
}