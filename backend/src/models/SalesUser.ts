import mongoose, { Document, Schema } from 'mongoose';

export interface ISalesUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'sales';
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const salesUserSchema = new Schema<ISalesUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "sales"],
        default: "sales",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const SalesUser = mongoose.model<ISalesUser>("SalesUser", salesUserSchema);

export default SalesUser; 