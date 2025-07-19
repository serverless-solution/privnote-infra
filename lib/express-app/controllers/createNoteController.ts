import { Request, Response } from 'express';
import { createNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import { Note } from '../models/noteModel';

export const createNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const note: Note = req.body.note;
  const { data, error } = await tryCatch(createNoteService(note));

  if (error) {
    console.error('createNoteService:', error);
    res.status(500).json({
      msg: 'ERR',
      data: `createNoteService: ${error.message}`,
    });
    return; // need to return as lambda logs "Cannot set headers after they are sent to the client"
  }
  res.json({ msg: 'OK', data: data });
};
