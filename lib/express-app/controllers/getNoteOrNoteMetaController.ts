import { Request, Response } from 'express';
import { deleteNoteService, getNoteMetaService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { NoteMetaSchema, NoteSchema } from '../models/noteModel';
import { z } from 'zod';

export const getNoteOrNoteMetaController = async (req: Request, res: Response): Promise<void> => {
  const maybeNoteId = z.nanoid().safeParse(req.params.note);

  if (!maybeNoteId.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNoteId.error.issues });
    return;
  }

  const { data, error } = await tryCatch(getNoteMetaService(maybeNoteId.data));

  if (error) {
    console.error('getNoteService:', error);
    res.status(500).json({ msg: 'ERR', data: `getNoteService: ${error.message}` });
    return;
  }

  const maybeNoteMeta = NoteMetaSchema.safeParse(data);
  if (!maybeNoteMeta.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNoteMeta.error.issues });
    return;
  }

  if (maybeNoteMeta.data.dontAsk) {
    const { data, error } = await tryCatch(deleteNoteService(maybeNoteMeta.data.noteId));
    if (error) {
      console.error('deleteNoteService', error);
      res.status(500).json({ msg: 'ERR', data: `deleteNoteService: ${error.message}` });
      return;
    }
    const maybeNote = NoteSchema.safeParse(data);
    if (!maybeNote.success) {
      res.status(500).json({ msg: 'ERR', data: maybeNote.error.issues });
      return;
    }
    res.json({ msg: 'OK', data: maybeNote.data });
  } else {
    res.json({ msg: 'OK', data: maybeNoteMeta.data });
  }
};
