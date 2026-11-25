import { forwardEvent } from "@/lib/pocketbase";

// Respostas do diagnóstico ou do formulário da home.
export async function POST(request: Request) {
  return forwardEvent(request, "/api/atc/leads");
}
