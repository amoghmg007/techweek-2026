(() => {
  const events = [
    {
      name: "24-Hour Hackathon",
      day: "December 7",
      description: "Build a prototype in a 24-hour hackathon.",
      team: "Team of 4",
      fee: "INR 1,200 per team",
      prize: "INR 60,000 prize pool; 3 winning teams."
    },
    {
      name: "Cyber War",
      day: "December 8",
      description: "Cryptography, vulnerability analysis, and forensics.",
      team: "Individual",
      fee: "INR 249 per participant",
      prize: "INR 15,000 prize pool; 2 winners."
    },
    {
      name: "Robot Wars",
      day: "December 9",
      description: "Design, build, and battle in mechanical combat.",
      team: "Team of 2-4",
      fee: "INR 399 per team",
      prize: "INR 15,000 prize pool; 1 winning team."
    },
    {
      name: "The Black Box",
      day: "December 10",
      description: "Observe system behaviour, test hypotheses, and uncover hidden logic.",
      team: "Team of 2-3",
      fee: "INR 299 per team",
      prize: "INR 5,000 prize pool; 1 winning team."
    },
    {
      name: "Agent Arena",
      day: "December 11",
      description: "Build an autonomous AI agent for a strategic simulation.",
      team: "Team of 1-3",
      fee: "INR 299 per team",
      prize: "INR 5,000 prize pool; 1 winning team."
    },
    {
      name: "Mystery Protocol",
      day: "December 7-11",
      description: "The campus is the puzzle. Discover checkpoints and decode clues.",
      team: "Individual",
      fee: "INR 149 per participant",
      prize: "INR 5,000 prize; 1 winner."
    }
  ];

  const root = document.createElement("aside");
  root.id = "techweek-chatbot";
  root.innerHTML = `
    <section class="tw-chat-panel" id="tw-chat-panel" aria-label="Tech Week chatbot" hidden>
      <header class="tw-chat-header">
        <span class="tw-chat-avatar" aria-hidden="true"></span>
        <div class="tw-chat-heading">
          <strong>Tech Week Guide</strong>
          <span>Ask about events, dates, fees, and prizes</span>
        </div>
        <button class="tw-chat-close" type="button" aria-label="Close chat">&times;</button>
      </header>
      <div class="tw-chat-messages" id="tw-chat-messages" aria-live="polite" aria-relevant="additions"></div>
      <div class="tw-chat-prompts" aria-label="Suggested questions">
        <button type="button" data-question="What events are there?">Events</button>
        <button type="button" data-question="Tell me about the schedule">Schedule</button>
        <button type="button" data-question="How do I register?">Registration</button>
      </div>
      <form class="tw-chat-form">
        <input class="tw-chat-input" type="text" maxlength="300" placeholder="Ask about Tech Week..." aria-label="Your question" autocomplete="off">
        <button class="tw-chat-send" type="submit">Send</button>
      </form>
    </section>
    <button class="tw-chat-launcher" type="button" aria-controls="tw-chat-panel" aria-expanded="false">
      <span class="tw-chat-avatar" aria-hidden="true"></span>
      <span class="tw-chat-launcher-label">Ask Tech Week</span>
    </button>`;

  document.body.append(root);

  const panel = root.querySelector("#tw-chat-panel");
  const launcher = root.querySelector(".tw-chat-launcher");
  const closeButton = root.querySelector(".tw-chat-close");
  const messages = root.querySelector("#tw-chat-messages");
  const form = root.querySelector(".tw-chat-form");
  const input = root.querySelector(".tw-chat-input");

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `tw-chat-message tw-chat-message-${sender}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function answerFor(question) {
    const query = question.toLowerCase().replace(/[^\w\s-]/g, " ");
    const matchedEvent = events.find(event =>
      query.includes(event.name.toLowerCase()) ||
      (event.name === "24-Hour Hackathon" && query.includes("hackathon")) ||
      (event.name === "The Black Box" && query.includes("black box")) ||
      (event.name === "Mystery Protocol" && query.includes("mystery"))
    );

    if (matchedEvent) {
      return `${matchedEvent.name} - ${matchedEvent.day}, 2026\n${matchedEvent.description}\n${matchedEvent.team} | ${matchedEvent.fee}\n${matchedEvent.prize}`;
    }
    if (/schedule|timeline|when|date|day|week/.test(query)) {
      return `Tech Week runs December 7-11, 2026, at Brindavan College of Engineering, Bengaluru.\n${events.map(event => `${event.day}: ${event.name}`).join("\n")}`;
    }
    if (/where|venue|location|campus|brindavan|bengaluru|bangalore/.test(query)) {
      return "Tech Week 2026 takes place at Brindavan College of Engineering in Bengaluru.";
    }
    if (/prize|pool|award|winner|winning/.test(query)) {
      return `The website lists an overall prize pool of INR 1,05,000.\n${events.map(event => `${event.name}: ${event.prize}`).join("\n")}`;
    }
    if (/fee|cost|price|entry|registration fee/.test(query)) {
      return events.map(event => `${event.name}: ${event.fee}`).join("\n");
    }
    if (/team|individual|participant|member/.test(query)) {
      return events.map(event => `${event.name}: ${event.team}`).join("\n");
    }
    if (/event|competition|activity|what can i|list/.test(query)) {
      return `There are six experiences:\n${events.map(event => `${event.day}: ${event.name} - ${event.description}`).join("\n")}`;
    }
    if (/register|sign.?up|join|registration/.test(query)) {
      return "The site has a Register section, but its registration link and instructions are not listed in the information I have. Please check the event organizers' official announcement for the current registration details.";
    }
    if (/hello|hi\b|hey\b|help|what can you/.test(query)) {
      return "I can help with Tech Week dates, venue, events, team sizes, entry fees, and prizes. Ask about a specific event or try “What events are there?”";
    }
    return "I don't have that detail in the Tech Week information currently available. Share the event document and I can add its official details to my answers.";
  }

  function submitQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed) return;
    addMessage(trimmed, "user");
    addMessage(answerFor(trimmed), "bot");
  }

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
    else launcher.focus();
  }

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  root.querySelectorAll("[data-question]").forEach(button => {
    button.addEventListener("click", () => submitQuestion(button.dataset.question));
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    submitQuestion(input.value);
    input.value = "";
    input.focus();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });

  addMessage("Hi! I'm the Tech Week Guide. Ask me about events, dates, venue, team sizes, fees, or prizes.", "bot");
})();
