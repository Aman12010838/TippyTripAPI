// models/Agent/agent.model.js
import mongoose, {Schema} from "mongoose";

const agentAdminSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            trim: true,
        },
        city:{
            type: String,
            trim: true,
        },
        role:{
          type: String,
          default: "admin",
        },
        phone: {
            type: String,
            required: true,
            unique: true
          },
          OTP: {
            type: String
          },
          OTPCreatedTime: {
            type: Date
          },
          OTPAttempts: {
            type: Number,
            default: 0
          },
          isBlocked: {
            type: Boolean,
            default: false
          },
          blockUntil: {
            type: Date
          }
    },
    {
        timestamps: true
    }
)

export const agentAdmin = mongoose.model("Agentadmin", agentSchema);