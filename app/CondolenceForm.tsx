"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitCondolence, type FormState } from "./actions";

export default function CondolenceForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitCondolence, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="form">
      <label>
        Full name
        <input name="name" required maxLength={80} autoComplete="name" placeholder="e.g. Adebayo Johnson" />
      </label>
      <label>
        Condolence message
        <textarea name="message" required maxLength={1500} rows={5} placeholder="Share a memory or a few words of comfort…" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {state.error && <p className="error">{state.error}</p>}
      {state.ok && <p className="thanks">Thank you. Your message has been added to the register.</p>}
      <button type="submit" disabled={pending}>{pending ? "Signing…" : "Sign the register"}</button>
    </form>
  );
}
