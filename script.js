const backendURL = "https://youtube-chatbot-backend-p9wd.onrender.com";

let currentVideoId = localStorage.getItem("video_id") || null;
const loadStatus = document.getElementById("loadStatus");
const videoContainer = document.getElementById("videoContainer");
const chatSection = document.querySelector(".chat-section");
const chatBox = document.getElementById("chatBox");

// If video already loaded previously, show chat
if (currentVideoId) {
  chatSection.style.display = "block";
  // optionally re-embed video if you stored its id
  const savedVideoId = localStorage.getItem("video_embed_id");
  if (savedVideoId) {
    videoContainer.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${savedVideoId}" frameborder="0" allowfullscreen></iframe>`;
  }
}

// 🎥 Step 1: Load and process the video
document.getElementById("loadBtn").addEventListener("click", async (e) => {
  // e.preventDefault(); // not needed if button type="button"
  const url = document.getElementById("youtubeUrl").value.trim();

  if (!url) {
    loadStatus.textContent = "❌ Please enter a YouTube link.";
    return;
  }

  loadStatus.textContent = "⏳ Processing video... please wait.";

  try {
    const res = await fetch(`${backendURL}/api/load_video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_link: url })
    });

    const data = await res.json();

    if (res.ok) {
      loadStatus.textContent = data.message;
      currentVideoId = data.video_id;

      // Persist video_id so page reload won't lose it
      localStorage.setItem("video_id", currentVideoId);

      // Also store the YouTube embed id for re-embedding
      const videoId = new URL(url).searchParams.get("v");
      if (videoId) localStorage.setItem("video_embed_id", videoId);

      // Show embedded video and chat
      videoContainer.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      chatSection.style.display = "block";
    } else {
      loadStatus.textContent = "❌ Failed to load video.";
    }
  } catch (err) {
    console.error(err);
    loadStatus.textContent = "⚠️ Error connecting to backend.";
  }
});

// 💬 Step 2: Handle user chat
document.getElementById("sendBtn").addEventListener("click", async (e) => {
  // e.preventDefault(); // not needed for type="button"
  const queryInput = document.getElementById("userInput");
  const query = queryInput.value.trim();

  if (!query || !currentVideoId) {
    if (!currentVideoId) alert("Please load a video first.");
    return;
  }

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = query;
  chatBox.appendChild(userMsg);

  // Clear input
  queryInput.value = "";

  // Add bot thinking message
  const botMsg = document.createElement("div");
  botMsg.className = "message bot";
  botMsg.textContent = "Thinking...";
  chatBox.appendChild(botMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Send to backend
  try {
    const res = await fetch(`${backendURL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query, video_id: currentVideoId })
    });

    const data = await res.json();
    botMsg.textContent = data.response || "⚠️ No response received.";
  } catch (err) {
    console.error(err);
    botMsg.textContent = "⚠️ Backend error.";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});
