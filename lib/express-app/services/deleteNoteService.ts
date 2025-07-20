import { getNoteDataFromDb } from '../clients/aws';

export const deleteNoteService = async (input: string) => {
  return await getNoteDataFromDb({ noteId: input });
};
