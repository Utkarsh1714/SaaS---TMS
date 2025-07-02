import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gstin: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    logoUrl: {
        type: String,
        required: true,
    },
    webstieUrl: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

const Organization = mongoose.model("Organiztion", OrganizationSchema);

export default Organization;