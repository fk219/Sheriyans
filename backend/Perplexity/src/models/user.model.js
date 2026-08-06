import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        verified: {
            type: String,
            required: true,
            enum: ['user', 'ai']
        }
    }, { timestamps: true }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('User', userSchema)

export { userModel }