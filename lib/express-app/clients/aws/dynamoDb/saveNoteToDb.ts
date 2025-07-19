import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { tryCatch } from '../../../utils/tryCatch';
import { docClient } from '../client';
import { Note } from '../../../models/noteModel';
import { getEnv } from '../../../utils/getEnv';

export const saveNoteToDb = async (input: Note): Promise<Note> => {
  const { tableName } = getEnv;

  const command = new PutCommand({
    TableName: tableName,
    Item: input,
    ConditionExpression: 'attribute_not_exists(noteId)',
  });

  const { error } = await tryCatch(docClient.send(command));
  if (error) throw new Error(`PutCommandError: ${error.message}`);

  return input;
};
