import { saveNoteToDb } from '../clients/aws';
import { Note, NoteMeta } from '../models/noteModel';

export const createNoteService = async (input: Note): Promise<NoteMeta> => {
  return await saveNoteToDb(input);
};
