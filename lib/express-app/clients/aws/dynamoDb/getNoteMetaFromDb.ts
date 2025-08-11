import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { getEnv } from '../../../utils/getEnv';
import { NoteMeta, NoteMetaSchema } from '../../../models/noteModel';

interface GetNoteFromDbInput {
  noteId: string;
}

export const getNoteMetaFromDb = async (input: GetNoteFromDbInput): Promise<NoteMeta> => {
  const { noteId } = input;
  const { tableName } = getEnv;

  const noteMetaFields = Object.keys(NoteMetaSchema.shape);
  const projectionExpression = noteMetaFields.join(', ');

  const command = new GetCommand({
    TableName: tableName, // replace with your table name
    Key: {
      noteId: noteId,
    },
    ProjectionExpression: projectionExpression,
  });
  const { data, error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`getCommandError: ${error.message}`);
  if (!data.Item) {
    throw new Error(`getCommandError: item not found`);
  }

  const noteMeta = NoteMetaSchema.safeParse(data.Item);
  if (!noteMeta.success) {
    throw new Error(noteMeta.error.message);
  }

  return noteMeta.data;
};
