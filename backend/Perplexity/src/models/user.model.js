import mongoose from "mongoose"
import bcrypt from "bcryptjs"

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
            type: Boolean,
            required: true,
            default: false
        }
    }, { timestamps: true }
)


// Pre-save hook: hashes the password before saving, but only if it was changed (prevents re-hashing an already-hashed password)
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// Instance method: compares a plain-text login password against the stored hashed password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}


const userModel = mongoose.model('User', userSchema)

export { userModel }