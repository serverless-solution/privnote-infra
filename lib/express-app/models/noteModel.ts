import { z } from 'zod';
import { nanoid } from 'nanoid';

/**
 * @Note a Note
 */

export const NoteReqSchema = z.object({
  // reference name for the note (optional)
  encryptedData: z.string(),
  // E-mail to notify when note is destroyed
  noteName: z.string().nullable().optional().default(null),
  // note encrypted
  email: z.email().nullable().optional().default(null),
  // Do not ask for confirmation before showing and destroying the note.
  askConfirmation: z.boolean().optional().default(true),
  // created with a custom password to encrypt the note
  manualPassword: z.boolean().optional().default(false),
  // Note self-destructs after
  ttl: z.date().nullable().optional().default(null),
});

export const NoteSchema = z.object({
  noteId: z.nanoid(),
  ...NoteReqSchema.shape,
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteReq = z.infer<typeof NoteReqSchema>;
