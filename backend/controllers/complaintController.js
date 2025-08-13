// Get Complaint Function (Read):
//Staff
const Complaint = require('../models/Complaint');

const getComplaints = async (req, res) => {
    try {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//User
const getMyComplaints = async (req, res) => {
    try {
      const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Add Complaint:

const addComplaint = async (req, res) => {
    const { userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp } = req.body;
    try {
        const complaint = await Complaint.create({ userId: req.user.id, userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp });
        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// Update Complaint:

const updateComplaint = async (req, res) => {
    const { userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp, status } = req.body;
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        complaint.userName = userName || complaint.userName;
        complaint.emailAddress = emailAddress || complaint.emailAddress;
        complaint.incidentDate = incidentDate || complaint.incidentDate;
        complaint.natureOfComplaint = natureOfComplaint || complaint.natureOfComplaint;
        complaint.desiredOutcome = desiredOutcome || complaint.desiredOutcome;
        complaint.consentToFollowUp = consentToFollowUp ?? complaint.consentToFollowUp;
        complaint.status = status || complaint.status;
        
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}  

// Delete Complaint:

const deleteComplaint = async (req, res) => {
 try {
    const complaint = await Complaint.findById(req.params.id);
    if(!complaint) return res.status(404).json({message:'Complaint not found'});

    await complaint.remove();
    res.json({ message:'Complaint deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

module.exports = {getComplaints, getMyComplaints, addComplaint, updateComplaint, deleteComplaint };

// functions