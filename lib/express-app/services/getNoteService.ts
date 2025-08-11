import { getNoteFromDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const getNoteService = async (input: string): Promise<Note> => {
  return await getNoteFromDb({ noteId: input });
};
