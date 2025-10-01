import moongose, {Schema} from "mongoose";
import bcrypt from "bcrypt";


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
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Exportamos el modelo para usarlo en otros archivos
export default moongose.model("User", userSchema);