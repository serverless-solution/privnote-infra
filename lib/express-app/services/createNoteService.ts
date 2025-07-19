import { saveNoteToDb } from '../clients/aws';
import { Note } from '../models/noteModel';

export const createNoteService = async (input: Note) => {
  const { noteId, encryptedData } = input;

  return await saveNoteToDb({
    encryptedData,
    noteId,
  });
};
