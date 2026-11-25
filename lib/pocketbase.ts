/**
 * Acesso ao backend PocketBase (pasta backend/). Só no servidor: o navegador
 * fala com as rotas /api/site/* e com o painel /admin, nunca direto com ele.
 *
 * POCKETBASE_URL: endereço interno, ex.: http://pocketbase:8090 no Compose.
 */
export const POCKETBASE_URL = (
  process.env.POCKETBASE_URL ?? "http://127.0.0.1:8090"
).replace(/\/$/, "");

export function pbFetch(
  path: string,
  init: RequestInit & { token?: string } = {},
) {
  const { token, headers, ...rest } = init;
  return fetch(`${POCKETBASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: token } : {}),
      ...headers,
    },
    cache: "no-store",
    signal: rest.signal ?? AbortSignal.timeout(8000),
  });
}

/** Repassa um evento do navegador, com o User-Agent original (filtro de bots). */
export async function forwardEvent(request: Request, path: string) {
  try {
    const body = await request.text();
    if (body.length > 128 * 1024) return new Response(null, { status: 413 });

    const response = await pbFetch(path, {
      method: "POST",
      body,
      headers: { "User-Agent": request.headers.get("user-agent") ?? "" },
    });
    const text = await response.text();
    return new Response(text || null, {
      status: response.status,
      headers: text ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    // Backend fora do ar: o site segue funcionando normalmente.
    return new Response(null, { status: 204 });
  }
}
