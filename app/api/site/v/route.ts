import { forwardEvent } from "@/lib/pocketbase";

// Visita registrada pelo componente SiteAnalytics.
export async function POST(request: Request) {
  return forwardEvent(request, "/api/atc/pageviews");
}
