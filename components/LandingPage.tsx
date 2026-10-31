"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/rodriguesturpb/";

const scenes = [
  {
    title: "Sol, sal e boas hist\u00f3rias",
    category: "P\u00e9 na areia",
    location: "Porto de Galinhas, PE",
    image: "https://images.unsplash.com/photo-1768486173251-95f16f855830?auto=format&fit=crop&w=1600&q=82",
    fallback: "/scenes/coast.svg",
  },
  {
    title: "Caminhos que surpreendem",
    category: "Novos lugares",
    location: "Gramado, RS",
    image: "/gramado.jpg",
    fallback: "/scenes/hills.svg",
  },
  {
    title: "O melhor de estar por a\u00ed",
    category: "Perto da natureza",
    location: "Jo\u00e3o Pessoa, PB",
    image: "https://images.unsplash.com/photo-1732216467230-42ce323767a8?auto=format&fit=crop&w=1600&q=82",
    fallback: "/scenes/coast.svg",
  },
];

const destinations = [
  {
    number: "01",
    category: "SOL & MAR",
    city: "Porto de Galinhas",
    state: "Pernambuco",
    description: "Um convite para desacelerar diante do azul.",
    image: "https://images.unsplash.com/photo-1768486173279-22c3d418bfaf?auto=format&fit=crop&w=1050&q=80",
    fallback: "/scenes/coast.svg",
    variant: "coast",
  },
  {
    number: "02",
    category: "CHARME & CULTURA",
    city: "Gramado",
    state: "Rio Grande do Sul",
    description: "Pequenos detalhes, grandes lembran\u00e7as.",
    image: "/gramado.jpg",
    fallback: "/scenes/hills.svg",
    variant: "town",
  },
  {
    number: "03",
    category: "LITORAL & ENCANTOS",
    city: "Jo\u00e3o Pessoa",
    state: "Para\u00edba",
    description: "Dias de sol e uma cidade para sentir de perto.",
    image: "https://images.unsplash.com/photo-1732216467230-42ce323767a8?auto=format&fit=crop&w=1050&q=80",
    fallback: "/scenes/coast.svg",
    variant: "sea",
  },
];

const travelStyles = [
  "Sol e praia",
  "Serra e natureza",
  "Cidades e cultura",
  "Um pouco de tudo",
];

const periods = [
  "Ainda n\u00e3o decidi",
  "Nos pr\u00f3ximos 3 meses",
  "Daqui a 3 a 6 meses",
  "Daqui a mais de 6 meses",
];

const companies = [
  "S\u00f3 eu",
  "Em casal",
  "Fam\u00edlia",
  "Amigos / grupo",
];

function photoStyle(image: string, fallback: string, overlay = "") {
  return {
    backgroundImage: `${overlay ? `${overlay}, ` : ""}url("${image}"), url("${fallback}")`,
  };
}

