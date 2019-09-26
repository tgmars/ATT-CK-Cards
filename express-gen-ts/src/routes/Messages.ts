
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';
import cors from 'cors';
import { MessageModel } from '@entities';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All messages - "GET /api/messages/all"
 ******************************************************************************/
router.get('/all', async (req: Request, res: Response) => {
    try {
        // Get messages from the database
        const messages = await MessageModel.find({});
        return res.status(OK).json({messages});
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                       Add One - "POST /api/messages/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    try {
        // Create a messagemodel based on the request body content.
        const message = new MessageModel(req.body);
        // Error handling for an empty request
        if (!message) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        // Save the data into the model and send it to the database.
        await message.save();
        res.send(message);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                       Update - "PUT /api/messages/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        user.id = Number(user.id);
        // await userDao.update(user);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                    Delete - "DELETE /api/messages/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params as ParamsDictionary;
        // await userDao.delete(Number(id));
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
