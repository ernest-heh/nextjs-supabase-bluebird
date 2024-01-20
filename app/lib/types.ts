import { z } from "zod";

export const TweetFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Tweet cannot be empty." })
    .max(280, { message: "Tweet cannot be longer than 280 characters." }),
});

// export type Fields = {
//   title: string;
// };

// export type TweetFormState = {
//   message: string;
//   errors: Record<keyof Fields, string> | undefined;
//   fieldValues: Fields;
// };

export type TweetFormSchemaType = z.infer<typeof TweetFormSchema>;
