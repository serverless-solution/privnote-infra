import { Request, Response } from 'express';
import { getNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { NoteMetaResSchema, NoteSchema } from '../models/noteModel';
import { getEnv } from '../utils/getEnv';
import { z } from 'zod';

export const getNoteOrNoteMetaController = async (req: Request, res: Response): Promise<void> => {
  const { hostedZoneName, subdomain } = getEnv;

  const maybeNoteId = z.nanoid().safeParse(req.params.note);

  if (!maybeNoteId.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNoteId.error.issues });
    return;
  }

  const { data, error } = await tryCatch(getNoteService(maybeNoteId.data));

  if (error) {
    console.error('getNoteService:', error);
    res.status(500).json({ msg: 'ERR', data: `getNoteService: ${error.message}` });
    return;
  }

  const maybeNote = NoteSchema.safeParse(data);
  if (!maybeNote.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNote.error.issues });
    return;
  }

  const maybeNoteMetaRes = NoteMetaResSchema.safeParse({
    hasManualPass: maybeNote.data.hasManualPass,
    durationHours: maybeNote.data.durationHours,
    dontAsk: maybeNote.data.dontAsk,
    noteLink: `https://${subdomain}.${hostedZoneName}/${maybeNote.data.noteId}`,
  });

  if (!maybeNoteMetaRes.success) {
    res.status(500).json({ msg: 'ERR', data: maybeNoteMetaRes.error.issues });
    return;
  }

  res.json({ msg: 'OK', data: maybeNoteMetaRes.data });
};
