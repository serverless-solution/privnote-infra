import { getNoteDataFromDb } from '../clients/aws';

export const getNoteDataService = async (input: string) => {
  return await getNoteDataFromDb({ noteId: input });
};
