# ATTACK-Cards
The successor to MITRE cards. As a client, the game is just as terrible however it features an API, Websocket based communications to an express server, MongoDB for storage, and a chatbot - it all persists!

If the application isn't on heroku yet and needs to be run locally, from express-gen-ts (runs on port 3000): 
```
npm run start-dev
```
from mitre-card-client (runs on port 8080)
```
npm run serve
```
The video in assessory demonstrates XMLHTTPRequests to a REST API running on the express server (default to port 3000) to create users, messages, fetch games, update players, etc.  Websockets are used for realtime communications in the chat, gameboard updates, and player hand updates. Statistics are drawn using Plotly, built on top of D3.js. The demo video does not demonstrate persistent games, the author would like to clarify that this IS a feature. If a user revisits a route with an already established game, ie mitreecards/games/abcdef1235xyz789 - they will visit the game with its current progress, as retrieved from the MongoDB.
