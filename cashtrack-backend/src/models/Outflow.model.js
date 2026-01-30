const mongoose = require('mongoose');

const outflowSchema = new mongoose.Schema({
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
        required: [true, 'Date is required'],
        default: Date.now,
        index: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['restocking', 'delivery', 'utilities', 'rent', 'salaries', 'other'],
        default: 'other'
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
outflowSchema.index({ user: 1, date: -1 });
outflowSchema.index({ user: 1, isDeleted: 1, date: -1 });

// Soft delete method
outflowSchema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
};

module.exports = mongoose.model('Outflow', outflowSchema);
