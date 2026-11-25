import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Trash2 } from "lucide-react";
import { deleteLead } from "@/app/admin/actions";
import { Card } from "@/components/admin/panel-ui";
import {
  channelLabels,
  fetchLead,
  formatDateTime,
  originLabels,
  requireAdmin,
  sectionLabels,
  whatsappLink,
  type LeadAnswer,
} from "@/lib/admin";

export const metadata: Metadata = { title: "Lead" };

type PageProps = { params: Promise<{ id: string }> };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="py-2.5 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm break-words sm:mt-0">{children}</dd>
    </div>
  );
}

export default async function LeadPage({ params }: PageProps) {
  const { token } = await requireAdmin();
  const { id } = await params;
  const lead = await fetchLead(id, token);
  if (!lead) notFound();

  const answers = (lead.answers ?? []) as LeadAnswer[];
  const sections = Object.keys(sectionLabels)
    .map((section) => ({
      section,
      items: answers.filter((answer) => (answer.section || "other") === section),
    }))
    .filter((group) => group.items.length);
  const whatsapp = whatsappLink(lead.phone);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Todos os leads
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {originLabels[lead.origin]} · {formatDateTime(lead.created)}
          </p>
          <h1 className="mt-1 text-2xl font-semibold break-words text-primary sm:text-[1.75rem]">
            {lead.company || lead.name}
          </h1>
          {lead.company && lead.name ? (
            <p className="mt-1 text-muted-foreground">
              {lead.name}
              {lead.city ? ` · ${lead.city}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <MessageCircle className="size-4" aria-hidden />
              Chamar no WhatsApp
            </a>
          ) : null}
          {lead.email ? (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium hover:border-accent/40"
            >
              <Mail className="size-4" aria-hidden />
              E-mail
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Contato" className="lg:col-span-3">
          <dl className="divide-y divide-border">
            <Field label="Nome">{lead.name}</Field>
            <Field label="Empresa">{lead.company}</Field>
            <Field label="Cidade">{lead.city}</Field>
            <Field label="WhatsApp">{lead.phone}</Field>
            <Field label="E-mail">{lead.email}</Field>
            <Field label="Perfil de importador">{lead.profile}</Field>
            <Field label="Abriu o WhatsApp">
              {lead.whatsapp
                ? `Sim${lead.whatsapp_at ? `, ${formatDateTime(lead.whatsapp_at)}` : ""}`
                : "Não (concluiu, mas não enviou a mensagem)"}
            </Field>
          </dl>
        </Card>

        <Card title="Origem" className="lg:col-span-2">
          <dl className="divide-y divide-border">
            <Field label="Canal">{lead.channel ? channelLabels[lead.channel] : "—"}</Field>
            <Field label="Anúncio">{lead.ad}</Field>
            <Field label="Campanha">{lead.campaign}</Field>
            <Field label="Fonte">
              {[lead.utm_source, lead.utm_medium].filter(Boolean).join(" / ")}
            </Field>
            <Field label="Site de origem">{lead.referrer}</Field>
            <Field label="Entrou por">{lead.landing}</Field>
          </dl>
        </Card>
      </div>

      {sections.length ? (
        <Card title="Respostas">
          <div className="space-y-6">
            {sections.map((group) => (
              <section key={group.section}>
                <h3 className="mb-1 text-xs font-semibold tracking-wide text-[#0f86a8] uppercase">
                  {sectionLabels[group.section]}
                </h3>
                <dl className="divide-y divide-border">
                  {group.items.map((answer, index) => (
                    <Field key={index} label={answer.label || sectionLabels[group.section]}>
                      {answer.value}
                    </Field>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Card>
      ) : null}

      {lead.message ? (
        <Card title="Mensagem enviada pelo WhatsApp">
          <pre className="max-h-96 overflow-auto rounded-xl bg-secondary/70 p-4 font-sans text-sm whitespace-pre-wrap">
            {lead.message}
          </pre>
        </Card>
      ) : null}

      <details className="rounded-2xl border border-border bg-background p-4 text-sm sm:p-6">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Excluir este lead
        </summary>
        <p className="mt-3 text-muted-foreground">
          Use quando a pessoa pedir a remoção dos dados (LGPD) ou para apagar testes. Não dá
          para desfazer.
        </p>
        <form action={deleteLead} className="mt-3">
          <input type="hidden" name="id" value={lead.id} />
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-destructive/40 px-4 font-medium text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="size-4" aria-hidden />
            Excluir definitivamente
          </button>
        </form>
      </details>
    </div>
  );
}
