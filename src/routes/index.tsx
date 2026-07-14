import heroDuo from "@/assets/hero-duo.png.asset.json";
import { createFileRoute } from "@tanstack/react-router";
import {
    ArrowRight,
    Briefcase,
    Calendar,
    ChevronDown,
    Crown,
    Landmark,
    Lock,
    MapPin,
    Rocket,
    ShieldCheck,
    Star,
    Target,
    Ticket,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "keywords",
        content:
          "Matheus Biancardine, Deputado Federal, Minas Gerais, Partido Novo, pré-candidatura, Belo Horizonte",
      },
    ],
  }),
  component: LandingPage,
});

const EVENT_DATE = new Date("2026-07-25T19:00:00-03:00");
const MARQUEE_ITEMS = [
  "Save the date · Minas Gerais",
  "Pré-candidatura oficial · Deputado Federal",
  "Belo Horizonte · 25 de Julho · 19h",
  "Presença confirmada do Governador Mateus Simões",
  "Lideranças mineiras · Pautas que transformam Minas",
  "Vagas limitadas · Inscrição gratuita",
];

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return { d: 0, h: 0, m: 0, s: 0, ready: false };
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
    ready: true,
  };
}

function Countdown() {
  const { d, h, m, s, ready } = useCountdown(EVENT_DATE);
  const cells = [
    { label: "DIAS", val: d },
    { label: "HORAS", val: h },
    { label: "MIN", val: m },
    { label: "SEG", val: s },
  ];
  return (
    <div className="card-surface rounded-2xl p-4 sm:p-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Inscrições encerram em
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-primary/25 bg-background/60 py-3 text-center"
          >
            <div className="font-display text-3xl sm:text-4xl text-glow tabular-nums leading-none">
              {ready ? String(c.val).padStart(2, "0") : "--"}
            </div>
            <div className="mt-1 text-[10px] font-semibold tracking-widest text-muted-foreground">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SaveTheDateBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-primary/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 sm:gap-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-blink" />
        <span className="font-display text-sm tracking-[0.25em] text-primary animate-blink sm:text-base sm:tracking-[0.32em]">
          SAVE THE DATE · MINAS GERAIS
        </span>
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-blink" />
      </div>
    </div>
  );
}

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbza1l6D86cp83vtFp6-cNLQ-R7curNXp0DlxeGvJNzkcQH9Bpf4IENR8Y_X2r1TlbzH3w/exec";
const WHATSAPP_NUMBER = "5531985931115";
type FormData = { nome: string; whatsapp: string; cidade: string };

