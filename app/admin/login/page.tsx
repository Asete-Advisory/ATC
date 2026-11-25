import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, Megaphone, Users } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Entrar" };

type LoginPageProps = { searchParams?: Promise<{ expirado?: string }> };

const highlights = [
  { icon: BarChart3, text: "Acessos ao site, dia a dia" },
  { icon: Megaphone, text: "Resultado de cada anúncio e campanha" },
  { icon: Users, text: "Respostas do diagnóstico e do formulário" },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Marca: faixa no celular, painel lateral no computador. */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <Image
          src="/global/porto.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        <div className="relative flex h-full flex-col justify-between gap-10 px-6 pt-8 pb-10 sm:px-10 lg:p-14">
          <Image
            src="/global/atc-icon-white.svg"
            alt="ATC China Brasil"
            width={1205}
            height={375}
            priority
            className="h-7 w-auto self-start lg:h-8"
          />
          <div className="max-w-md">
            <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              Painel interno
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
              Acessos e leads do site em um só lugar
            </h2>
            <ul className="mt-6 hidden space-y-3 text-sm text-primary-foreground/80 lg:block">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex items-start justify-center px-6 py-10 sm:px-10 lg:items-center lg:py-14">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-[1.75rem]">
            Entrar no painel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {params?.expirado
              ? "Sua sessão expirou. Entre novamente."
              : "Use o e-mail e a senha de administrador."}
          </p>
          <LoginForm />
          <p className="mt-8 text-xs text-muted-foreground">
            Acesso restrito à equipe ATC China Brasil.
          </p>
        </div>
      </section>
    </main>
  );
}
