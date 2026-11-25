"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COLLECTIONS, ADMIN_COOKIE, requireAdmin } from "@/lib/admin";
import { pbFetch } from "@/lib/pocketbase";

export type LoginState = { error?: string; email?: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha.", email };

  // Aceita quem está em "admins" e também os superusuários do PocketBase.
  let token = "";
  try {
    for (const collection of ADMIN_COLLECTIONS) {
      const response = await pbFetch(`/api/collections/${collection}/auth-with-password`, {
        method: "POST",
        body: JSON.stringify({ identity: email, password }),
      });
      if (response.ok) {
        token = ((await response.json()) as { token: string }).token;
        break;
      }
      if (response.status !== 400 && response.status !== 403 && response.status !== 404) {
        throw new Error(String(response.status));
      }
    }
  } catch {
    return { error: "Não foi possível conectar ao servidor. Tente de novo.", email };
  }
  if (!token) return { error: "E-mail ou senha incorretos.", email };

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 7 * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function deleteLead(formData: FormData) {
  const { token } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (/^[a-z0-9]{15}$/.test(id)) {
    await pbFetch(`/api/collections/leads/records/${id}`, { method: "DELETE", token });
  }
  redirect("/admin/leads?excluido=1");
}
