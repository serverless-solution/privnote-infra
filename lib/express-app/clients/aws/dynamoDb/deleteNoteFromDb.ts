import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { getEnv } from '../../../utils/getEnv';
import { Note, NoteSchema } from '../../../models/noteModel';

export const deleteNoteFromDb = async (noteId: string): Promise<Note> => {
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
  return note.data;
};
