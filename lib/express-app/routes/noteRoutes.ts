import express from 'express';
import {
  createNoteController,
  getNoteMetaController,
  getNoteDataController,
} from '../controllers';

const router = express.Router();

// prettier-ignore
router
    .route('/')
    .post(createNoteController)

// prettier-ignore
router
    .route('/:note')
    .get(getNoteMetaController)
    .delete(getNoteDataController)

// prettier-ignore
// router
//     .route('/:note/data')
//     .get(getNoteDataController);

// // Middleware to validate the note parameter
// router.param('note', (_req, _res, next, note: string) => {
//     // req.report = Notes[note];
//     console.debug('run note middleware here', note)
//     next()
// })

export default router;
