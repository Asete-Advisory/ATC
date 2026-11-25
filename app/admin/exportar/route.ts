import { getAdminToken, parseRange } from "@/lib/admin";
import { pbFetch } from "@/lib/pocketbase";

// CSV dos leads do período, para abrir no Excel.
export async function GET(request: Request) {
  const token = await getAdminToken();
  if (!token) return Response.redirect(new URL("/admin/login", request.url));

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const range = parseRange(params);
  const query = new URLSearchParams({ from: range.from, to: range.to });
  if (params.origem) query.set("origin", params.origem);

  const response = await pbFetch(`/api/atc/leads/export?${query}`, { token });
  if (response.status === 401 || response.status === 403) {
    return Response.redirect(new URL("/admin/login?expirado=1", request.url));
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "text/csv; charset=utf-8",
      "Content-Disposition": response.headers.get("Content-Disposition") ?? "attachment",
      "Cache-Control": "no-store",
    },
  });
}
