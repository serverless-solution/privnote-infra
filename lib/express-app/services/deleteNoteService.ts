import { deleteNoteFromDb } from '../clients/aws';

export const deleteNoteService = async (input: string): Promise<string> => {
  return await deleteNoteFromDb({ noteId: input });
};
