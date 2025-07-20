import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { getEnv } from '../../../utils/getEnv';
import { NoteSchema } from '../../../models/noteModel';

interface GetNoteDataFromDbInput {
  noteId: string;
}

export const deleteNoteFromDb = async (
  input: GetNoteDataFromDbInput
): Promise<string> => {
  const { noteId } = input;
  const { tableName } = getEnv;

  const command = new DeleteCommand({
    TableName: tableName, // replace with your table name
    Key: {
      noteId: noteId,
    },
    ReturnValues: 'ALL_OLD', // ✅ Return the deleted item
  });
  const { data, error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`DeleteCommand: ${error.message}`);
  if (!data.Attributes) {
    throw new Error(`DeleteCommand: item not found`);
  }

  const note = NoteSchema.safeParse(data.Attributes); // <- contains old item if existed
  if (!note.success) {
    throw new Error(note.error.message);
  }

  // return note data in base64
  return note.data.data;
};
