import { Request, Response } from 'express';
import { createNoteService } from '../services';
import { tryCatch } from '../utils/tryCatch';
import {
  CreateNoteReqSchema,
  NoteMetaResSchema,
  NoteSchema,
} from '../models/noteModel';
import { nanoid } from 'nanoid';
import { getEnv } from '../utils/getEnv';

export const createNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { hostedZoneName, subdomain } = getEnv;

  const maybeNoteReq = CreateNoteReqSchema.safeParse(req.body);
  if (!maybeNoteReq.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteReq.error.issues,
    });
    return;
  }

  const maybeNote = NoteSchema.safeParse({
    noteId: nanoid(),
    ...maybeNoteReq.data,
  });
  if (!maybeNote.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNote.error.issues,
    });
    return;
  }

  const { data, error } = await tryCatch(createNoteService(maybeNote.data));

  if (error) {
    console.error('createNoteService:', error);
    res.status(500).json({
      msg: 'ERR',
      data: `createNoteService: ${error.message}`,
    });
    return; // need to return as lambda logs "Cannot set headers after they are sent to the client"
  }

  const maybeNoteMetaRes = NoteMetaResSchema.safeParse({
    hasManualPass: data?.hasManualPass,
    durationHours: data?.durationHours,
    dontAsk: data?.dontAsk,
    noteLink: `https://${subdomain}.${hostedZoneName}/${data?.noteId}`,
  });

  if (!maybeNoteMetaRes.success) {
    res.status(500).json({
      msg: 'ERR',
      data: maybeNoteMetaRes.error.issues,
    });
    return;
  }

  res.json({ msg: 'OK', data: maybeNoteMetaRes.data });
};
