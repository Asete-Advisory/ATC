import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { DailyChart } from "@/components/admin/daily-chart";
import { BarList, Card, StatTile } from "@/components/admin/panel-ui";
import { RangePicker } from "@/components/admin/range-picker";
import {
  channelLabels,
  deviceLabels,
  fetchLeads,
  fetchStats,
  formatDateTime,
  formatDay,
  formatNumber,
  formatPercent,
  originLabels,
  parseRange,
  rangeQuery,
  requireAdmin,
} from "@/lib/admin";

export const metadata: Metadata = { title: "Visão geral" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const thClassName = "px-3 py-2.5 font-medium whitespace-nowrap";
const tdNumber = "px-3 py-2.5 text-right tabular-nums";

export default async function DashboardPage({ searchParams }: PageProps) {
  const { token } = await requireAdmin();
  const range = parseRange(await searchParams);
  const [stats, latest] = await Promise.all([
    fetchStats(range, token),
    fetchLeads({ range, perPage: 6 }, token),
  ]);
  const { totals, previous } = stats;
  const periodQuery = new URLSearchParams(rangeQuery(range)).toString();
  const leadsHref = (extra: Record<string, string> = {}) =>
    `/admin/leads?${new URLSearchParams({ ...rangeQuery(range), ...extra })}`;

  const conversion = totals.visitors ? totals.leads / totals.visitors : 0;
  const previousConversion = previous.visitors ? previous.leads / previous.visitors : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary sm:text-[1.75rem]">Visão geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDay(stats.range.from, { day: "2-digit", month: "short", year: "numeric" })} a{" "}
            {formatDay(stats.range.to, { day: "2-digit", month: "short", year: "numeric" })} ·
            horário de Brasília
          </p>
        </div>
        <RangePicker range={range} basePath="/admin" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile
          label="Visitantes"
          value={formatNumber(totals.visitors)}
          current={totals.visitors}
          previous={previous.visitors}
          detail={`${formatNumber(totals.sessions)} visitas (sessões)`}
        />
        <StatTile
          label="Páginas vistas"
          value={formatNumber(totals.pageviews)}
          current={totals.pageviews}
          previous={previous.pageviews}
          detail={
            totals.sessions
              ? `${(totals.pageviews / totals.sessions).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} por visita`
              : undefined
          }
        />
        <StatTile
          label="Leads"
          value={formatNumber(totals.leads)}
          current={totals.leads}
          previous={previous.leads}
          detail={`${formatNumber(totals.leadsDiagnosis)} diagnóstico · ${formatNumber(totals.leadsForm)} formulário`}
        />
        <StatTile
          label="Conversão"
          value={formatPercent(totals.leads, totals.visitors)}
          current={conversion}
          previous={previousConversion}
          detail={`${formatNumber(totals.whatsapp)} abriram o WhatsApp`}
        />
      </div>

      <Card title="Acessos e leads no período">
        <DailyChart days={stats.daily} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card
          className="lg:col-span-2"
          title="De onde vêm as visitas"
          description="Visitantes únicos por canal e quantos viraram lead."
        >
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[22rem] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className={thClassName}>Canal</th>
                  <th className={`${thClassName} text-right`}>Visitantes</th>
                  <th className={`${thClassName} text-right`}>Leads</th>
                  <th className={`${thClassName} text-right`}>Conv.</th>
                </tr>
              </thead>
              <tbody>
                {stats.channels.map((row) => (
                  <tr key={row.channel} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-2.5">
                      <Link
                        href={leadsHref({ canal: row.channel })}
                        className="hover:text-[#0f86a8] hover:underline"
                      >
                        {channelLabels[row.channel]}
                      </Link>
                    </td>
                    <td className={tdNumber}>{formatNumber(row.visitors)}</td>
                    <td className={tdNumber}>{formatNumber(row.leads)}</td>
                    <td className={`${tdNumber} text-muted-foreground`}>
                      {formatPercent(row.leads, row.visitors)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="lg:col-span-3"
          title="Anúncios e campanhas"
          description="Visitas que chegaram com o nome do anúncio ou da campanha no link."
        >
          {stats.campaigns.length ? (
            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className={thClassName}>Campanha / anúncio</th>
                    <th className={`${thClassName} text-right`}>Visitantes</th>
                    <th className={`${thClassName} text-right`}>Leads</th>
                    <th className={`${thClassName} text-right`}>Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.campaigns.map((row) => (
                    <tr
                      key={`${row.campaign}\u0000${row.ad}`}
                      className="border-b border-border/70 last:border-0"
                    >
                      <td className="px-3 py-2.5">
                        <Link
                          href={leadsHref({ campanha: row.campaign, anuncio: row.ad })}
                          className="group block"
                        >
                          <span className="block font-medium group-hover:text-[#0f86a8] group-hover:underline">
                            {row.ad || row.campaign}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {[row.ad ? row.campaign : "", row.source].filter(Boolean).join(" · ") ||
                              "Campanha"}
                          </span>
                        </Link>
                      </td>
                      <td className={tdNumber}>{formatNumber(row.visitors)}</td>
                      <td className={`${tdNumber} font-medium`}>{formatNumber(row.leads)}</td>
                      <td className={`${tdNumber} text-muted-foreground`}>
                        {formatPercent(row.leads, row.visitors)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-secondary/70 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-primary">
                <Megaphone className="size-4 text-[#0f86a8]" aria-hidden />
                Nenhuma visita de anúncio neste período
              </p>
              <p className="mt-2 text-muted-foreground">
                Para aparecer aqui, o link do anúncio precisa levar o nome dele. No Meta Ads,
                preencha os parâmetros de URL com:
              </p>
              <code className="mt-2 block rounded-lg bg-background px-3 py-2 text-xs break-all">
                utm_source=meta&amp;utm_medium=paid&amp;utm_campaign={"{{campaign.name}}"}&amp;utm_content={"{{ad.name}}"}
              </code>
              <p className="mt-2 text-muted-foreground">
                Ou escreva no link: <code className="text-foreground">/diagnostico?anuncio=Nome-do-anuncio</code>
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Páginas mais vistas">
          <BarList
            empty="Sem visitas no período."
            rows={stats.pages.map((row) => ({
              key: row.path,
              label: row.path === "/" ? "Página inicial" : row.path,
              value: row.pageviews,
            }))}
          />
        </Card>
        <Card title="Sites de origem" description="Visitantes que chegaram por um link.">
          <BarList
            empty="Nenhum site de origem no período."
            rows={stats.referrers.map((row) => ({
              key: row.label,
              label: row.label,
              value: row.visitors,
            }))}
          />
        </Card>
        <Card title="Dispositivos" className="md:col-span-2 xl:col-span-1">
          <BarList
            empty="Sem visitas no período."
            rows={stats.devices.map((row) => ({
              key: row.label,
              label: deviceLabels[row.label] ?? row.label,
              value: row.visitors,
              extra: formatPercent(row.visitors, totals.visitors),
            }))}
          />
        </Card>
      </div>

      <Card
        title="Últimos leads"
        action={
          <Link
            href={`/admin/leads?${periodQuery}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-accent/40"
          >
            Ver todos
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        {latest.items.length ? (
          <ul className="divide-y divide-border">
            {latest.items.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="-mx-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-3 transition-colors hover:bg-secondary/70"
                >
                  <span className="w-full min-w-0 sm:w-auto sm:flex-1">
                    <span className="block truncate font-medium">
                      {lead.company || lead.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[lead.name !== lead.company ? lead.name : "", lead.city]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="w-full text-xs text-muted-foreground sm:w-auto">
                    {originLabels[lead.origin]}
                    {lead.ad || lead.campaign ? ` · ${lead.ad || lead.campaign}` : ""}
                  </span>
                  <span className="w-full text-xs tabular-nums text-muted-foreground sm:w-auto">
                    {formatDateTime(lead.created)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum lead neste período.
          </p>
        )}
      </Card>
    </div>
  );
}
