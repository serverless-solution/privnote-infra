import { getNoteFromDb } from '../clients/aws';

export const getNoteService = async (input: string) => {
  return await getNoteFromDb({ noteId: input });
};
