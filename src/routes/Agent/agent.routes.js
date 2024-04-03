// routes/Agent/agent.routes.js
import express from "express";
import { getAgentById, createAgent, deleteAgentById, updateAgentById } from "../../controllers/Agent/agent.controllers.js";

const router = express.Router();

// GET - Retrieve agent by ID
// DELETE - Delete agent by ID
// PUT - Update agent by ID
// POST - Create a new agent
router.route("/updateAgent/:agentId").delete(deleteAgentById).put(updateAgentById);
router.route("/agentDetails").get(getAgentById)
router.route("/createAgent").post(createAgent);

export default router;
