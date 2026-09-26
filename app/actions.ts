"use server";

import { revalidatePath } from "next/cache";
import { addCondolence } from "@/lib/store";

export type FormState = { ok: boolean; error?: string };

const clean = (v: FormDataEntryValue | null) =>
  String(v ?? "").replace(/<[^>]*>/g, "").trim();

export async function submitCondolence(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill hidden fields, people don't.
  if (clean(formData.get("website"))) return { ok: true };

  const name = clean(formData.get("name")).replace(/\s+/g, " ");
  const message = clean(formData.get("message"));

  if (name.split(" ").filter(Boolean).length < 2)
    return { ok: false, error: "Please enter your full name (first and last)." };
  if (name.length > 80) return { ok: false, error: "Name is too long." };
  if (message.length < 2) return { ok: false, error: "Please write a message." };
  if (message.length > 1500) return { ok: false, error: "Message is too long (1500 characters max)." };

  try {
    await addCondolence(name, message);
  } catch (err) {
    console.error("Failed to save condolence:", err);
    return { ok: false, error: "Sorry, we couldn't save your message right now. Please try again later." };
  }
  revalidatePath("/");
  return { ok: true };
}
