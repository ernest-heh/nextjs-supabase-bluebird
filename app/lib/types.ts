import { z } from "zod";

export const TweetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Tweet cannot be empty." })
    .max(280, { message: "Tweet cannot be longer than 280 characters." }),
});
