import { z } from 'zod';
import { nanoid } from 'nanoid';

/**
 * @Note a Note
 */

const _schema = z.object({
  // created with a custom password to encrypt the note
  hasManualPass: z.boolean().optional().default(false),
  // Note self-destructs after
  durationHours: z.date().nullable().optional().default(null),
  // Do not ask for confirmation before showing and destroying the note.
  dontAsk: z.boolean().optional().default(false),
});

export const NoteReqSchema = z.object({
  // data
  data: z.base64(),
  // reference name for the note (optional)
  notifyRef: z.string().nullable().optional().default(null),
  // E-mail to notify when note is destroyed
  notifyEmail: z.email().nullable().optional().default(null),
  ..._schema.shape,
});

export const NoteSchema = z.object({
  noteId: z.nanoid(),
  dataType: z.string().optional().default('T'),
  ...NoteReqSchema.shape,
});

export const NoteResSchema = z.object({
  noteLink: z.url(),
  ..._schema.shape,
});

export const GetNoteResSchema = z
  .object({
    ..._schema.shape,
    data: z.base64().optional(),
  })
  .transform((obj) => {
    return {
      ...obj,
      data: obj.dontAsk ? obj.data : undefined,
    };
  })
  .refine((obj) => {
    return !(obj.dontAsk && !obj.data);
  });

export type Note = z.infer<typeof NoteSchema>;
export type NoteReq = z.infer<typeof NoteReqSchema>;
export type NoteRes = z.infer<typeof NoteResSchema>;
