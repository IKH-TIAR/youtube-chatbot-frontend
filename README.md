# YouTube Video Chatbot — Frontend

Lightweight frontend for a YouTube-video-aware chatbot. This small web app lets a user load a YouTube video, embed it, and ask questions about the video's content via a backend service.

## Features

- Load a YouTube video URL and send it to the backend for processing
- Persist the loaded video between page reloads using `localStorage`
- Embed the YouTube player for quick preview (uses the `v` query parameter from the provided URL)
- Simple chat UI that shows user messages and bot responses
- Communicates with a backend API (endpoints used by `script.js` are documented below)

## Files

- `index.html` — main HTML page and UI layout
- `style.css` — styling for the UI (dark theme)
- `script.js` — frontend logic that talks to the backend, manages UI and persistence

## How it works (front-end behavior)

- User pastes a YouTube link and clicks "Load Video".
- The frontend POSTs to `/api/load_video` with JSON `{ video_link: <url> }`.
- On success the backend returns `{ message, video_id }`. The frontend stores `video_id` in `localStorage` under the key `video_id`.
- The app extracts the `v` query parameter from the YouTube URL and stores it in `localStorage` as `video_embed_id` so the iframe can be re-rendered after reloads.
- When the user asks a question, the frontend POSTs to `/api/query` with JSON `{ query: <user text>, video_id: <video_id> }` and renders the response in the chat window.

## Backend endpoints used

- POST /api/load_video

  - Request body: `{ "video_link": "https://youtube..." }`
  - Response (success): `{ "message": "...", "video_id": "<id>" }`

- POST /api/query
  - Request body: `{ "query": "...", "video_id": "..." }`
  - Response (success): `{ "response": "bot reply text" }`

These are the endpoints expected by the shipped `script.js`. The frontend points to the backend URL via the `backendURL` constant at the top of `script.js`.

## Local development / running

You can run this frontend as a static site. Two quick options:

- Open `index.html` directly in a browser (good for quick local testing), or
- Serve with a simple static server (recommended to avoid some browser restrictions):

  - Python 3 (from this folder):

    ```powershell
    python -m http.server 8000
    ```

  - Then open `http://localhost:8000` in your browser.

Note: The frontend uses a `backendURL` value inside `script.js` — update that to point to your local or deployed backend. If the backend is on a different origin, make sure the backend enables CORS for the frontend origin.

## UI / UX details

- Chat messages are appended to `#chatBox` with classes `user` and `bot`.
- A temporary "Thinking..." bot message is added while waiting for the backend response.
- The embedded player is rendered into `#videoContainer` using an `<iframe>` with the extracted YouTube `v` id.

## Persistent keys

- `video_id` — id returned by the backend (used for queries)
- `video_embed_id` — YouTube `v` param used to build the iframe `src`

## Troubleshooting

- If the page shows "⚠️ Error connecting to backend." ensure `backendURL` in `script.js` is correct and the backend is reachable.
- If requests fail with CORS errors, enable CORS in the backend or serve frontend from same origin.

## Next steps / enhancements

- Add input validation for different YouTube URL shapes (short links, youtu.be, embed links).
- Show a loader/spinner instead of plain text while processing.
- Display error messages returned by the backend to the user.
- Add message timestamps and a clear chat button.
