import { saveNoteToDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const createNoteService = async (input: Note) => {
  return await saveNoteToDb(input);
};
