// ===============================
// VAAANI AI - FRONTEND APP
// ===============================

// Supported languages
const languages = [
  ["🇮🇳", "Marathi", "मराठी"],
  ["🇮🇳", "Hindi", "हिन्दी"],
  ["🇮🇳", "Bengali", "বাংলা"],
  ["🇮🇳", "Gujarati", "ગુજરાતી"],
  ["🇮🇳", "Punjabi", "ਪੰਜਾਬੀ"],
  ["🇮🇳", "Tamil", "தமிழ்"],
  ["🇮🇳", "Telugu", "తెలుగు"],
  ["🇮🇳", "Kannada", "ಕನ್ನಡ"],
  ["🇮🇳", "Malayalam", "മലയാളം"],
  ["🇮🇳", "Odia", "ଓଡ଼ିଆ"],
  ["🇮🇳", "Assamese", "অসমীয়া"],
  ["🇮🇳", "Urdu", "اردو"],
  ["🇮🇳", "Konkani", "कोंकणी"],
  ["🇮🇳", "Maithili", "मैथिली"],
  ["🇮🇳", "Nepali", "नेपाली"],
  ["🇮🇳", "Sindhi", "सिन्धी"],
  ["🇮🇳", "Sanskrit", "संस्कृत"],
  ["🇬🇧", "English", "English"]
];

// ===============================
// HELPERS
// ===============================

const $ = (selector) => document.querySelector(selector);

const pages = [...document.querySelectorAll(".page")];

const title = $("#pageTitle");

// API base URL
// Empty string means same Vercel domain
const API_BASE = "";

// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(name) {
  pages.forEach((page) => {
    page.classList.toggle("hidden", page.id !== name);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === name
    );
  });

  if (title) {
    title.textContent =
      name.charAt(0).toUpperCase() + name.slice(1);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // Load agents whenever Agents page opens
  if (name === "agents") {
    loadAgents();
  }
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.onclick = () => {
    showPage(button.dataset.page);
  };
});

// ===============================
// TOAST
// ===============================

function toast(message) {
  const t = $("#toast");

  if (!t) return;

  t.textContent = message;
  t.classList.remove("hidden");

  setTimeout(() => {
    t.classList.add("hidden");
  }, 3000);
}

// ===============================
// MODAL
// ===============================

const modal = $("#agentModal");

function openModal() {
  if (!modal) return;

  modal.classList.remove("hidden");

  const nameInput = $("#agentName");

  if (nameInput) {
    setTimeout(() => {
      nameInput.focus();
    }, 100);
  }
}

function closeModal() {
  if (!modal) return;

  modal.classList.add("hidden");
}

[
  "createTop",
  "startBuild",
  "newAgent2",
  "newAgent3",
  "newAgent4",
  "newAgent5"
].forEach((id) => {
  const element = $("#" + id);

  if (element) {
    element.onclick = openModal;
  }
});

const closeModalButton = $("#closeModal");
const cancelModalButton = $("#cancelModal");

if (closeModalButton) {
  closeModalButton.onclick = closeModal;
}

if (cancelModalButton) {
  cancelModalButton.onclick = closeModal;
}

// Close modal when clicking outside
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// ===============================
// LANGUAGE SELECT
// ===============================

const langSelect = $("#languageSelect");

if (langSelect) {
  languages.forEach((language, index) => {
    const option = document.createElement("option");

    option.value = language[1];
    option.textContent =
      `${language[0]} ${language[1]} — ${language[2]}`;

    if (index === 0) {
      option.selected = true;
    }

    langSelect.appendChild(option);
  });
}

// ===============================
// LANGUAGE GRID
// ===============================

const languageGrid = $("#languageGrid");

if (languageGrid) {
  languages.forEach((language) => {
    const div = document.createElement("div");

    div.className = "language";

    div.innerHTML = `
      <span class="flag">${language[0]}</span>

      <div>
        <b>${language[1]}</b>
        <small>${language[2]}</small>
      </div>
    `;

    div.onclick = () => {
      toast(`${language[1]} selected`);
    };

    languageGrid.appendChild(div);
  });
}

// ===============================
// CREATE AGENT
// ===============================

const saveAgentButton = $("#saveAgent");

if (saveAgentButton) {
  saveAgentButton.onclick = async () => {

    const name =
      $("#agentName")?.value.trim() || "Untitled Agent";

    const websiteUrl =
      $("#websiteUrl")?.value.trim() || "";

    const language =
      $("#languageSelect")?.value || "Marathi";

    const instructions =
      $("#instructions")?.value.trim() || "";

    // Website URL is required by backend
    if (!websiteUrl) {
      toast("Please enter your website URL.");
      $("#websiteUrl")?.focus();
      return;
    }

    // Basic URL validation
    try {
      new URL(websiteUrl);
    } catch (error) {
      toast("Please enter a valid website URL.");
      $("#websiteUrl")?.focus();
      return;
    }

    // Disable button while request is running
    saveAgentButton.disabled = true;
    saveAgentButton.textContent = "Creating...";

    try {

      const response = await fetch(
        `${API_BASE}/api/agents`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            websiteUrl,
            language,
            instructions
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create agent."
        );
      }

      // Clear form
      if ($("#agentName")) {
        $("#agentName").value = "";
      }

      if ($("#websiteUrl")) {
        $("#websiteUrl").value = "";
      }

      if ($("#instructions")) {
        $("#instructions").value = "";
      }

      closeModal();

      showPage("agents");

      toast(
        `✅ ${name} created successfully!`
      );

      // Refresh agent list
      await loadAgents();

    } catch (error) {

      console.error("Create Agent Error:", error);

      toast(
        `❌ ${error.message || "Unable to create agent."}`
      );

    } finally {

      saveAgentButton.disabled = false;
      saveAgentButton.textContent = "Create agent";
    }
  };
}

