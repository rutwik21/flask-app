import { z } from "zod";

export const Signin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export const Signup = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  profile: z.any()
  .refine((files) => {
    return files?.[0]?.size <= MAX_FILE_SIZE;
  }, `Max image size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  ),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );
