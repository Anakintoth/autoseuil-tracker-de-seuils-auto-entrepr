'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMsg {
  role: 'user' | 'ai';
  text: string;
  thinking?: boolean;
}

const SUGGESTIONS = [
  "Je gagne 30 000 € en services. Suis-je imposable à la TVA ?",
  "Que se passe-t-il si je dépasse 77 700 € ?",
  "Quels seuils s'appliquent à la vente de produits ?",
];

function AIAdvisor() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: "Bonjour ! Je suis votre conseiller SeuilNet. Posez-moi toutes vos questions sur les seuils de TVA et de chiffre d'affaires pour auto-entrepreneurs.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }, { role: 'ai', text: '', thinking: true }]);
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'ai', text: data.result || 'Aucune réponse obtenue.' };
        return next;
      });
    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'ai', text: 'Service momentanément indisponible. Réessayez dans quelques instants.' };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(45,106,79,0.08)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)' }}>🤖</div>
        <div>
          <p className="font-semibold text-sm">Conseiller SeuilNet</p>
          <p className="text-xs" style={{ color: '#52B788' }}>● En ligne — seuils 2026</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 p-6 overflow-y-auto" style={{ minHeight: 280, maxHeight: 340 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.thinking ? (
              <div className="chat-bubble-ai thinking">En réflexion...</div>
            ) : m.role === 'ai' ? (
              <div className="chat-bubble-ai">{m.text}</div>
            ) : (
              <div className="chat-bubble-user">{m.text}</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 px-6 pb-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{ borderColor: '#2D6A4F30', color: '#52B788', background: '#2D6A4F10' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 px-6 pb-5">
        <input
          className="input-glow flex-1"
          placeholder="Posez votre question fiscale..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
          style={{ padding: '11px 16px', borderRadius: '10px' }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{ padding: '11px 22px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          <span>{loading ? '...' : 'Envoyer'}</span>
        </button>
      </div>
    </div>
  );
}

function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  }
  return (
    <div ref={ref} className={`spotlight-card ${className}`} onMouseMove={onMove}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen noise">

      {/* ═══ Navbar ═══ */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span className="text-lg font-bold tracking-tight">SeuilNet</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm" style={{ color: '#9ca3af' }}>
            <a href="#features" className="hover:text-white transition-colors duration-200">Fonctionnalités</a>
            <a href="#advisor" className="hover:text-white transition-colors duration-200">Conseiller IA</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Tarifs</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </div>
          <a href="#pricing" className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.875rem', borderRadius: '10px' }}>
            <span>Commencer</span>
          </a>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-bg absolute inset-0 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="badge mb-8 reveal">
            ✨ Seuils 2026 mis à jour
          </div>

          <h1 className="font-extrabold mb-6 leading-[1.08] tracking-tight reveal reveal-d1"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}>
            <span className="gradient-text">Maîtrisez vos seuils.</span>
            <br />
            <span style={{ color: '#e2e8f0' }}>Pilotez votre activité.</span>
          </h1>

          <p className="text-xl mb-3 max-w-2xl mx-auto leading-relaxed reveal reveal-d2"
            style={{ color: '#94a3b8' }}>
            SeuilNet surveille automatiquement vos seuils de TVA et de chiffre d&apos;affaires
            et vous alerte avant tout dépassement fiscal.
          </p>
          <p className="text-sm mb-10 reveal reveal-d2" style={{ color: '#6b7280' }}>
            Conçu pour les auto-entrepreneurs · Mis à jour chaque année · 100 % en français
          </p>

          <div className="flex gap-4 justify-center flex-wrap reveal reveal-d3">
            <a href="#pricing" className="btn-primary">
              <span>📊 Commencer gratuitement</span>
            </a>
            <a href="#advisor" className="btn-secondary">Tester le conseiller IA</a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 flex justify-center gap-10 flex-wrap reveal reveal-d4">
            {[
              { v: '500+', l: 'auto-entrepreneurs' },
              { v: '4.9/5', l: 'satisfaction client' },
              { v: '0 €', l: 'pour commencer' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="stat-val">{s.v}</div>
                <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UI Mockup — Threshold Dashboard ═══ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="card glow reveal" style={{ padding: 0, overflow: 'hidden', border: '1px solid #2D6A4F25' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ background: '#0C1A12', borderColor: '#2D6A4F18' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#f85149' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#d29922' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#3fb950' }} />
              <div className="ml-4 flex-1 rounded-md px-3 py-1 text-xs flex items-center gap-2" style={{ background: '#0D1F17', color: '#6b7280', maxWidth: 220 }}>
                <span style={{ color: '#3fb950' }}>🔒</span> app.seuilnet.fr
              </div>
            </div>
            {/* Dashboard content */}
            <div className="p-7" style={{ background: '#0A1710' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#52B788' }}>Exercice 2026</p>
                  <p className="text-lg font-bold">Tableau de bord</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#2D6A4F15', color: '#52B788', border: '1px solid #2D6A4F25' }}>
                  ✓ À jour
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TVA Card */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(45,106,79,0.08)', border: '1px solid #2D6A4F18' }}>
                  <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>Franchise TVA — Prestations</p>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-2xl font-bold">22 400 <span className="text-sm font-normal" style={{ color: '#6b7280' }}>€</span></span>
                    <span className="text-xs font-semibold" style={{ color: '#52B788' }}>60.9 %</span>
                  </div>
                  <div className="gauge-track">
                    <div className="gauge-fill gauge-fill-primary" style={{ width: '60.9%' }} />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#6b7280' }}>Seuil : 36 800 € · Marge : 14 400 €</p>
                </div>

                {/* CA Card */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(244,162,97,0.06)', border: '1px solid #F4A26118' }}>
                  <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>Plafond Micro-BNC</p>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-2xl font-bold">57 200 <span className="text-sm font-normal" style={{ color: '#6b7280' }}>€</span></span>
                    <span className="text-xs font-semibold" style={{ color: '#F4A261' }}>73.6 %</span>
                  </div>
                  <div className="gauge-track">
                    <div className="gauge-fill gauge-fill-accent" style={{ width: '73.6%' }} />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#6b7280' }}>Seuil : 77 700 € · Marge : 20 500 €</p>
                </div>

                {/* Projection */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Projection annuelle</p>
                  <p className="text-xl font-bold mb-0.5">68 400 €</p>
                  <p className="text-xs" style={{ color: '#52B788' }}>✓ En dessous du plafond</p>
                </div>

                {/* Alert */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(244,162,97,0.05)', border: '1px solid #F4A26118' }}>
                  <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Prochaine alerte</p>
                  <p className="text-xl font-bold mb-0.5">85 %</p>
                  <p className="text-xs" style={{ color: '#F4A261' }}>⚠ Notification active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Features ═══ */}
      <section id="features" className="py-28 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">Fonctionnalités</div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Tout ce qu&apos;il faut pour<br />
              <span className="gradient-text">ne jamais être pris de court</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6b7280' }}>
              Des outils pensés pour les auto-entrepreneurs, pas pour les comptables.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: '📈',
                title: 'Suivi en temps réel',
                desc: 'Visualisez l\'évolution de votre chiffre d\'affaires face aux seuils légaux BNC, BIC et TVA sur un dashboard clair et intuitif.',
                d: 'reveal-d1',
              },
              {
                icon: '🔔',
                title: 'Alertes intelligentes',
                desc: 'Recevez des notifications par e-mail dès que vous approchez d\'un seuil. Configurez les niveaux d\'alerte selon votre confort.',
                d: 'reveal-d2',
              },
              {
                icon: '🔮',
                title: 'Projection annuelle',
                desc: 'Estimez automatiquement votre CA en fin d\'année selon votre rythme actuel, pour anticiper les dépassements bien à l\'avance.',
                d: 'reveal-d3',
              },
              {
                icon: '🧾',
                title: 'Export comptable',
                desc: 'Téléchargez un récapitulatif PDF de votre année ou exportez vos données vers les principales plateformes comptables françaises.',
                d: 'reveal-d4',
              },
            ].map((f, i) => (
              <SpotlightCard key={i} className={`reveal ${f.d}`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="leading-relaxed" style={{ color: '#9ca3af' }}>{f.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ AI Advisor ═══ */}
      <section id="advisor" className="py-28 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="badge mb-6">Conseiller IA</div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
                Vos questions fiscales,<br />
                <span className="gradient-text">répondues en secondes</span>
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>
                Notre assistant intelligent connaît tous les seuils 2026 : franchise TVA, micro-BNC, micro-BIC,
                seuils majorés. Posez vos questions en langage naturel.
              </p>
              <ul className="space-y-3">
                {[
                  'Seuils 2026 intégrés et mis à jour',
                  'Réponses personnalisées à votre situation',
                  'Disponible 24h/24 sans rendez-vous',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#d1fae5' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: '#2D6A4F20', color: '#52B788', border: '1px solid #2D6A4F30' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal reveal-d2">
              <AIAdvisor />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Pricing ═══ */}
      <section id="pricing" className="py-28 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">Tarifs</div>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Simple et transparent</h2>
            <p style={{ color: '#6b7280' }}>Commencez gratuitement. Évoluez quand vous êtes prêt.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Free */}
            <div className="card text-center reveal reveal-d1">
              <h3 className="font-bold text-lg mb-2">Découverte</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">0</span>
                <span className="text-base" style={{ color: '#6b7280' }}> €</span>
              </div>
              <p className="text-sm mb-7" style={{ color: '#6b7280' }}>Pour toujours</p>
              <ul className="text-sm space-y-3 mb-8 text-left" style={{ color: '#9ca3af' }}>
                {[
                  'Tableau de bord de base',
                  'Suivi 1 activité',
                  'Alertes email simples',
                  'Seuils 2026 intégrés',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#2D6A4F' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-secondary" style={{ display: 'block', width: '100%', fontSize: '0.875rem', padding: '11px 0' }}>
                Commencer
              </a>
            </div>

            {/* Pro */}
            <div className="gradient-border text-center relative reveal reveal-d2 md:-mt-5"
              style={{ background: 'rgba(255,255,255,0.035)', padding: '28px', borderRadius: '20px' }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: 'white' }}>
                POPULAIRE
              </div>
              <h3 className="font-bold text-lg mb-2 mt-2">Pilote</h3>
              <div className="mb-1">
                <span className="text-5xl font-extrabold">6.99</span>
                <span className="text-base" style={{ color: '#6b7280' }}> €</span>
              </div>
              <p className="text-sm mb-7" style={{ color: '#6b7280' }}>/ mois, sans engagement</p>
              <ul className="text-sm space-y-3 mb-8 text-left" style={{ color: '#d1fae5' }}>
                {[
                  'Tout du plan Découverte',
                  'Activités illimitées',
                  'Alertes multi-niveaux',
                  'Projection annuelle avancée',
                  'Export PDF & CSV',
                  'Conseiller IA inclus',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#52B788' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-primary" style={{ display: 'block', width: '100%', fontSize: '0.875rem', padding: '13px 0' }}>
                <span>Souscrire</span>
              </a>
            </div>

            {/* Enterprise */}
            <div className="card text-center reveal reveal-d3">
              <h3 className="font-bold text-lg mb-2">Expert</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">19.99</span>
                <span className="text-base" style={{ color: '#6b7280' }}> €</span>
              </div>
              <p className="text-sm mb-7" style={{ color: '#6b7280' }}>/ mois</p>
              <ul className="text-sm space-y-3 mb-8 text-left" style={{ color: '#9ca3af' }}>
                {[
                  'Tout du plan Pilote',
                  'Multi-utilisateurs (équipe)',
                  'Intégration comptable directe',
                  'SLA prioritaire garanti',
                  'Onboarding personnalisé',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#2D6A4F' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-secondary" style={{ display: 'block', width: '100%', fontSize: '0.875rem', padding: '11px 0' }}>
                Contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Testimonials ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">Témoignages</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "Grâce à SeuilNet, j'ai reçu une alerte juste avant de dépasser le seuil TVA. Ça m'a évité une régularisation catastrophique. Outil indispensable.",
                name: 'Camille Renard',
                role: 'Graphiste freelance · Bordeaux',
                init: 'CR',
                d: 'reveal-d1',
              },
              {
                text: "La projection annuelle est vraiment bien faite. En juillet, je savais déjà si j'allais passer sous les seuils. Ça change la façon de piloter son activité.",
                name: 'Thomas Mercier',
                role: 'Développeur web indépendant',
                init: 'TM',
                d: 'reveal-d2',
              },
              {
                text: "Simple, clair, en français sans jargon comptable. J'avais peur de la fiscalité auto-entrepreneur — SeuilNet m'a donné une vraie tranquillité d'esprit.",
                name: 'Sophie Dufresne',
                role: 'Coach professionnelle certifiée',
                init: 'SD',
                d: 'reveal-d3',
              },
            ].map((t, i) => (
              <div key={i} className={`card reveal ${t.d}`}>
                <div className="stars mb-3">★★★★★</div>
                <p className="italic mb-5 leading-relaxed" style={{ color: '#cbd5e1' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F20, #52B78820)', color: '#52B788', border: '1px solid #2D6A4F25' }}>
                    {t.init}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">FAQ</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Quels seuils SeuilNet surveille-t-il exactement ?',
                a: 'SeuilNet suit en temps réel les seuils 2026 : franchise TVA services (36 800 € / seuil majoré 39 100 €), franchise TVA ventes (91 900 € / seuil majoré 101 000 €), plafond micro-BNC (77 700 €) et plafond micro-BIC (188 700 €).',
                d: 'reveal-d1',
              },
              {
                q: 'Mes données financières sont-elles sécurisées ?',
                a: 'Oui. Toutes vos données sont chiffrées (AES-256) et hébergées sur des serveurs en France. Nous ne partageons jamais vos informations avec des tiers et respectons le RGPD.',
                d: 'reveal-d2',
              },
              {
                q: 'Puis-je utiliser SeuilNet sans connaissances comptables ?',
                a: 'Absolument. SeuilNet est conçu pour être accessible à tous. Chaque seuil est expliqué en langage simple, et notre conseiller IA répond à vos questions fiscales en temps réel.',
                d: 'reveal-d3',
              },
              {
                q: 'Le plan Découverte est-il vraiment gratuit pour toujours ?',
                a: 'Oui, sans limitation de durée. Vous pouvez suivre une activité et recevoir des alertes basiques gratuitement. Le plan Pilote débloque les fonctionnalités avancées et le conseiller IA.',
                d: 'reveal-d4',
              },
            ].map((item, i) => (
              <details key={i} className={`card group cursor-pointer reveal ${item.d}`} style={{ padding: '20px 24px' }}>
                <summary className="font-semibold list-none flex justify-between items-center gap-4">
                  <span>{item.q}</span>
                  <span className="flex-shrink-0 group-open:rotate-45 transition-transform duration-300 text-xl" style={{ color: '#52B788' }}>+</span>
                </summary>
                <p className="mt-4 leading-relaxed" style={{ color: '#9ca3af' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center reveal">
          <div className="cta-glow-border glow">
            <div className="card" style={{ borderRadius: '24px', padding: '52px 40px', border: 'none', background: 'rgba(13,31,23,0.95)' }}>
              <span className="text-5xl mb-6 block">📊</span>
              <h2 className="text-3xl font-extrabold mb-4 tracking-tight">
                Prêt à ne plus jamais<br />
                <span className="gradient-text">être pris de court ?</span>
              </h2>
              <p className="mb-8 max-w-md mx-auto leading-relaxed" style={{ color: '#9ca3af' }}>
                Rejoignez 500+ auto-entrepreneurs qui pilotent leur activité sereinement avec SeuilNet.
              </p>
              <a href="#pricing" className="btn-primary" style={{ fontSize: '1.05rem', padding: '15px 36px' }}>
                <span>Commencer gratuitement — 0 €</span>
              </a>
              <p className="text-xs mt-4" style={{ color: '#4b5563' }}>Sans carte bancaire · Sans engagement · Annulable à tout moment</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="glass py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <span className="font-bold tracking-tight">SeuilNet</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#2D6A4F15', color: '#52B788', border: '1px solid #2D6A4F25' }}>2026</span>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: '#6b7280' }}>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm" style={{ color: '#4b5563' }}>© 2026 SeuilNet — Tous droits réservés</p>
        </div>
      </footer>
    </main>
  );
}
