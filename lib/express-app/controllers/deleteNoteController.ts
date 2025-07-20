import { Request, Response } from 'express';
import { deleteNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { z } from 'zod';

export const deleteNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const maybeNoteId = z.nanoid().safeParse(req.params.note);

  if (!maybeNoteId.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteId.error.issues,
    });
    return;
  }

  const { data, error } = await tryCatch(deleteNoteService(maybeNoteId.data));

  if (error) {
    console.error('deleteNoteService:', error);
    res.status(500).json({
      msg: 'ERR',
      data: `deleteNoteService: ${error.message}`,
    });
    return;
  }

  const maybeNoteData = z.base64().safeParse(data);

  if (!maybeNoteData.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteData.error.issues,
    });
    return;
  }

  res.json({ msg: 'OK', data: maybeNoteData.data });
};
