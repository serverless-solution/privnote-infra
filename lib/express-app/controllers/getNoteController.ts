import { Request, Response } from 'express';
import { getNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { NoteResSchema } from '../models/noteModel';
import { getEnv } from '../utils/getEnv';
import { z } from 'zod';

export const getNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { hostedZoneName, subdomain } = getEnv;

  const maybeNoteId = z.nanoid().safeParse(req.params.note);

  if (!maybeNoteId.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteId.error.issues,
    });
    return;
  }

  const { data, error } = await tryCatch(getNoteService(maybeNoteId.data));

  if (error) {
    console.error('getNoteService:', error);
    res.status(500).json({
      msg: 'ERR',
      data: `getNoteService: ${error.message}`,
    });
    return;
  }

  const maybeNoteRes = NoteResSchema.safeParse({
    hasManualPass: data?.hasManualPass,
    durationHours: data?.durationHours,
    dontAsk: data?.dontAsk,
    noteLink: `https://${subdomain}.${hostedZoneName}/${data?.noteId}`,
  });

  if (!maybeNoteRes.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteRes.error.issues,
    });
    return;
  }

  res.json({ msg: 'OK', data: maybeNoteRes.data });
};
