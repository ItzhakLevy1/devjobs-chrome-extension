(function () {
  // 1. Configuration: Keywords and Selectors
  const keywords = ["React.js", "React", "javascript"];
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const AD_CARD_SELECTOR = '[class*="card-grid"]';

  // 2. Function to filter job cards
  function filterJobs() {
    const cards = document.querySelectorAll(AD_CARD_SELECTOR);

    cards.forEach((card) => {
      if (card.dataset.filtered === "hidden") return;

      const text = card.innerText || "";
      const hasKeyword = regex.test(text);
      regex.lastIndex = 0;

      if (hasKeyword) {
        card.style.display = "";
        card.dataset.filtered = "visible";
        card.classList.add("job-approved"); // Use CSS class
      } else {
        card.style.display = "none";
        card.dataset.filtered = "hidden";
      }
    });
  }

  // 3. Create and Display the Information Banner
  function createBanner() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "my-extension-banner"; // Applied CSS class

    const messageHTML = `
            <div class="my-extension-banner-content">
                <b style="font-size: 16px;">🟢 Job Filter Active</b>
                <hr style="margin: 10px 0;">
                Follow these steps in the sidebar:
                <br><br>
                1️⃣ Select <b>'Software Development'</b>
                <hr style="margin: 10px 0;">
                2️⃣ Select Roles:
                <br>• Frontend Developer
                <br>• Fullstack Developer
                <br>• React Developer
                <hr style="margin: 10px 0;">
                3️⃣ Select Regions:
                <br>• Tel Aviv & Center
                <br>• Sharon / Shephelah
                <hr style="margin: 10px 0;">
                ✅ Click <b>'Search'</b> to apply.
            </div>
        `;

    const textContainer = document.createElement("div");
    textContainer.innerHTML = messageHTML;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.className = "my-extension-close"; // Applied CSS class

    closeBtn.addEventListener("click", () => messageDiv.remove());

    messageDiv.appendChild(textContainer);
    messageDiv.appendChild(closeBtn);
    document.body.appendChild(messageDiv);
  }

  // 4. Execution Logic
  setInterval(filterJobs, 500);

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    createBanner();
  } else {
    window.addEventListener("DOMContentLoaded", createBanner);
  }

  console.log("Job Filter Extension: Initialized.");
})();
