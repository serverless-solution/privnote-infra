import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { Note } from '../../../models/noteModel';
import { getEnv } from '../../../utils/getEnv';

export const saveNoteToDb = async (input: Note): Promise<Note> => {
  const { tableName } = getEnv;

  const note: Note = {
    noteId: '',
    encryptedData: '',
  };

  const command = new PutCommand({
    TableName: tableName,
    Item: note,
  });

  const { error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`transactWriteCommandError: ${error.message}`);

  return note;
};
