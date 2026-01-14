/******* Hide adds which do not contain "React.js", "React", "javascript"] ******/

// (function () {
//   const keywords = ["React.js", "React", "javascript"];
//   const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
//   const AD_CARD_SELECTOR = '[class*="card-grid"]';

//   // 1. Function to save applied job ID
//   function markAsApplied(jobId) {
//     chrome.storage.local.get({ appliedJobs: [] }, (result) => {
//       const appliedJobs = result.appliedJobs;
//       if (!appliedJobs.includes(jobId)) {
//         appliedJobs.push(jobId);
//         chrome.storage.local.set({ appliedJobs: appliedJobs }, () => {
//           console.log("Job marked as applied:", jobId);
//           filterJobs(); // Re-run filter to update UI
//         });
//       }
//     });
//   }

//   // 2. Main Filtering and Labeling Function
//   function filterJobs() {
//     chrome.storage.local.get({ appliedJobs: [] }, (result) => {
//       const appliedJobs = result.appliedJobs;
//       const cards = document.querySelectorAll(AD_CARD_SELECTOR);

//       cards.forEach((card) => {
//         // Try to find a unique ID (based on the link or data attributes)
//         const linkElement = card.querySelector('a[href*="job-details"]');
//         const jobId = linkElement ? linkElement.href.split("/").pop() : null;

//         const text = card.innerText || "";
//         const hasKeyword = regex.test(text);
//         regex.lastIndex = 0;

//         // Logic for visibility
//         if (!hasKeyword) {
//           card.style.display = "none";
//           card.dataset.filtered = "hidden";
//           return;
//         }

//         card.style.display = "";
//         card.classList.add("job-approved");

//         // Logic for "Already Applied"
//         if (jobId && appliedJobs.includes(jobId)) {
//           card.classList.add("job-applied");
//         }

//         // Attach click listeners to buttons if not already done
//         const buttons = card.querySelectorAll(
//           ".btn-apply-now, .btn-square-icon"
//         );
//         buttons.forEach((btn) => {
//           if (!btn.dataset.listenerAttached) {
//             btn.addEventListener("click", () => {
//               if (jobId) markAsApplied(jobId);
//             });
//             btn.dataset.listenerAttached = "true";
//           }
//         });
//       });
//     });
//   }

//   // 3. Create Banner (same as before)
//   function createBanner() {
//     if (document.querySelector(".my-extension-banner")) return;
//     const messageDiv = document.createElement("div");
//     messageDiv.className = "my-extension-banner";
//     messageDiv.innerHTML = `
//             <div>
//       🟢 התוסף שלי לסינון המשרות פעיל.
//       <hr>
//     בתפריט משמאל בחר :
//       <br><br>
//        1️⃣ Software
//        <br><br>
//       2️⃣ Frontend
//       <br><br>

//        3️⃣ Full Stack
//        <br><br>
//        4️⃣ Game
//        <br><br>

//         <hr>
//        ב Experience בחר :
//        <br>
//        0 - 3
//     </div>
//   `;
//     const closeBtn = document.createElement("button");
//     closeBtn.textContent = "×";
//     closeBtn.className = "my-extension-close";
//     closeBtn.onclick = () => messageDiv.remove();
//     messageDiv.appendChild(closeBtn);
//     document.body.appendChild(messageDiv);
//   }

//   // 4. Initialization
//   setInterval(filterJobs, 1000);
//   window.addEventListener("load", createBanner);
//   createBanner();
// })();

/******* Only highlight ads I have applied to *******/

(function () {
  const AD_CARD_SELECTOR = '[class*="card-grid"]';

  // 1. Save job ID to Chrome's local storage
  function markAsApplied(jobId) {
    chrome.storage.local.get({ appliedJobs: [] }, (result) => {
      const appliedJobs = result.appliedJobs;
      if (!appliedJobs.includes(jobId)) {
        appliedJobs.push(jobId);
        chrome.storage.local.set({ appliedJobs: appliedJobs }, () => {
          console.log("Tracker: Job saved as applied:", jobId);
          updateUI(); // Update display immediately
        });
      }
    });
  }

  // 2. Scan the page and update the UI based on storage
  function updateUI() {
    chrome.storage.local.get({ appliedJobs: [] }, (result) => {
      const appliedJobs = result.appliedJobs;
      const cards = document.querySelectorAll(AD_CARD_SELECTOR);

      cards.forEach((card) => {
        // Extract unique Job ID from the link
        const linkElement = card.querySelector('a[href*="job-details"]');
        if (!linkElement) return;

        const jobId = linkElement.href.split("/").pop();

        // Check if already applied
        if (jobId && appliedJobs.includes(jobId)) {
          card.classList.add("job-applied");
        }

        // Attach click listeners to all action buttons in the card
        const actionButtons = card.querySelectorAll("a, button");
        actionButtons.forEach((btn) => {
          if (!btn.dataset.listenerAttached) {
            btn.addEventListener("click", () => markAsApplied(jobId));
            btn.dataset.listenerAttached = "true";
          }
        });
      });
    });
  }

  // 3. Simple Banner to show status
  function createBanner() {
    if (document.querySelector(".my-extension-banner")) return;
    const banner = document.createElement("div");
    banner.className = "my-extension-banner";
    banner.innerHTML = `<b>📍 מעקב הגשות פעיל</b><br><small>משרות שהוקלקו יסומנו בגרייסקייל.</small>`;
    document.body.appendChild(banner);
  }

  // Run interval to catch dynamically loaded jobs
  setInterval(updateUI, 1000);
  window.addEventListener("load", createBanner);
  createBanner();
})();