function RegistrationForm({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [data, setData] = useState<FormData>({ nome: "", whatsapp: "", cidade: "" });
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cidade, setCidade] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("loading");
    const stored = JSON.parse(localStorage.getItem("inscricoes") ?? "[]");
    stored.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("inscricoes", JSON.stringify(stored));
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          whatsapp: data.whatsapp,
          cidade: data.cidade,
          data: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
        }),
      });
    } catch {
      console.log("erro");
    }
    const msg = encodeURIComponent(
      `🟢 *Nova inscrição — Lançamento Biancardine*\n\n👤 *Nome:* ${data.nome}\n*WhatsApp:* ${data.whatsapp}\n*Cidade:* ${data.cidade}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setState("idle");
    setTimeout(() => setData({ nome: "", whatsapp: "", cidade: "" }), 6000);
  };

  return (
    <div id={id} className="card-surface rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/40">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          Vagas limitadas
        </span>
      </div>
      <h3 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
        Garanta sua cadeira <span className="text-glow">gratuitamente</span>
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Confirmação imediata no WhatsApp · Leva 15 segundos
      </p>
      {state === "done" ? (
        <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-5 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-semibold text-foreground">
            {name ? `${name.split(" ")[0]}, sua cadeira está reservada!` : "Cadeira reservada!"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enviamos a confirmação para o seu WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field
            label="Nome completo"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <Field
            label="Cidade"
            type="text"
            required
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />

          <Field
            label="WhatsApp com código do país"
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            autoComplete="tel"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="btn-cta btn-blink mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold uppercase tracking-wider disabled:opacity-70"
          >
            {state === "loading" ? "Reservando..." : "Reservar minha cadeira gratuitamente"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" />
            Seus dados são protegidos pela LGPD e usados apenas para envio do ingresso.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        {...props}
        placeholder={label}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[52vh] sm:h-[60vh] lg:inset-0 lg:h-full"
      >
        <img
          src={heroDuo.url}
          alt=""
          className="h-full w-full object-contain object-top opacity-70 lg:object-cover lg:object-[75%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/70 lg:to-background/10" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 pt-[46vh] pb-14 sm:px-8 sm:pt-[54vh] lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16 lg:pb-24">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Pré-candidatura oficial · Deputado Federal
            </span>
          </div>
          <h1 className="mt-5 font-display text-[2.25rem] leading-[0.95] sm:text-6xl lg:text-7xl">
            Matheus Biancardine <span className="text-glow">lança sua pré-candidatura</span> a
            Deputado Federal
          </h1>
          <div className="mt-6 flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
              <Crown className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Presença confirmada
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground sm:text-base">
                Governador Mateus Simões e diversas lideranças mineiras
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Um ato oficial de quem acredita em uma{" "}
            <strong className="text-foreground">Minas Gerais transformada</strong> — com a{" "}
            <strong className="text-foreground">
              presença confirmada do Governador Mateus Simões
            </strong>
            , de diversas lideranças mineiras e das pautas que realmente importam para o futuro do
            nosso estado: segurança, oportunidade, desburocratização e respeito ao dinheiro público.
          </p>
          <ul className="mt-7 space-y-3 text-sm sm:text-base">
            <InfoRow icon={<Calendar className="h-4 w-4" />} text="Sexta · 25 de Julho · 19h" />
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              text="(Antigo) Cine Odeon — Av. do Contorno, 1328 · Floresta · BH"
            />
            <InfoRow
              icon={<Ticket className="h-4 w-4" />}
              text="Gratuito · Inscrição obrigatória"
            />
          </ul>
          <div className="mt-8 max-w-lg">
            <Countdown />
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
            <span className="font-semibold text-primary">Assentos limitados</span>
            <span className="text-muted-foreground">— poucas confirmações restantes.</span>
          </div>
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <RegistrationForm id="inscricao" />
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 text-foreground/90">{text}</span>
    </li>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative border-y border-primary/20 bg-background py-4 overflow-hidden">
      <div className="flex w-max animate-marquee gap-10">
        {items.map((t, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 font-display text-lg tracking-wider text-foreground/85"
          >
            <Star className="h-4 w-4 fill-primary text-primary" />
            {t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

function ManifestoSection() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl leading-[0.95] sm:text-6xl">
          O futuro de Minas <span className="text-glow">não será decidido por quem se cala.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Se você acredita em menos privilégios e menos burocracia para quem trabalha — este é o ato
          que você não pode perder.
        </p>
        <a
          href="#inscricao"
          className="btn-cta btn-blink mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-bold uppercase tracking-wider"
        >
          Reservar minha cadeira gratuitamente
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    icon: Crown,
    title: "Governador Mateus Simões",
    body: "Presença confirmada do Governador de Minas Gerais no ato de lançamento.",
  },
  {
    icon: Target,
    title: "Pré-candidatura oficial",
    body: "Ato de lançamento da pré-candidatura de Matheus Biancardine a Deputado Federal.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e privilégio zero",
    body: "Leis fortes contra o crime, fim dos privilégios e respeito ao dinheiro público.",
  },
  {
    icon: Briefcase,
    title: "Trabalho e desburocratização",
    body: "Menos burocracia para quem empreende, gera emprego e movimenta Minas.",
  },
  {
    icon: Landmark,
    title: "Patrimônio e identidade mineira",
    body: "Defesa da cultura, do patrimônio histórico e da identidade das nossas regiões.",
  },
  {
    icon: Users,
    title: "Lideranças mineiras",
    body: "Diversas lideranças de Minas reunidas para debater as pautas que transformam o estado.",
  },
  {
    icon: Rocket,
    title: "Você na história desde o dia 1",
    body: "Faça parte do movimento antes da campanha oficial começar.",
  },
];

function BenefitsSection() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl sm:text-5xl">
          O que você encontra no <span className="text-glow">lançamento</span>
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="card-surface group rounded-2xl p-6 transition hover:border-primary/50 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition group-hover:bg-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl tracking-wide">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  const mapSrc =
    "https://maps.google.com/maps?q=Av.%20do%20Contorno%2C%201328%2C%20Floresta%2C%20Belo%20Horizonte&t=&z=15&ie=UTF8&iwloc=&output=embed";
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-4xl sm:text-5xl">
          Como <span className="text-glow">chegar</span>
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          (Antigo) Cine Odeon · Av. do Contorno, 1328 · Floresta · BH
        </p>
        <div className="card-surface mt-8 overflow-hidden rounded-2xl">
          <iframe
            title="Mapa do local"
            src={mapSrc}
            loading="lazy"
            className="h-[320px] w-full sm:h-[420px]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Av.+do+Contorno,+1328,+Floresta,+Belo+Horizonte+-+MG"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            <MapPin className="h-4 w-4" /> Abrir no Google Maps
          </a>
          <a
            href="https://waze.com/ul?q=Av.%20do%20Contorno%2C%201328%2C%20Floresta%2C%20Belo%20Horizonte"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            <MapPin className="h-4 w-4" /> Abrir no Waze
          </a>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "O evento é gratuito?",
    a: "Sim, 100% gratuito. Basta se inscrever para garantir sua cadeira.",
  },
  {
    q: "É a pré-candidatura oficial do Matheus Biancardine?",
    a: "Sim, este é o ato oficial de lançamento da pré-candidatura a Deputado Federal.",
  },
  {
    q: "Preciso levar documento?",
    a: "Não há necessidade de documento para entrada, mas para qualquer eventualidade, é bom levar.",
  },
  {
    q: "Posso levar acompanhantes?",
    a: "Sim, mas cada acompanhante precisa da sua própria inscrição — as vagas são individuais.",
  },
  {
    q: "Tem estacionamento?",
    a: "Há estacionamentos rotativos na região da Floresta, a poucos passos do local.",
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-4xl sm:text-5xl">
          Perguntas <span className="text-glow">frequentes</span>
        </h2>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card-surface overflow-hidden rounded-2xl transition">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4"
                >
                  <span className="font-semibold text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-xl">
        <RegistrationForm id="inscricao-final" />
        <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Vagas limitadas — não fique de fora do lançamento oficial.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-5 text-xs leading-relaxed text-muted-foreground">
        <p className="text-center font-semibold text-foreground/90">
          Conteúdo informativo de pré-campanha, elaborado em conformidade com a legislação eleitoral
          vigente.
        </p>
        <div>
          <p className="font-semibold uppercase tracking-wider text-primary">
            Informação Político-Institucional
          </p>
          <p className="mt-1">
            Conteúdo informativo de pré-campanha eleitoral de Matheus Biancardine Mota,
            pré-candidato a Deputado Federal pelo estado de Minas Gerais, em estrita conformidade
            com o artigo 36-A da Lei nº 9.504/1997. Este material não configura propaganda eleitoral
            antecipada, sendo vedado qualquer pedido explícito de voto.
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-primary">
            Privacidade e Dados (LGPD)
          </p>
          <p className="mt-1">
            Ao fornecer seu nome e contato, você autoriza o recebimento de informações relacionadas
            ao evento de lançamento, prestação de contas, ideias e agendas do pré-candidato. Seus
            dados estão protegidos e não serão compartilhados indevidamente.
          </p>
        </div>
        <p className="pt-2 text-center text-[11px]">
          © 2026 Matheus Biancardine Mota · Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function LandingPage() {
  useMemo(() => EVENT_DATE, []);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SaveTheDateBar />
      <Hero />
      <Marquee />
      <ManifestoSection />
      <BenefitsSection />
      <LocationSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  );
}

export default LandingPage;
