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

const $ = (selector) =>
  document.querySelector(selector);

const pages = [
  ...document.querySelectorAll(".page")
];

const title = $("#pageTitle");

const API = "/api";

// -------------------------
// PAGE NAVIGATION
// -------------------------

function showPage(name) {
  pages.forEach((page) => {
    page.classList.toggle(
      "hidden",
      page.id !== name
    );
  });

  document
    .querySelectorAll(".nav-item")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.page === name
      );
    });

  title.textContent =
    name.charAt(0).toUpperCase() +
    name.slice(1);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (name === "agents") {
    loadAgents();
  }
}

// Navigation buttons
document
  .querySelectorAll(".nav-item")
  .forEach((button) => {
    button.onclick = () =>
      showPage(button.dataset.page);
  });

// -------------------------
// MODAL
// -------------------------

const modal = $("#agentModal");

function openModal() {
  modal.classList.remove("hidden");

  $("#agentName").focus();
}

function closeModal() {
  modal.classList.add("hidden");
}

// Create agent buttons
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

$("#closeModal").onclick = closeModal;
$("#cancelModal").onclick = closeModal;

// -------------------------
// LANGUAGES
// -------------------------

const langSelect =
  $("#languageSelect");

languages.forEach((language, index) => {
  const option =
    document.createElement("option");

  option.value = language[1];

  option.textContent =
    `${language[0]} ${language[1]} — ${language[2]}`;

  if (index === 0) {
    option.selected = true;
  }

  langSelect.appendChild(option);
});

// Voice language cards
const languageGrid =
  $("#languageGrid");

languages.forEach((language) => {
  const div =
    document.createElement("div");

  div.className = "language";

  div.innerHTML = `
    <span class="flag">
      ${language[0]}
    </span>

    <div>
      <b>${language[1]}</b>
      <small>${language[2]}</small>
    </div>
  `;

  div.onclick = () => {
    toast(
      `${language[1]} selected`
    );
  };

  languageGrid.appendChild(div);
});

// -------------------------
// TOAST
// -------------------------

function toast(message) {
  const element = $("#toast");

  element.textContent = message;

  element.classList.remove("hidden");

  setTimeout(() => {
    element.classList.add("hidden");
  }, 2600);
}

// -------------------------
// CREATE AGENT
// -------------------------

$("#saveAgent").onclick =
  async function () {

    const name =
      $("#agentName").value.trim();

    const websiteUrl =
      $("#websiteUrl").value.trim();

    const language =
      $("#languageSelect").value;

    const instructions =
      $("#instructions").value.trim();

    if (!name) {
      toast("Please enter agent name.");
      return;
    }

    if (!websiteUrl) {
      toast("Please enter website URL.");
      return;
    }

    try {

      const response =
        await fetch(
          `${API}/agents`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name,
              websiteUrl,
              language,
              instructions
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create agent."
        );
      }

      closeModal();

      // Clear form
      $("#agentName").value = "";
      $("#websiteUrl").value = "";
      $("#instructions").value = "";

      showPage("agents");

      toast(
        `${name} created successfully! 🚀`
      );

      loadAgents();

    } catch (error) {

      console.error(error);

      toast(
        "Agent create failed. Backend check करा."
      );
    }
  };

// -------------------------
// LOAD AGENTS
// -------------------------

async function loadAgents() {

  try {

    const response =
      await fetch(
        `${API}/agents`
      );

    const data =
      await response.json();

    if (!data.success) {
      return;
    }

    renderAgents(data.agents);

  } catch (error) {

    console.error(
      "Load agents error:",
      error
    );
  }
}

// -------------------------
// DISPLAY AGENTS
// -------------------------

function renderAgents(agents) {

  const panel =
    document.querySelector(
      "#agents .panel"
    );

  if (!panel) return;

  if (!agents.length) {

    panel.innerHTML = `
      <div class="empty-icon">◉</div>

      <h3>
        Build your first multilingual agent
      </h3>

      <p>
        Choose a voice, connect knowledge,
        and publish it to your website.
      </p>

      <button
        class="primary"
        id="dynamicCreateAgent"
      >
        Create agent
      </button>
    `;

    $("#dynamicCreateAgent").onclick =
      openModal;

    return;
  }

  panel.innerHTML = `
    <div class="agent-list">
      ${agents
        .map(
          (agent) => `
            <div class="agent-card">

              <div class="agent-icon">
                🎧
              </div>

              <div class="card-top">
                <span class="status">
                  ● ${agent.status}
                </span>

                <span>⋯</span>
              </div>

              <h3>
                ${escapeHtml(agent.name)}
              </h3>

              <p>
                ${escapeHtml(
                  agent.instructions ||
                  "AI voice agent"
                )}
              </p>

              <div class="card-foot">
                <span>
                  🇮🇳 ${escapeHtml(
                    agent.language
                  )}
                </span>

                <span>
                  ${agent.chats} chats
                </span>
              </div>

            </div>
          `
        )
        .join("")}
    </div>
  `;
}

// -------------------------
// SECURITY
// -------------------------

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// -------------------------
// KNOWLEDGE / CRAWLER
// -------------------------

$("#crawlBtn").onclick =
  async function () {

    const url =
      prompt(
        "Website URL (e.g. https://example.com)"
      );

    if (!url) return;

    try {

      const response =
        await fetch(
          `${API}/crawl`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              websiteUrl: url
            })
          }
        );

      const data =
        await response.json();

      if (data.success) {

        toast(
          `Website queued: ${url}`
        );

      } else {

        toast(
          data.message ||
          "Crawler failed."
        );
      }

    } catch (error) {

      console.error(error);

      toast(
        "Crawler connection failed."
      );
    }
  };

// Knowledge button
$("#addKnowledge").onclick =
  () => showPage("knowledge");

// -------------------------
// VOICE DEMO
// -------------------------

$("#demoBtn").onclick =
  function () {

    if (
      !(
        "speechSynthesis"
        in window
      )
    ) {

      toast(
        "Your browser does not support voice demo."
      );

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        "नमस्कार! मी Vaani AI आहे. तुमच्या website मधील माहितीवरून मी तुमच्या निवडलेल्या भाषेत उत्तर देऊ शकतो."
      );

    utterance.lang = "mr-IN";
    utterance.rate = 0.95;

    speechSynthesis.speak(
      utterance
    );

    toast(
      "Voice demo started 🎙️"
    );
  };

// -------------------------
// INITIAL LOAD
// -------------------------

loadAgents();
