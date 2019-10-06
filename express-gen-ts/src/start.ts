import app, { state } from '@server';
import { logger } from '@shared';
import { GameModel } from '@entities';
import { GameBoard } from './model/gameBoard';
import Player from './model/player';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

    // Populate state with the games stored in the database.
async function readGamesDB() {
    logger.info('Reading games collection and importing into state.');
    const gamedocs =  await GameModel.find({}).populate('attacker defender' );
    gamedocs.forEach((gamedoc) => {
        const obj = gamedoc.toObject();
        const player = obj.attacker;
        const p1: Player = new Player(true, false, player.name, false);
        p1.setPlayer(player);

        const opp = obj.defender;
        const p2: Player = new Player(false, false, opp.name, true);
        p2.setPlayer(opp);

        const game = new GameBoard(p1, p2);
        game.setBoard(obj);
        state.games.push(game);
    });
    logger.info('Imported server games.');
}

readGamesDB();
