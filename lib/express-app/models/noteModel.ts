import { z } from 'zod';

/**
 * @Note a Note
 */
export const NoteSchema = z.object({
  // note id
  noteId: z.string(),
  // reference name for the note (optional)
  encryptedData: z.string(),
  // E-mail to notify when note is destroyed
  noteName: z.string().optional(),
  // note encrypted
  email: z.email().optional(),
  // Do not ask for confirmation before showing and destroying the note.
  askConfirmation: z.boolean().optional(),
  // created with a custom password to encrypt the note
  manualPassword: z.boolean().optional(),
  // Note self-destructs after
  ttl: z.date().optional(),
});

export type Note = z.infer<typeof NoteSchema>;
