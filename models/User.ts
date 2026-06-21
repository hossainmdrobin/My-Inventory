import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    institute: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role:{type:String,default:"employee", emun:["employee","admin","manager"]},
    approved:{type:String, default:false}
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;