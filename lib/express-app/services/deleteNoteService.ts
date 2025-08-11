import { deleteNoteFromDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const deleteNoteService = async (noteId: string): Promise<Note> => {
  return await deleteNoteFromDb(noteId);
};
