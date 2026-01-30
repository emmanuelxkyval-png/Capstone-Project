const mongoose = require('mongoose');

const inflowSchema = new mongoose.Schema(
    {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    paymentChannel: {
        type: String,
        required: true,
        enum: ['cash', 'transfer', 'online'],
        default: 'cash'
    },
    note: {
        type: String,
        trim: true,
        maxlength: [500, 'Note cannot exceed 500 characters']
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    
}, {
    timestamps: true
});

// Compound index for efficient queries
inflowSchema.index({ user: 1, date: -1 });
inflowSchema.index({ user: 1, isDeleted: 1, date: -1 });
inflowSchema.index({ user: 1, paymentChannel: 1, date: -1 });

// Soft delete method
inflowSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    return this.save();
};

module.exports = mongoose.model('Inflow', inflowSchema);
