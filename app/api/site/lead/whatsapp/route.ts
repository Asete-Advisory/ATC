import { forwardEvent } from "@/lib/pocketbase";

// A pessoa abriu o WhatsApp com a mensagem do lead.
export async function POST(request: Request) {
  let id = "";
  try {
    id = String((await request.clone().json())?.id ?? "");
  } catch {}
  if (!/^[a-z0-9]{15}$/.test(id)) return new Response(null, { status: 204 });
  return forwardEvent(request, `/api/atc/leads/${id}/whatsapp`);
}
