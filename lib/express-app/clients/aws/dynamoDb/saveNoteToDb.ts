import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { Note, NoteMeta, NoteMetaSchema } from '../../../models/noteModel';
import { getEnv } from '../../../utils/getEnv';

export const saveNoteToDb = async (note: Note): Promise<NoteMeta> => {
  const { tableName } = getEnv;

  const command = new PutCommand({
    TableName: tableName,
    Item: note,
    ConditionExpression: 'attribute_not_exists(noteId)',
  });

  const { error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`PutCommandError: ${error.message}`);

  const noteMeta = NoteMetaSchema.safeParse(note);
  if (!noteMeta.success) {
    throw new Error(noteMeta.error.message);
  }

  return noteMeta.data;
};
