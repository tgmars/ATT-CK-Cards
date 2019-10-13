# ATTACK-Cards
The successor to MITRE cards. Features an API, Websocket based communications to an express server, MongoDB for storage, and a chatbot - it all persists!

If the application isn't on heroku yet and needs to be run locally, from express-gen-ts (runs on port 3000): 
```
npm run start-dev
```
from mitre-card-client (runs on port 8080)
```
npm run serve
```
The video in assessory demonstrates XMLHTTPRequests to a REST API running on the express server (default to port 3000) to create users, messages, fetch games, update players, etc.  Websockets are used for realtime communications in the chat, gameboard updates, and player hand updates. Statistics are drawn using Plotly, built on top of D3.js. The demo video does not demonstrate persistent games, the author would like to clarify that this IS a feature. If a user revisits a route with an already established game, ie mitreecards/games/abcdef1235xyz789 - they will visit the game with its current progress, as retrieved from the MongoDB.

Game concept is as follows:
• Turn based card game
• Asymmetric (Attacker vs Defender)
• Scoring based off lifepoints (like hearthstone!?, represents cost to attackers vs cost to defenders)
• Attackers:
	○ Deploy attack cards against defender
	○ As turns go on, the attackers get access to cards further to the right in the ATT&CK matrix
	○ Win condition: Successfully deploy an exfiltration technique card, attacker unlocks different attack cards
	○ A attacker has no knowledge of defender cards until an attack is detected by a defenders card. 
• Defenders:
	○ Get detection and defence cards
	○ Defence cards (represent infrastructure) take time to build (1-3 turns approx) - mitigate the use of attack cards
	○ Detection cards - played face down to the attacker, revealed and nullify a an attack when a detection card for an attack is used. 

Storage - 
State of all games being played
Include a unique URL for games, that is then unique again for each player
Ie yourgame.com/game-uuid-123abc-player-uuid-name-player1


Data transfer-
Game board state in JSON

Only server has knowledge of both players & maintains a joined game board of each player
	
Server passes attacker gamestate to attacker player and defender gamestate to the defender.

Both gamestates have the same structure, just different hands and decks to draw from.
A attacker has no knowledge of defender cards until an attack is detected by a defenders card. 

Shared data includes opponent and player progress to victory.
