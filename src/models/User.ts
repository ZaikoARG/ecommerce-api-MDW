import moongose, {Schema, Document} from "mongoose";
import bcrypt from "bcrypt";


// Definimos una interfaz para el usuario
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Definimos la estrucutra del usuario
const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

// Hook para hashear la contraseña del usuario antes de guardarla
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {return next()} // Solo si la contraseña cambió
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Metodo para comparar contraseñas, utilizado en el login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Exportamos el modelo para usarlo en otros archivos
export default moongose.model<IUser>("User", userSchema);