import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { getEnv } from '../../../utils/getEnv';
import { NoteSchema } from '../../../models/noteModel';

interface GetNoteDataFromDbInput {
  noteId: string;
}

export const getNoteDataFromDb = async (
  input: GetNoteDataFromDbInput
): Promise<string> => {
  const { noteId } = input;
  const { tableName } = getEnv;

  const command = new GetCommand({
    TableName: tableName, // replace with your table name
    Key: {
      noteId: noteId,
    },
  });
  const { data, error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`getCommandError: ${error.message}`);
  if (!data.Item) {
    throw new Error(`getCommandError: item not found`);
  }

  const note = NoteSchema.safeParse(data.Item);
  if (!note.success) {
    throw new Error(note.error.message);
  }

  // return note data in base64
  return note.data.data;
};
