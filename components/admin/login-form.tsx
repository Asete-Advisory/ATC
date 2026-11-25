"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";

const inputClassName =
  "min-h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/40 focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/15 sm:text-sm";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-medium">
          E-mail
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          required
          defaultValue={state.email}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium">
          Senha
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClassName}
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
        Entrar
      </button>
    </form>
  );
}
