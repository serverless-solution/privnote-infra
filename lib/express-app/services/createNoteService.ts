import { saveNoteToDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const createNoteService = async (note: Note) => {
  return await saveNoteToDb(note);
};
