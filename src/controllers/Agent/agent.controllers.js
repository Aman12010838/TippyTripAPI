import { Agent } from "../../models/Agent/agent.model.js";

export const getAgentById = async (req, res) => {
    const agentId = req.body.agentId;

    try {
        // Find the agent by agentId
        const agent = await Agent.findById(agentId);

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" });
        }

        res.json({
            message: "Agent retrieved successfully",
            agent: agent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error hlooo" });
    }
};

// POST - Create a new agent
export const createAgent = async (req, res) => {
    const { email, fullName, city, phone } = req.body;

    try {
        // Check if an agent with the same email or phone already exists
        const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });

        if (existingAgent) {
            return res.status(400).json({ error: "Agent with the same email or phone already exists" });
        }

        // Create a new agent if not exists
        const newAgent = new Agent({ email, fullName, city, phone });
        const savedAgent = await newAgent.save();

        res.status(201).json({
            message: "Agent created successfully",
            agent: savedAgent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// DELETE - Delete an agent by ID
export const deleteAgentById = async (req, res) => {
    const agentId = req.params.agentId;

    try {
        // Find and delete the agent by agentId
        const deletedAgent = await Agent.findByIdAndDelete(agentId);

        if (!deletedAgent) {
            return res.status(404).json({ error: "Agent not found" });
        }

        res.json({
            message: "Agent deleted successfully",
            agent: deletedAgent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE - Update an agent by ID
export const updateAgentById = async (req, res) => {
    const agentId = req.params.agentId;
    const updateData = req.body;

    try {
        // Find and update the agent by agentId
        const updatedAgent = await Agent.findByIdAndUpdate(agentId, updateData, { new: true });

        if (!updatedAgent) {
            return res.status(404).json({ error: "Agent not found" });
        }

        res.json({
            message: "Agent updated successfully",
            agent: updatedAgent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};