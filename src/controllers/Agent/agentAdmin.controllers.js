import express from 'express';
import jwt from 'jsonwebtoken';
import { agentAdmin } from '../models/Agent/agent.model.js';

const router = express.Router();

// POST: Create a new agent
router.post('/agents', async (req, res) => {
  try {
    const { email, fullName, city, phone } = req.body;

    // Check if an agent with the same email or phone already exists
    const existingAgent = await agentAdmin.findOne({ $or: [{ email }, { phone }] });

    if (existingAgent) {
      return res.status(400).json({ error: 'Agent with the same email or phone already exists' });
    }

    // Create a new agent if not exists
    const newAgent = new agentAdmin({ email, fullName, city, phone });
    const savedAgent = await newAgent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: savedAgent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Get all agents
router.get('/agents', async (req, res) => {
  try {
    const agents = await agentAdmin.find();
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Get agent by ID
router.get('/agents/:agentId', async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const agent = await agentAdmin.findById(agentId);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: Update agent by ID
router.put('/agents/:agentId', async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const updatedAgent = await agentAdmin.findByIdAndUpdate(agentId, req.body, { new: true });

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent updated successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Delete agent by ID
router.delete('/agents/:agentId', async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const deletedAgent = await agentAdmin.findByIdAndRemove(agentId);

    if (!deletedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent deleted successfully',
      agent: deletedAgent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
