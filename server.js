const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary in-memory agents
const agents = [];

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Vaani AI backend is running 🚀"
  });
});

// Create Agent
app.post("/api/agents", (req, res) => {
  const {
    name,
    websiteUrl,
    language,
    instructions
  } = req.body;

  if (!name || !websiteUrl) {
    return res.status(400).json({
      success: false,
      message: "Agent name and website URL are required."
    });
  }

  const agent = {
    id: Date.now().toString(),
    name,
    websiteUrl,
    language: language || "Marathi",
    instructions: instructions || "",
    status: "Live",
    chats: 0,
    createdAt: new Date().toISOString()
  };

  agents.push(agent);

  res.status(201).json({
    success: true,
    message: "Agent created successfully.",
    agent
  });
});

// Get Agents
app.get("/api/agents", (req, res) => {
  res.json({
    success: true,
    agents
  });
});

// Get single Agent
app.get("/api/agents/:id", (req, res) => {
  const agent = agents.find(
    (a) => a.id === req.params.id
  );

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: "Agent not found."
    });
  }

  res.json({
    success: true,
    agent
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, agentId } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required."
    });
  }

  const agent = agents.find(
    (a) => a.id === agentId
  );

  if (agent) {
    agent.chats += 1;
  }

  res.json({
    success: true,
    agentId: agentId || null,
    reply: `तुमचा प्रश्न मिळाला: ${message}`
  });
});

// Website crawler
app.post("/api/crawl", async (req, res) => {
  const { websiteUrl } = req.body;

  if (!websiteUrl) {
    return res.status(400).json({
      success: false,
      message: "Website URL is required."
    });
  }

  res.json({
    success: true,
    message: "Website crawler endpoint is ready.",
    websiteUrl
  });
});

// Voice endpoint
app.post("/api/voice", async (req, res) => {
  res.json({
    success: true,
    message:
      "Voice endpoint is ready for Sarvam STT/TTS integration."
  });
});

// Vercel / local server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Vaani AI server running on port ${PORT}`
    );
  });
}

module.exports = app;
