
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';
import cors from 'cors';
import { GameModel } from '@entities';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All messages - "GET /api/game/all"
 ******************************************************************************/
router.get('/:gameid' , async (req: Request, res: Response) => {
    try {
        // Get messages from the database
        const gameData = await GameModel.findById({$gameid}).populate('player', 'name');
        return res.status(OK).json({messages});
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
