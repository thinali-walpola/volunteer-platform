import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength:1,
            maxLength:50
        },
        password:{
            type: String,
            required: true,
            minLength: 6
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,            
        }
    },
    {
        timestamps:true
    }
);
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    
});
export const User =  mongoose.model("User",userSchema);