function createMessage(style: string, period: string, company: string) {
  return (
    "Ol\u00e1, Rodrigues Tur! Vi o site e gostaria de saber sobre possibilidades de viagem.\n" +
    `Meu estilo: ${style}.\n` +
    `Quando quero viajar: ${period}.\n` +
    `Vou viajar: ${company}.\n` +
    "Podem me ajudar com as op\u00e7\u00f5es dispon\u00edveis?"
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand ${light ? "brand--light" : ""}`} href="#inicio" aria-label="Rodrigues Tur - voltar ao início">
      {/* The original Rodrigues Tur logo is supplied by the project owner. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Rodrigues Tur" width="151" height="50" />
    </a>
  );
}

export default function LandingPage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState(travelStyles[0]);
  const [period, setPeriod] = useState(periods[0]);
  const [company, setCompany] = useState(companies[1]);
  const [plannerCopy, setPlannerCopy] = useState<{ text: string; success: boolean } | null>(null);
  const [destinationCopy, setDestinationCopy] = useState<{ city: string; text: string; success: boolean } | null>(null);
  const copyOperationRef = useRef(0);
  const copyQueueRef = useRef<Promise<void> | null>(null);

  const scene = scenes[sceneIndex];
  const message = createMessage(style, period, company);
  const copyStatus = plannerCopy?.text === message ? (plannerCopy.success ? "success" : "error") : "idle";

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (document.activeElement?.closest("#mobile-navigation")) {
          document.querySelector<HTMLAnchorElement>(".desktop-nav a")?.focus();
        }
        setMobileMenuOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("has-js");
    const observed = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    observed.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-js");
    };
  }, []);

  function handleSceneChange(index: number) {
    setSceneIndex((index + scenes.length) % scenes.length);
  }

  async function copyText(text: string) {
    try {
      if (!navigator.clipboard?.writeText) return false;
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  function requestCopy(text: string, onComplete: (success: boolean) => void) {
    const operation = ++copyOperationRef.current;
    setPlannerCopy(null);
    setDestinationCopy(null);
    const run = async () => {
      if (operation !== copyOperationRef.current) return;
      const success = await copyText(text);
      if (operation === copyOperationRef.current) onComplete(success);
    };
    // Keep writes ordered as well as feedback: an older clipboard write cannot
    // complete after the latest one and replace the visitor's final message.
    const pending = copyQueueRef.current;
    const task = pending ? pending.then(run, run) : run();
    copyQueueRef.current = task;
    const clear = () => {
      if (copyQueueRef.current === task) copyQueueRef.current = null;
    };
    void task.then(clear, clear);
  }

  function handleDestinationClick(destination: string) {
    const text = `Ol\u00e1, Rodrigues Tur! Vi ${destination} na galeria de inspira\u00e7\u00f5es do site. Voc\u00eas t\u00eam alguma viagem ou roteiro dispon\u00edvel para esse destino?`;
    requestCopy(text, (success) => setDestinationCopy({ city: destination, text, success }));
  }

  const navigation = [
    { label: "Inspira\u00e7\u00f5es", href: "#destinos" },
    { label: "Nossa ess\u00eancia", href: "#sobre" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "D\u00favidas", href: "#duvidas" },
  ];

  return (
    <>
      <div className="topline">
        <div className="shell topline__inner">
          <span><span className="topline__star">&#10022;</span> VIAJAR &Eacute; COLECIONAR NOVAS HIST&Oacute;RIAS</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            ACOMPANHE @RODRIGUESTURPB <Icon name="arrow-up-right" size={12} />
          </a>
        </div>
      </div>

      <header className="site-header" id="inicio">
        <div className="shell site-header__inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <a className="header-cta" href="#planejar">Planejar minha viagem <Icon name="arrow-up-right" size={16} /></a>
          <button
            className="mobile-menu-button"
            ref={menuButtonRef}
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={25} />
          </button>
        </div>
        <nav id="mobile-navigation" className={`mobile-nav ${mobileMenuOpen ? "mobile-nav--open" : ""}`} aria-label="Navegação mobile" inert={!mobileMenuOpen}>
          {navigation.map((item) => <a href={item.href} key={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}<Icon name="arrow-up-right" size={16} /></a>)}
          <a href="#planejar" onClick={() => setMobileMenuOpen(false)}>Planejar minha viagem <Icon name="arrow-up-right" size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero__grid">
            <div className="hero__content">
              <div className="eyebrow hero__eyebrow"><span className="eyebrow__line" /> PARA QUEM NASCEU PARA EXPLORAR</div>
              <h1 id="hero-title">O mundo &eacute; grande.<br /><em>Viva</em> cada<br />peda&ccedil;o dele<span className="hero__period">.</span></h1>
              <p className="hero__lead">Tem lugares que a gente conhece. E tem lugares que ficam na gente. Sua pr&oacute;xima hist&oacute;ria come&ccedil;a aqui.</p>
              <div className="hero__actions">
                <a className="button button--primary" href="#destinos">Explore possibilidades <Icon name="arrow-up-right" size={18} /></a>
                <a className="text-link" href="#como-funciona">Como funciona <Icon name="arrow-right" size={18} /></a>
              </div>
              <div className="hero__bottom">
                <span className="hero__bottom-mark"><Icon name="compass" size={22} /></span>
                <div><strong>Seu destino, seu ritmo.</strong><span>As melhores viagens t&ecirc;m a sua cara.</span></div>
              </div>
              <span className="hero__microtext" aria-hidden="true">COMECE AQUI / RODRIGUES TUR</span>
            </div>
            <div className="hero__visual">
              <div key={scene.image} className="hero__photo" id="scene-panel" role="tabpanel" aria-labelledby={`scene-tab-${sceneIndex}`} style={photoStyle(scene.image, scene.fallback, "linear-gradient(180deg, rgba(11,44,37,.05) 30%, rgba(7,31,27,.42) 100%)")}><span className="sr-only">Imagem ilustrativa: {scene.location}</span></div>
              <div className="hero__orbit" aria-hidden="true"><span>GO</span><Icon name="arrow-up-right" size={31}/></div>
              <div className="hero__photo-top"><span className="hero__location-dot" /> {scene.location}</div>
              <div className="hero__photo-bottom">
                <div><span>UMA NOVA HIST&Oacute;RIA</span><strong>{scene.title}</strong></div>
                <span className="hero__photo-count">0{sceneIndex + 1} <span>/ 0{scenes.length}</span></span>
              </div>
              <div className="hero__slide-tabs" role="tablist" aria-label="Escolher estilo de destino">
                {scenes.map((item, index) => (
                  <button
                    key={item.category}
                    id={`scene-tab-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={sceneIndex === index}
                    aria-controls="scene-panel"
                    tabIndex={sceneIndex === index ? 0 : -1}
                    className={sceneIndex === index ? "hero__tab hero__tab--active" : "hero__tab"}
                    onClick={() => handleSceneChange(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") { event.preventDefault(); handleSceneChange(index + 1); document.getElementById(`scene-tab-${(index + 1) % scenes.length}`)?.focus(); }
                      if (event.key === "ArrowLeft") { event.preventDefault(); handleSceneChange(index - 1); document.getElementById(`scene-tab-${(index - 1 + scenes.length) % scenes.length}`)?.focus(); }
                    }}
                  ><span className="hero__tab-number">0{index + 1}</span>{item.category}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="hero__scroll shell"><a href="#destinos">ROLE PARA DESCOBRIR <span className="scroll-arrow">&#8595;</span></a></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {Array.from({ length: 4 }, (_, index) => <span className="marquee__set" key={index}>VIAJE MAIS <span>&#10022;</span> SINTA MAIS <span>&#10022;</span> VIVA MAIS <span>&#10022;</span> DESCUBRA MAIS <span>&#10022;</span> </span>)}
          </div>
        </div>

        <section className="destinations section" id="destinos" aria-labelledby="destinos-title">
          <div className="shell">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow"><span className="eyebrow__line" /> UM MUNDO DE POSSIBILIDADES</p>
                <h2 id="destinos-title">Pra onde a sua <em>curiosidade</em><br />vai te levar?</h2>
              </div>
              <div className="section-heading__aside">
                <p>Um gostinho de tudo que existe por a&iacute;. Explore ideias e descubra qual destino combina com a sua pr&oacute;xima viagem.</p>
                <span className="subtle-note"><Icon name="sparkles" size={16} /> Destinos ilustrativos, consulte disponibilidade.</span>
              </div>
            </div>
            <div className="destination-grid">
              {destinations.map((destination) => (
                <article className={`destination-card destination-card--${destination.variant}`} data-reveal key={destination.city}>
                  <div className="destination-card__image" style={photoStyle(destination.image, destination.fallback, "linear-gradient(180deg, rgba(6,38,32,.03), rgba(6,38,32,.5))")}>
                    <span className="sr-only" role="img" aria-label={`Vista ilustrativa de ${destination.city}`} />
                    <span className="destination-card__category">{destination.category}</span>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="destination-card__circle"
                      aria-label={`Consultar ${destination.city} pelo Instagram`}
                      onClick={() => handleDestinationClick(destination.city)}
                    ><Icon name="arrow-up-right" size={24} /></a>
                    <span className="destination-card__image-number">{destination.number} / 03</span>
                  </div>
                  <div className="destination-card__details">
                    <div><span className="destination-card__state"><Icon name="map-pin" size={14} /> {destination.state}</span><h3>{destination.city}</h3><p>{destination.description}</p></div>
                    <span className="destination-card__line" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
            <div className="destination-footer" data-reveal>
              <div role="status" aria-live="polite">
                <span>{destinationCopy ? (destinationCopy.success ? `Mensagem sobre ${destinationCopy.city} copiada. Abra a conversa no Instagram e cole.` : "Não foi possível copiar automaticamente. Selecione a mensagem abaixo para copiar.") : "Tem outro destino em mente? A conversa também começa por aqui."}</span>
                {destinationCopy && !destinationCopy.success && <p className="destination-message">{destinationCopy.text}</p>}
              </div>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underlined-link">Fale com a Rodrigues Tur <Icon name="arrow-up-right" size={19} /></a>
            </div>
          </div>
        </section>

        <section className="story section" id="sobre" aria-labelledby="story-title">
          <div className="shell story__grid">
            <div className="story__visual" data-reveal>
              <div className="story__image" role="img" aria-label="Paisagem de praia como inspiração para viajar" style={photoStyle("https://images.unsplash.com/photo-1515898958569-d1a4efff1384?auto=format&fit=crop&w=1300&q=80", "/scenes/coast.svg")} />
              <div className="story__stamp" aria-hidden="true"><Icon name="sun" size={31} /><span>O MUNDO<br />TE ESPERA</span></div>
              <div className="story__postcard"><span>&#10022; LEMBRETE DE VIAGEM</span><strong>O melhor souvenir<br />&eacute; a mem&oacute;ria.</strong></div>
            </div>
            <div className="story__content" data-reveal>
              <p className="eyebrow eyebrow--light"><span className="eyebrow__line" /> NOSSA ESS&Ecirc;NCIA</p>
              <h2 id="story-title">N&atilde;o &eacute; s&oacute; sobre <em>ir.</em><br />&Eacute; sobre tudo que voc&ecirc; <em>vive.</em></h2>
              <p className="story__lead">Acreditamos naquelas viagens que rendem conversas por anos. Nas descobertas inesperadas, nas fotos espont&acirc;neas e no prazer de sair da rotina.</p>
              <p className="story__lead story__lead--second">A Rodrigues Tur &eacute; o ponto de partida para transformar essa vontade de conhecer o mundo em um novo plano.</p>
              <div className="story__features">
                <div><Icon name="compass" size={24} /><span>Novos horizontes</span><small>Explore possibilidades</small></div>
                <div><Icon name="heart" size={24} /><span>Boas lembran&ccedil;as</span><small>Viva cada momento</small></div>
              </div>
              <a href="#planejar" className="button button--cream">Vamos planejar? <Icon name="arrow-up-right" size={19} /></a>
            </div>
          </div>
        </section>

        <section className="how section" id="como-funciona" aria-labelledby="how-title">
          <div className="shell">
            <div className="how__intro" data-reveal>
              <p className="eyebrow"><span className="eyebrow__line" /> MAIS SIMPLES DO QUE PARECE</p>
              <h2 id="how-title">Seu pr&oacute;ximo destino<br />come&ccedil;a com um <em>passo.</em></h2>
              <p>Uma forma leve de tirar a viagem do campo das ideias e come&ccedil;ar a organizar o que vem pela frente.</p>
            </div>
            <div className="steps">
              <article className="step" data-reveal><span className="step__number">01</span><div className="step__icon"><Icon name="compass" size={29}/></div><h3>Deixe a vontade falar</h3><p>Escolha o tipo de experi&ecirc;ncia que combina com voc&ecirc; e imagine o pr&oacute;ximo lugar.</p><div className="step__connector" aria-hidden="true" /></article>
              <article className="step" data-reveal><span className="step__number">02</span><div className="step__icon"><Icon name="message" size={29}/></div><h3>Conte seus planos</h3><p>Converse com a equipe para conhecer as op&ccedil;&otilde;es e informa&ccedil;&otilde;es atualizadas.</p><div className="step__connector" aria-hidden="true" /></article>
              <article className="step" data-reveal><span className="step__number">03</span><div className="step__icon"><Icon name="plane" size={29}/></div><h3>Prepare a sua hist&oacute;ria</h3><p>Combine os detalhes diretamente com a equipe e comece a contagem regressiva.</p></article>
            </div>
          </div>
        </section>

        <section className="planner section" id="planejar" aria-labelledby="planner-title">
          <div className="shell planner__grid">
            <div className="planner__intro" data-reveal>
              <p className="eyebrow eyebrow--light"><span className="eyebrow__line" /> SUA VIAGEM, DO SEU JEITO</p>
              <h2 id="planner-title">Qual &eacute; a sua <em>pr&oacute;xima</em><br />grande hist&oacute;ria?</h2>
              <p>Responda a tr&ecirc;s perguntinhas. Preparamos uma mensagem com as suas prefer&ecirc;ncias para facilitar o primeiro contato.</p>
              <div className="planner__scribble" aria-hidden="true"><svg viewBox="0 0 240 100" width="210" height="92" fill="none"><path d="M6 71c30 8 67 13 98-7 28-18 40-53 66-51 23 2 32 39 12 54-13 10-25-1-19-12 8-15 30 3 47 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 9"/><path d="m199 61 11 10-14 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg><Icon name="plane" size={31}/></div>
            </div>
            <div className="planner__card" data-reveal>
              <div className="planner__card-heading"><span><Icon name="sparkles" size={17}/> SEU PONTO DE PARTIDA</span><span className="planner__steps">01 &mdash; 03</span></div>
              <fieldset className="planner__fieldset">
                <legend><span>01</span> Qual tipo de viagem te chama?</legend>
                <div className="style-options" role="group" aria-label="Estilo de viagem">
                  {travelStyles.map((item) => <button type="button" key={item} className={style === item ? "choice choice--selected" : "choice"} aria-pressed={style === item} onClick={() => setStyle(item)}>{item}{style === item && <Icon name="check" size={16} />}</button>)}
                </div>
              </fieldset>
              <div className="planner__fields-row">
                <label className="planner__select-label"><span><span className="form-index">02</span> Para quando?</span><div className="select-wrap"><Icon name="calendar" size={17}/><select value={period} onChange={(event) => setPeriod(event.target.value)}>{periods.map((item) => <option key={item} value={item}>{item}</option>)}</select><Icon name="chevron-down" size={15}/></div></label>
                <label className="planner__select-label"><span><span className="form-index">03</span> Com quem?</span><div className="select-wrap"><Icon name="users" size={18}/><select value={company} onChange={(event) => setCompany(event.target.value)}>{companies.map((item) => <option key={item} value={item}>{item}</option>)}</select><Icon name="chevron-down" size={15}/></div></label>
              </div>
              <div className="planner__preview"><div><Icon name="message" size={16}/> PR&Eacute;VIA DA MENSAGEM</div><p>{message}</p></div>
              <a
                className="button button--primary planner__submit"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  requestCopy(message, (success) => setPlannerCopy({ text: message, success }));
                }}
              >Copiar pedido e abrir Instagram <Icon name="arrow-up-right" size={19}/></a>
              <p className={`planner__status ${copyStatus === "success" ? "planner__status--success" : ""}`} role="status" aria-live="polite">
                {copyStatus === "success" ? "Mensagem copiada! Basta colar no direct do Instagram." : copyStatus === "error" ? "N\u00e3o foi poss\u00edvel copiar automaticamente. Selecione a mensagem acima para copiar." : "O Instagram abre em outra aba. Nada ser\u00e1 enviado automaticamente."}
              </p>
            </div>
          </div>
        </section>

        <section className="faq section" id="duvidas" aria-labelledby="faq-title">
          <div className="shell faq__grid">
            <div data-reveal><p className="eyebrow"><span className="eyebrow__line" /> PERGUNTAS FREQUENTES</p><h2 id="faq-title">Antes de fazer as malas,<br /><em>tire suas d&uacute;vidas.</em></h2><p className="faq__helper">N&atilde;o encontrou o que procura? A equipe da Rodrigues Tur pode esclarecer os detalhes diretamente no Instagram.</p><a className="underlined-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Conversar com a equipe <Icon name="arrow-up-right" size={17}/></a></div>
            <div className="faq__list" data-reveal>
              <details><summary>Como pe&ccedil;o informa&ccedil;&otilde;es sobre uma viagem?<span className="faq__plus"><Icon name="plus" size={20}/></span></summary><p>Voc&ecirc; pode falar com a Rodrigues Tur pelo Instagram. Para facilitar, use o planejador acima e copie a mensagem com suas prefer&ecirc;ncias.</p></details>
              <details><summary>Os destinos mostrados est&atilde;o dispon&iacute;veis?<span className="faq__plus"><Icon name="plus" size={20}/></span></summary><p>As imagens desta p&aacute;gina s&atilde;o inspira&ccedil;&otilde;es de viagem, n&atilde;o an&uacute;ncios de pacotes. Consulte a equipe para confirmar roteiros, datas, valores e disponibilidade.</p></details>
              <details><summary>Onde acompanho as novidades?<span className="faq__plus"><Icon name="plus" size={20}/></span></summary><p>No perfil oficial <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@rodriguesturpb</a>, onde voc&ecirc; pode buscar informa&ccedil;&otilde;es atualizadas e entrar em contato.</p></details>
              <details><summary>Posso enviar uma ideia de destino diferente?<span className="faq__plus"><Icon name="plus" size={20}/></span></summary><p>Claro! Compartilhe o lugar que voc&ecirc; tem em mente e pergunte &agrave; equipe quais possibilidades de viagem est&atilde;o dispon&iacute;veis.</p></details>
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="shell closing__inner" data-reveal>
            <span className="closing__star" aria-hidden="true">&#10022;</span>
            <p className="eyebrow eyebrow--light">A PR&Oacute;XIMA P&Aacute;GINA DA SUA HIST&Oacute;RIA</p>
            <h2>O mundo est&aacute; esperando.<br /><em>E voc&ecirc;?</em></h2>
            <a className="button button--cream" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Vamos conversar sobre viajar <Icon name="arrow-up-right" size={19}/></a>
            <span className="closing__deco closing__deco--left" aria-hidden="true">BON VOYAGE</span><span className="closing__deco closing__deco--right" aria-hidden="true">RODRIGUES TUR</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer__top"><div><Brand /><p>O pr&oacute;ximo lugar que vai morar<br />no seu cora&ccedil;&atilde;o come&ccedil;a aqui.</p></div><div className="footer__nav"><span>EXPLORAR</span><a href="#destinos">Inspira&ccedil;&otilde;es</a><a href="#sobre">Nossa ess&ecirc;ncia</a><a href="#como-funciona">Como funciona</a><a href="#duvidas">D&uacute;vidas</a></div><div className="footer__social"><span>VAMOS CONVERSAR?</span><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={20}/> @rodriguesturpb <Icon name="arrow-up-right" size={18}/></a><p>Converse com a equipe para confirmar informa&ccedil;&otilde;es e disponibilidade.</p></div></div>
        <div className="shell footer__bottom"><span>&copy; {new Date().getFullYear()} Rodrigues Tur. Feito para quem ama explorar.</span><a href="#inicio">Voltar ao topo &#8593;</a></div>
      </footer>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="floating-contact" aria-label="Falar com a Rodrigues Tur no Instagram"><Icon name="instagram" size={19}/><span>Vamos conversar?</span></a>
      <a href="#planejar" className="mobile-fixed-cta">Planejar minha viagem <Icon name="arrow-up-right" size={18}/></a>
    </>
  );
}
