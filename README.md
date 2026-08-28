# Vaani AI — Indian Voice Agent UI

This is a polished frontend prototype for an ElevenLabs-style Indian multilingual voice-agent platform.

## Included
- Agent dashboard
- Agent creation modal
- Website knowledge-base flow
- 18-language selector
- Conversations and analytics screens
- Browser voice demo using Web Speech API
- Responsive layout

## Important
This is a frontend MVP/prototype. The actual AI pipeline still needs a backend:
Website crawler -> document extraction -> embeddings/vector DB -> RAG -> LLM -> STT/TTS -> WebSocket/WebRTC.

Suggested production stack:
- Next.js / React
- Node.js or FastAPI backend
- PostgreSQL + pgvector
- Redis for realtime/session state
- STT/TTS provider with Indian-language coverage
- LLM API
- WebSocket/WebRTC for low-latency voice

Open `index.html` in a browser to preview the UI.
