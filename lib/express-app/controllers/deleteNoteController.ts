import { Request, Response } from 'express';
import { deleteNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { z } from 'zod';
import { NoteSchema } from '../models/noteModel';

export const deleteNoteController = async (req: Request, res: Response): Promise<void> => {
  const maybeNoteId = z.nanoid().safeParse(req.params.note);

  if (!maybeNoteId.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNoteId.error.issues });
    return;
  }

  const { data, error } = await tryCatch(deleteNoteService(maybeNoteId.data));

  if (error) {
    console.error('deleteNoteService:', error);
    res.status(500).json({ msg: 'ERR', data: `deleteNoteService: ${error.message}` });
    return;
  }

  const maybeNote = NoteSchema.safeParse(data);

  if (!maybeNote.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNote.error.issues });
    return;
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.json({ msg: 'OK', data: maybeNote.data });
};
