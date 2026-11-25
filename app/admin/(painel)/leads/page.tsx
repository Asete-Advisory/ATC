import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, MessageCircle, Search, X } from "lucide-react";
import { Card } from "@/components/admin/panel-ui";
import { RangePicker } from "@/components/admin/range-picker";
import {
  channelLabels,
  fetchLeads,
  formatDateTime,
  formatNumber,
  originLabels,
  parseRange,
  rangeQuery,
  requireAdmin,
  type Channel,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

export default async function LeadsPage({ searchParams }: PageProps) {
  const { token } = await requireAdmin();
  const params = await searchParams;
  const range = parseRange(params);

  const origin = single(params.origem);
  const channel = single(params.canal);
  const campaign = single(params.campanha);
  const ad = single(params.anuncio);
  const search = single(params.busca)?.trim() ?? "";
  const page = Math.max(1, Number(single(params.pagina)) || 1);

  const leads = await fetchLeads(
    {
      range,
      origin,
      channel: channel && channel in channelLabels ? channel : undefined,
      campaign,
      ad,
      search,
      page,
    },
    token,
  );

  // Filtros atuais, para manter ao trocar período, origem ou página.
  const filters: Record<string, string | undefined> = {
    ...rangeQuery(range),
    origem: origin,
    canal: channel,
    campanha: campaign,
    anuncio: ad,
    busca: search || undefined,
  };
  const href = (changes: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...changes })) {
      if (value !== undefined) query.set(key, value);
    }
    return `/admin/leads?${query}`;
  };
  const exportHref = `/admin/exportar?${new URLSearchParams(
    Object.entries({ ...rangeQuery(range), origem: origin }).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  )}`;

  const sourceFilter =
    campaign !== undefined || ad !== undefined
      ? `Anúncio: ${ad || campaign || "—"}${ad && campaign ? ` (${campaign})` : ""}`
      : channel && channel in channelLabels
        ? `Canal: ${channelLabels[channel as Channel]}`
        : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary sm:text-[1.75rem]">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Respostas do diagnóstico e do formulário da home.
          </p>
        </div>
        <RangePicker
          range={range}
          basePath="/admin/leads"
          keep={{ origem: origin, canal: channel, campanha: campaign, anuncio: ad, busca: search || undefined }}
        />
      </div>

      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div role="group" aria-label="Origem" className="flex flex-wrap gap-2">
            {[
              { id: undefined, label: "Todos" },
              { id: "diagnosis", label: originLabels.diagnosis },
              { id: "form", label: originLabels.form },
            ].map((item) => (
              <Link
                key={item.label}
                href={href({ origem: item.id, pagina: undefined })}
                aria-current={origin === item.id ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors",
                  origin === item.id
                    ? "border-primary bg-primary font-medium text-primary-foreground"
                    : "border-border hover:border-accent/40",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <form action="/admin/leads" className="flex flex-1 gap-2 lg:max-w-md lg:ml-auto">
            {Object.entries(filters)
              .filter(([key, value]) => key !== "busca" && value !== undefined)
              .map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <label htmlFor="lead-search" className="sr-only">
              Buscar lead
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="lead-search"
                name="busca"
                type="search"
                defaultValue={search}
                placeholder="Nome, empresa, e-mail, telefone ou cidade"
                className="min-h-10 w-full rounded-full border border-border bg-secondary/50 pr-4 pl-10 text-base outline-none focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/15 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Buscar
            </button>
          </form>
        </div>

        {sourceFilter ? (
          <div className="mt-3">
            <Link
              href={href({ canal: undefined, campanha: undefined, anuncio: undefined, pagina: undefined })}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent/12 px-3 text-sm text-primary hover:bg-accent/20"
            >
              {sourceFilter}
              <X className="size-3.5" aria-hidden />
              <span className="sr-only">Remover filtro</span>
            </Link>
          </div>
        ) : null}
      </Card>

      <Card
        title={`${formatNumber(leads.totalItems)} ${leads.totalItems === 1 ? "lead" : "leads"}`}
        action={
          <a
            href={exportHref}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-accent/40"
          >
            <Download className="size-4" aria-hidden />
            Exportar CSV
          </a>
        }
      >
        {leads.items.length ? (
          <>
            {/* Tabela no computador, cartões no celular. */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2.5 font-medium">Data</th>
                    <th className="px-3 py-2.5 font-medium">Empresa / contato</th>
                    <th className="px-3 py-2.5 font-medium">Origem</th>
                    <th className="px-3 py-2.5 font-medium">Veio de</th>
                    <th className="px-3 py-2.5 font-medium">
                      <span className="sr-only">Abriu o WhatsApp</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.items.map((lead) => (
                    <tr
                      key={lead.id}
                      className="group relative border-b border-border/70 last:border-0 hover:bg-secondary/60"
                    >
                      <td className="px-3 py-3 whitespace-nowrap tabular-nums text-muted-foreground">
                        {formatDateTime(lead.created)}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium after:absolute after:inset-0 group-hover:text-[#0f86a8]"
                        >
                          {lead.company || lead.name}
                        </Link>
                        <span className="block text-xs text-muted-foreground">
                          {[lead.company ? lead.name : "", lead.city, lead.phone]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {originLabels[lead.origin]}
                        {lead.profile ? (
                          <span className="block text-xs text-muted-foreground">
                            {lead.profile.replace(/\s*\(.*\)$/, "")}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        {lead.ad || lead.campaign || (lead.channel ? channelLabels[lead.channel] : "—")}
                        {lead.ad && lead.campaign ? (
                          <span className="block text-xs text-muted-foreground">{lead.campaign}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {lead.whatsapp ? (
                          <span
                            title="Abriu o WhatsApp com a mensagem"
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                          >
                            <MessageCircle className="size-3.5" aria-hidden />
                            Enviou
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {leads.items.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/admin/leads/${lead.id}`} className="-mx-1 block rounded-lg px-1 py-3 active:bg-secondary">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0 font-medium">{lead.company || lead.name}</span>
                      {lead.whatsapp ? (
                        <MessageCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-label="Abriu o WhatsApp" />
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {[lead.company ? lead.name : "", lead.city].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {formatDateTime(lead.created)} · {originLabels[lead.origin]}
                      {lead.ad || lead.campaign ? ` · ${lead.ad || lead.campaign}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {leads.totalPages > 1 ? (
              <nav aria-label="Páginas" className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                {page > 1 ? (
                  <Link
                    href={href({ pagina: String(page - 1) })}
                    className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border px-3 hover:border-accent/40"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                    Anterior
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-muted-foreground">
                  Página {page} de {leads.totalPages}
                </span>
                {page < leads.totalPages ? (
                  <Link
                    href={href({ pagina: String(page + 1) })}
                    className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border px-3 hover:border-accent/40"
                  >
                    Próxima
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhum lead encontrado com esses filtros.
          </p>
        )}
      </Card>
    </div>
  );
}
