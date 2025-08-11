import { saveNoteToDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const createNoteService = async (input: Note): Promise<Note> => {
  return await saveNoteToDb(input);
};
