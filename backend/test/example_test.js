const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');

const Complaint = require('../models/Complaint');
const { addComplaint, updateComplaint, getComplaints, getMyComplaints, deleteComplaint } = require('../controllers/complaintController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

afterEach(() => sinon.restore());


describe('AddComplaint Function Test', () => {

  it('should create a new complaint successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        userName: 'Jane Doe',
        emailAddress: 'jane@example.com',
        incidentDate: '2025-12-31',
        natureOfComplaint: 'Something happened',
        desiredOutcome: 'Resolution',
        consentToFollowUp: true,
      }
    };

    // Mock complaint that would be created
    const createdComplaint = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Complaint.create to return the createdComplaint
    const createStub = sinon.stub(Complaint, 'create').resolves(createdComplaint);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addComplaint(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Complaint.create to throw an error
    const createStub = sinon.stub(Complaint, 'create').rejects(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { userName: 'Jane Doe', emailAddress: 'jane@example.com', natureOfComplaint: 'Something happened' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addComplaint(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update complaint successfully', async () => {
    // Mock complaint data
    const complaintId = new mongoose.Types.ObjectId();
    const existingComplaint = {
      _id: complaintId,
      userName: 'Old Name',
      emailAddress: 'old@example.com',
      status: 'open',
      save: sinon.stub().resolvesThis(), // Mock save method
    };

    // Stub Complaint.findById to return mock complaint
    const findByIdStub = sinon.stub(Complaint, 'findById').resolves(existingComplaint);

    // Mock request & response
    const req = {
      params: { id: complaintId },
      user: { id: new mongoose.Types.ObjectId(), role: 'staff' },
      body: { userName: 'New Name' }
    };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await updateComplaint(req, res);

    // Assertions
    expect(existingComplaint.userName).to.equal('New Name');
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if complaint is not found', async () => {
    const findByIdStub = sinon.stub(Complaint, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId(), role: 'staff' }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateComplaint(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Complaint, 'findById').rejects(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId(), role: 'staff' }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateComplaint(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});


describe('GetComplaint Function Test', () => {

  it('should return all complaints for staff users', async () => {
    const complaints = [
      { _id: new mongoose.Types.ObjectId(), userId: new mongoose.Types.ObjectId(), userName: 'John Doe', emailAddress: 'john@example.com', natureOfComplaint: 'Service issue', status: 'open', createdAt: new Date(), updatedAt: new Date() },
      { _id: new mongoose.Types.ObjectId(), userId: new mongoose.Types.ObjectId(), userName: 'Jane Doe', emailAddress: 'jane@example.com', natureOfComplaint: 'Product issue', status: 'in-progress', createdAt: new Date(), updatedAt: new Date() },
    ];


    const chain = {
      sort: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      then: (resolve) => resolve(complaints),
    };
    const findStub = sinon.stub(Complaint, 'find').returns(chain);

    // Mock request & response (staff)
    const req = { user: { id: new mongoose.Types.ObjectId(), role: 'staff' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await getComplaints(req, res);

    // Assertions
    expect(res.json.calledOnce).to.be.true;
    const payload = res.json.firstCall.args[0];
    const list = Array.isArray(payload) ? payload : (payload && (payload.complaints || payload.data || payload.results)) || [];
    expect(Array.isArray(list)).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const chain = {
      sort: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      then: (resolve, reject) => reject(new Error('DB Error')),
    };
    const findStub = sinon.stub(Complaint, 'find').returns(chain);

    // Mock request & response (staff)
    const req = { user: { id: new mongoose.Types.ObjectId(), role: 'staff' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await getComplaints(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});


describe('GetMyComplaints Function Test', () => {

  it('should return complaints for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock complaint data
    const complaints = [
      { _id: new mongoose.Types.ObjectId(), userId, userName: 'Complaint 1' },
      { _id: new mongoose.Types.ObjectId(), userId, userName: 'Complaint 2' },
    ];

    const sortStub = sinon.stub().resolves(complaints);
    const findStub = sinon.stub(Complaint, 'find').returns({ sort: sortStub });

    // Mock request & response
    const req = { user: { id: userId, role: 'user' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await getMyComplaints(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.json.called).to.be.true;
    expect(res.status.called).to.be.false; // success path

    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const sortStub = sinon.stub().rejects(new Error('DB Error'));
    const findStub = sinon.stub(Complaint, 'find').returns({ sort: sortStub });

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId(), role: 'user' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await getMyComplaints(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findStub.restore();
  });

});


describe('DeleteComplaint Function Test', () => {

  it('should delete a complaint successfully', async () => {
    // Mock request data
    const ownerId = new mongoose.Types.ObjectId();
    const req = { params: { id: new mongoose.Types.ObjectId().toString() }, user: { id: ownerId, role: 'staff' } };

    // Mock complaint found in the database
    const complaint = { userId: ownerId, remove: sinon.stub().resolves() };

    // Stub Complaint.findById to return the mock complaint
    const findByIdStub = sinon.stub(Complaint, 'findById').resolves(complaint);

    // Mock response object
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    // Call function
    await deleteComplaint(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(complaint.remove.calledOnce).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if complaint is not found', async () => {
    // Stub Complaint.findById to return null
    const findByIdStub = sinon.stub(Complaint, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() }, user: { id: new mongoose.Types.ObjectId(), role: 'staff' } };

    // Mock response object
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    // Call function
    await deleteComplaint(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Complaint.findById to throw an error
    const findByIdStub = sinon.stub(Complaint, 'findById').rejects(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() }, user: { id: new mongoose.Types.ObjectId(), role: 'staff' } };

    // Mock response object
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    // Call function
    await deleteComplaint(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});
