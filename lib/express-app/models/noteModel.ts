import { z } from 'zod';
import { nanoid } from 'nanoid';

/**
 * @Note a Note
 */

export const NoteReqSchema = z.object({
  // reference name for the note (optional)
  data: z.base64(),
  // E-mail to notify when note is destroyed
  notifyRef: z.string().nullable().optional().default(null),
  // note encrypted
  notifyEmail: z.email().nullable().optional().default(null),
  // Do not ask for confirmation before showing and destroying the note.
  dontAsk: z.boolean().optional().default(false),
  // created with a custom password to encrypt the note
  hasManualPass: z.boolean().optional().default(false),
  // Note self-destructs after
  durationHours: z.date().nullable().optional().default(null),
});

export const NoteSchema = z.object({
  noteId: z.nanoid(),
  dataType: z.string().optional().default('T'),
  ...NoteReqSchema.shape,
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteReq = z.infer<typeof NoteReqSchema>;
