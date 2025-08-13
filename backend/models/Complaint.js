
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    incidentDate: { type: Date, required: false },
    natureOfComplaint: { type: String, required: true },
    desiredOutcome: { type: String, required: false },
    consentToFollowUp: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    status: { type: String, default: 'open'},
});

module.exports = mongoose.model('Complaint', complaintSchema);