// ===============================
// LOAD AGENTS
// ===============================

async function loadAgents() {

  const agentsPage = $("#agents");

  if (!agentsPage) return;

  try {

    const response = await fetch(
      `${API_BASE}/api/agents`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load agents."
      );
    }

    renderAgents(data.agents || []);

  } catch (error) {

    console.error("Load Agents Error:", error);

    renderAgents([]);

    toast(
      "Unable to load agents from server."
    );
  }
}

// ===============================
// RENDER AGENTS
// ===============================

function renderAgents(agents) {

  const agentsPage = $("#agents");

  if (!agentsPage) return;

  const existingPanel =
    agentsPage.querySelector(".agent-list-panel");

  if (existingPanel) {
    existingPanel.remove();
  }

  // If no agents
  if (!agents.length) {
    return;
  }

  const panel = document.createElement("div");

  panel.className = "panel agent-list-panel";

  panel.innerHTML = `
    <h3>Your created agents</h3>
    <p>Agents created from this dashboard.</p>
  `;

  agents.forEach((agent) => {

    const row = document.createElement("div");

    row.className = "source-row";

    row.innerHTML = `
      <div class="source-icon">🎙️</div>

      <div style="flex:1">
        <b>${escapeHtml(agent.name)}</b>

        <p>
          ${escapeHtml(agent.language || "Marathi")}
          · ${escapeHtml(agent.websiteUrl || "No website")}
        </p>
      </div>

      <span class="indexed">
        Ready
      </span>
    `;

    panel.appendChild(row);
  });

  agentsPage.appendChild(panel);
}

// ===============================
// WEBSITE CRAWLER
// ===============================

const crawlButton = $("#crawlBtn");

if (crawlButton) {

  crawlButton.onclick = async () => {

    const websiteUrl = prompt(
      "Website URL (e.g. https://example.com)"
    );

    if (!websiteUrl) {
      return;
    }

    try {

      new URL(websiteUrl);

    } catch (error) {

      toast("Please enter a valid website URL.");

      return;
    }

    crawlButton.disabled = true;
    crawlButton.textContent = "Crawling...";

    try {

      const response = await fetch(
        `${API_BASE}/api/crawl`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            websiteUrl
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Crawler request failed."
        );
      }

      toast(
        `🌐 Website added: ${websiteUrl}`
      );

    } catch (error) {

      console.error("Crawler Error:", error);

      toast(
        `❌ ${error.message || "Crawler failed."}`
      );

    } finally {

      crawlButton.disabled = false;
      crawlButton.textContent = "Add website";
    }
  };
}

// ===============================
// KNOWLEDGE BUTTON
// ===============================

const addKnowledgeButton = $("#addKnowledge");

if (addKnowledgeButton) {
  addKnowledgeButton.onclick = () => {
    showPage("knowledge");
  };
}

// ===============================
// VOICE DEMO
// ===============================

const demoButton = $("#demoBtn");

if (demoButton) {

  demoButton.onclick = () => {

    if (!("speechSynthesis" in window)) {

      toast(
        "Your browser does not support voice demo."
      );

      return;
    }

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        "नमस्कार! मी Vaani AI आहे. तुमच्या website मधील माहितीवरून मी तुमच्या निवडलेल्या भाषेत उत्तर देऊ शकतो."
      );

    utterance.lang = "mr-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      toast("🎙️ Voice demo started");
    };

    utterance.onend = () => {
      toast("Voice demo finished");
    };

    utterance.onerror = () => {
      toast("Voice demo could not start.");
    };

    speechSynthesis.speak(utterance);
  };
}

// ===============================
// HTML ESCAPE
// ===============================

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===============================
// BACKEND HEALTH CHECK
// ===============================

async function checkBackend() {

  try {

    const response = await fetch(
      `${API_BASE}/api/health`
    );

    const data = await response.json();

    if (data.success) {

      console.log(
        "✅ Vaaani AI backend connected."
      );

    } else {

      console.warn(
        "⚠️ Backend responded but health check failed."
      );
    }

  } catch (error) {

    console.warn(
      "⚠️ Backend is not reachable:",
      error
    );
  }
}

// ===============================
// INITIALIZE APP
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "🚀 Vaaani AI frontend loaded."
    );

    checkBackend();

    showPage("overview");
  }
);
