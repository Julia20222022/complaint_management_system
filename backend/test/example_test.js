const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Complaint = require('../models/Complaint');
const { addComplaint, getComplaints, getMyComplaints, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { expect } = chai;

chai.use(chaiHttp);

// Restore stubs after each test
afterEach(() => {
  sinon.restore();
});

describe('AddComplaint Function Test', () => {
  it('should create a new complaint successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        userName: "John Doe",
        emailAddress: "john@example.com",
        incidentDate: "2025-12-31",
        natureOfComplaint: "Service issue",
        desiredOutcome: "Refund",
        consentToFollowUp: true
      }
    };

    const createdComplaint = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    const createStub = sinon.stub(Complaint, 'create').resolves(createdComplaint);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await addComplaint(req, res);

    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdComplaint)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(Complaint, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        userName: "John Doe",
        emailAddress: "john@example.com",
        incidentDate: "2025-12-31",
        natureOfComplaint: "Service issue",
        desiredOutcome: "Refund",
        consentToFollowUp: true
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await addComplaint(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

// Other test cases remain unchanged...