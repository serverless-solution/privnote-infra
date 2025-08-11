import { z } from 'zod';

/**
 * @Note a Note
 */

const _publicSchema = z.object({
  // created with a custom password to encrypt the note
  hasManualPass: z.boolean().optional().default(false),
  // Note self-destructs after
  durationHours: z.date().nullable().optional().default(null),
  // Do not ask for confirmation before showing and destroying the note.
  dontAsk: z.boolean().optional().default(false),
});

export const CreateNoteReqSchema = z.object({
  // data
  data: z.base64(),
  // reference name for the note (optional)
  notifyRef: z.string().nullable().optional().default(null),
  // E-mail to notify when note is destroyed
  notifyEmail: z.email().nullable().optional().default(null),
  ..._publicSchema.shape,
});

export const NoteSchema = z.object({
  noteId: z.nanoid(),
  dataType: z.string().optional().default('T'),
  ...CreateNoteReqSchema.shape,
});

export const NoteMetaSchema = z.object({
  noteId: z.nanoid(),
  ..._publicSchema.shape,
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteMeta = z.infer<typeof NoteMetaSchema>;
