import express from 'express';
import { createNoteController, getNoteController } from '../controllers';

const router = express.Router();

// prettier-ignore
router
    .route('/')
    .post(createNoteController)

// prettier-ignore
router
    .route('/:note')
    .get(getNoteController)
//     .delete(delete); // Delete a report

// // Middleware to validate the note parameter
// router.param('note', (_req, _res, next, note: string) => {
//     // req.report = Notes[note];
//     console.debug('run note middleware here', note)
//     next()
// })

export default router;
