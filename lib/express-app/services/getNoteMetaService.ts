import { getNoteMetaFromDb } from '../clients/aws';
import { NoteMeta } from '../models/noteModel';

export const getNoteMetaService = async (input: string): Promise<NoteMeta> => {
  return await getNoteMetaFromDb({ noteId: input });
};
