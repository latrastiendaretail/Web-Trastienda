/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const Door = ({ size = 44, fill = "currentColor", highlight = "#F4EFE6" }) => (
  <svg className="door-svg" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x="8" y="6" width="84" height="88" fill="none" stroke={fill} strokeWidth="7"/>
    <path d={`M 50 14 L 78 22 L 78 88 L 50 80 Z`} fill={fill}/>
    <circle cx="55" cy="51" r="2.4" fill={highlight}/>
  </svg>
);

const Lockup = ({ size = 44, fill = "currentColor", bgHighlight = "#F4EFE6", subtitle = "Retail con propósito", style }) => (
  <div className="logo-lockup" style={style}>
    <Door size={size} fill={fill} highlight={bgHighlight} />
    <div className="wordmark">
      LA TRASTIENDA
      <span className="small">{subtitle}</span>
    </div>
  </div>
);

/* ----------------------- INTRO BOARD ----------------------- */
const IntroBoard = () => (
  <div className="board intro">
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
        <Lockup size={56} fill="#1A1714" bgHighlight="#faf8f3" subtitle="Identidad visual · v1" />
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, textAlign: 'right', lineHeight: 1.7 }}>
          Mayo 2026<br/>
          Exploración 01 / 01<br/>
          David · La Trastienda
        </div>
      </div>
      <h1>
        Tres direcciones para una marca <em>híbrida</em> — social y empresarial al mismo tiempo.
      </h1>
      <p className="intro-lede">
        Todas comparten un punto de partida cálido y honesto (fondo crema, tinta negra del logo) pero divergen en acento de color y en pareja tipográfica. Elegimos una, mezclamos elementos, o iteramos.
      </p>
    </div>

    <div>
      <div className="intro-grid">
        <div className="intro-card">
          <div className="num">A · DIRECCIÓN</div>
          <div className="name">Mostrador</div>
          <p className="desc">El comercio honesto. Crema cálida, tinta profunda, terracota como acento humano. Editorial: Instrument Serif + Instrument Sans.</p>
        </div>
        <div className="intro-card">
          <div className="num">B · DIRECCIÓN</div>
          <div className="name">Almacén</div>
          <p className="desc">Operativa, contemporánea, con confianza. Bone, grafito y azul de trabajo. Funnel Display + Manrope.</p>
        </div>
        <div className="intro-card">
          <div className="num">C · DIRECCIÓN</div>
          <div className="name">Tierra</div>
          <p className="desc">Raíz social y artesanal. Crema, verde oliva, terracota quemado. Newsreader serif + Space Grotesk.</p>
        </div>
      </div>
      <div className="footer-row">
        <span>Arrastra para mover · Doble clic para enfocar</span>
        <span>La Trastienda · Brand exploration</span>
      </div>
    </div>
  </div>
);

/* ----------------------- DIRECTION A — MOSTRADOR ----------------------- */
const BoardA = () => (
  <div className="board dir-a">
    <div className="meta">
      <div className="left">
        <span className="index-tag">A · Dirección</span>
        <h2 className="direction-name"><span className="roman">Mostrador.</span></h2>
        <p className="direction-concept">El oficio del comercio honesto. Cálido, editorial, con voz propia. El crema y la tinta del logo se acompañan de una terracota que humaniza sin gritar.</p>
      </div>
      <div className="right">
        Mood: editorial, cálido,<br/>cercano sin paternalismo<br/>
        <br/>
        Para: web, memoria social,<br/>presentación a empresa
      </div>
    </div>

    {/* Palette */}
    <div>
      <p className="section-label">01 · Paleta</p>
      <div className="palette">
        <div className="swatch-row large">
          <div className="swatch lg" style={{ background: '#F4EFE6', color: '#1A1714', border: '1px solid rgba(26,23,20,0.08)' }}>
            <div className="name">Papel</div>
            <div className="hex">#F4EFE6 · base</div>
          </div>
          <div className="swatch lg" style={{ background: '#1A1714', color: '#F4EFE6' }}>
            <div className="name">Tinta</div>
            <div className="hex">#1A1714 · texto</div>
          </div>
        </div>
        <div className="swatch-row">
          <div className="swatch" style={{ background: '#B85C3C', color: '#F4EFE6' }}>
            <div className="name">Terracota</div>
            <div className="hex">#B85C3C · acento</div>
          </div>
          <div className="swatch" style={{ background: '#8B7F70', color: '#F4EFE6' }}>
            <div className="name">Cobre seco</div>
            <div className="hex">#8B7F70 · muted</div>
          </div>
          <div className="swatch" style={{ background: '#E8DFCE', color: '#1A1714' }}>
            <div className="name">Lino</div>
            <div className="hex">#E8DFCE · superficie</div>
          </div>
        </div>
      </div>
    </div>

    {/* Type */}
    <div>
      <p className="section-label">02 · Tipografía · Instrument Serif + Instrument Sans</p>
      <div className="type-stack">
        <div className="type-row">
          <span className="type-tag">Display · Instrument Serif Italic · 64</span>
          <p className="specimen-display" style={{ fontFamily: '"Instrument Serif", serif' }}>
            <em>Donde ocurre</em> lo real.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">H2 · Instrument Sans 500 · 36</span>
          <p className="specimen-h2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>Formación, talento y consultoría retail.</p>
        </div>
        <div className="type-row">
          <span className="type-tag">Body · Instrument Sans 400 · 17/27</span>
          <p className="specimen-body" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
            La Trastienda conecta a personas en transición laboral con empresas del sector retail que buscan talento real, formado y comprometido. Modelo híbrido: subvención + servicio.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">Caption · IBM Plex Mono 400 · 13</span>
          <p className="specimen-mono">PROGRAMAS · EMPRESAS · INSTITUCIONES · CONTACTO</p>
        </div>
      </div>
    </div>

    {/* Applied */}
    <div className="applied">
      <div>
        <Lockup fill="#F4EFE6" bgHighlight="#1A1714" subtitle="Retail con propósito" />
        <div className="eyebrow" style={{ marginTop: 40 }}>HERO · WEB</div>
        <h3 className="hero-h">
          El comercio,<br/>desde <em>dentro.</em>
        </h3>
        <p className="hero-p">Formamos a personas en riesgo de exclusión para el sector retail. Y conectamos su talento con las empresas que lo necesitan.</p>
        <div className="cta-row">
          <button className="cta solid">Trabaja con nosotros</button>
          <button className="cta ghost">Formaciones abiertas</button>
        </div>
      </div>
      <div className="stat-col">
        <div>
          <p className="stat-num" style={{ fontFamily: '"Instrument Serif", serif' }}>2 canales</p>
          <p className="stat-lab">Subvención + Empresa</p>
        </div>
        <div>
          <p className="stat-num" style={{ fontFamily: '"Instrument Serif", serif' }}>3 audiencias</p>
          <p className="stat-lab">Personas · Empresas · Instituciones</p>
        </div>
      </div>
    </div>
  </div>
);

/* ----------------------- DIRECTION B — ALMACÉN ----------------------- */
const BoardB = () => (
  <div className="board dir-b">
    <div className="meta">
      <div className="left">
        <span className="index-tag">B · Dirección</span>
        <h2 className="direction-name">Almacén.</h2>
        <p className="direction-concept">Operativa contemporánea con confianza institucional. La trastienda como espacio de trabajo donde se prepara todo. Geométrica, ordenada, con un azul de oficio.</p>
      </div>
      <div className="right">
        Mood: claro, profesional,<br/>preparado para B2B<br/>
        <br/>
        Para: deck a empresas,<br/>pitch a instituciones
      </div>
    </div>

    {/* Palette */}
    <div>
      <p className="section-label">01 · Paleta</p>
      <div className="palette">
        <div className="swatch-row large">
          <div className="swatch lg" style={{ background: '#F2F1ED', color: '#15171A', border: '1px solid rgba(21,23,26,0.08)' }}>
            <div className="name">Bone</div>
            <div className="hex">#F2F1ED · base</div>
          </div>
          <div className="swatch lg" style={{ background: '#15171A', color: '#F2F1ED' }}>
            <div className="name">Grafito</div>
            <div className="hex">#15171A · texto</div>
          </div>
        </div>
        <div className="swatch-row">
          <div className="swatch" style={{ background: '#2D5BBF', color: '#F2F1ED' }}>
            <div className="name">Azul oficio</div>
            <div className="hex">#2D5BBF · acento</div>
          </div>
          <div className="swatch" style={{ background: '#6A7079', color: '#F2F1ED' }}>
            <div className="name">Cemento</div>
            <div className="hex">#6A7079 · muted</div>
          </div>
          <div className="swatch" style={{ background: '#E4E2DC', color: '#15171A' }}>
            <div className="name">Cal</div>
            <div className="hex">#E4E2DC · superficie</div>
          </div>
        </div>
      </div>
    </div>

    {/* Type */}
    <div>
      <p className="section-label">02 · Tipografía · Funnel Display + Manrope</p>
      <div className="type-stack">
        <div className="type-row">
          <span className="type-tag">Display · Funnel Display 600 · 64</span>
          <p className="specimen-display" style={{ fontFamily: '"Funnel Display", sans-serif', fontWeight: 600, letterSpacing: '-0.03em' }}>
            Talento que <span className="accent-mark">funciona.</span>
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">H2 · Funnel Display 500 · 36</span>
          <p className="specimen-h2" style={{ fontFamily: '"Funnel Display", sans-serif', fontWeight: 500, letterSpacing: '-0.02em' }}>Programas para personas, empresas e instituciones.</p>
        </div>
        <div className="type-row">
          <span className="type-tag">Body · Manrope 400 · 17/27</span>
          <p className="specimen-body" style={{ fontFamily: '"Manrope", sans-serif' }}>
            La Trastienda forma a personas en riesgo de exclusión social para el sector retail y conecta ese talento con empresas que buscan equipos preparados desde el primer día.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">Caption · IBM Plex Mono 400 · 13</span>
          <p className="specimen-mono">[ 01 ] PERSONAS · [ 02 ] EMPRESAS · [ 03 ] INSTITUCIONES</p>
        </div>
      </div>
    </div>

    {/* Applied */}
    <div className="applied">
      <div>
        <Lockup fill="#F2F1ED" bgHighlight="#15171A" subtitle="Talento Retail · 2026" />
        <div className="eyebrow" style={{ marginTop: 40 }}>HERO · WEB</div>
        <h3 className="hero-h">
          Donde se prepara<br/>el comercio.
        </h3>
        <p className="hero-p">Conectamos a empresas retail con talento preformado y comprometido. Formación, intermediación y consultoría operativa.</p>
        <div className="cta-row">
          <button className="cta solid">Hablemos de equipo</button>
          <button className="cta ghost">Ver programas →</button>
        </div>
      </div>
      <div className="stat-col">
        <div>
          <p className="stat-num">100d</p>
          <p className="stat-lab">Plan de tracción</p>
        </div>
        <div>
          <p className="stat-num">3 socios</p>
          <p className="stat-lab">Javi · Yeray · David</p>
        </div>
      </div>
    </div>
  </div>
);

/* ----------------------- DIRECTION C — TIERRA ----------------------- */
const BoardC = () => (
  <div className="board dir-c">
    <div className="meta">
      <div className="left">
        <span className="index-tag">C · Dirección</span>
        <h2 className="direction-name">Tierra<em>.</em></h2>
        <p className="direction-concept">Raíz social y artesana. La trastienda como espacio humano, con olor a madera y mostrador de barrio. Serif editorial, paleta de campo, terracota quemado para los CTAs.</p>
      </div>
      <div className="right">
        Mood: humano, narrativo,<br/>con sensibilidad social<br/>
        <br/>
        Para: storytelling,<br/>charlas en institutos
      </div>
    </div>

    {/* Palette */}
    <div>
      <p className="section-label">01 · Paleta</p>
      <div className="palette">
        <div className="swatch-row large">
          <div className="swatch lg" style={{ background: '#EFEAE0', color: '#221E1A', border: '1px solid rgba(34,30,26,0.08)' }}>
            <div className="name">Crema</div>
            <div className="hex">#EFEAE0 · base</div>
          </div>
          <div className="swatch lg" style={{ background: '#3C4A2A', color: '#EFEAE0' }}>
            <div className="name">Oliva</div>
            <div className="hex">#3C4A2A · contraste</div>
          </div>
        </div>
        <div className="swatch-row">
          <div className="swatch" style={{ background: '#B14B2F', color: '#EFEAE0' }}>
            <div className="name">Quemado</div>
            <div className="hex">#B14B2F · CTA</div>
          </div>
          <div className="swatch" style={{ background: '#D7C190', color: '#221E1A' }}>
            <div className="name">Trigo</div>
            <div className="hex">#D7C190 · highlight</div>
          </div>
          <div className="swatch" style={{ background: '#221E1A', color: '#EFEAE0' }}>
            <div className="name">Sombra</div>
            <div className="hex">#221E1A · texto</div>
          </div>
        </div>
      </div>
    </div>

    {/* Type */}
    <div>
      <p className="section-label">02 · Tipografía · Newsreader + Space Grotesk</p>
      <div className="type-stack">
        <div className="type-row">
          <span className="type-tag">Display · Newsreader Regular + Italic · 64</span>
          <p className="specimen-display" style={{ fontFamily: '"Newsreader", serif', fontWeight: 400 }}>
            El oficio <em>de estar</em> cerca.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">H2 · Space Grotesk 500 · 36</span>
          <p className="specimen-h2" style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500 }}>Formación retail con impacto medible.</p>
        </div>
        <div className="type-row">
          <span className="type-tag">Body · Space Grotesk 400 · 17/27</span>
          <p className="specimen-body" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            Acompañamos a personas en transición laboral hacia un sector que necesita manos formadas y miradas atentas. Crecemos junto a las empresas que apuestan por equipos con propósito.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">Caption · IBM Plex Mono 400 · 13</span>
          <p className="specimen-mono">— programa · talento · consultoría · podcast</p>
        </div>
      </div>
    </div>

    {/* Applied */}
    <div className="applied">
      <div>
        <Lockup fill="#EFEAE0" bgHighlight="#3C4A2A" subtitle="Retail con raíz" />
        <div className="eyebrow" style={{ marginTop: 40 }}>HERO · WEB</div>
        <h3 className="hero-h">
          Lo que ocurre<br/><em>detrás</em> del mostrador.
        </h3>
        <p className="hero-p">Un proyecto que forma, acompaña y conecta. Para personas que empiezan, empresas que necesitan equipo, instituciones que quieren impacto real.</p>
        <div className="cta-row">
          <button className="cta solid">Conoce el proyecto</button>
          <button className="cta ghost">Para empresas</button>
        </div>
      </div>
      <div className="stat-col">
        <div>
          <p className="stat-num">Septiembre</p>
          <p className="stat-lab">Primera charla en FP</p>
        </div>
        <div>
          <p className="stat-num">1 fundación</p>
          <p className="stat-lab">En constitución</p>
        </div>
      </div>
    </div>
  </div>
);

/* ----------------------- DIRECTION D — HÍBRIDA (A + Tierra + Newsreader/Space Grotesk) ----------------------- */
/*
  Base = A (papel crema + tinta + lino + cobre seco)
  Tipografía = C (Newsreader serif + Space Grotesk sans)
  Acento = familia trigo/ocre · probamos 3 saturaciones para ver cuál destaca sobre el crema
*/

const HybridBoard = ({ accent, accentName, accentHex, accentRole, contrastNote }) => (
  <div className="board dir-hybrid" style={{
    background: '#F4EFE6',
    color: '#1A1714',
    fontFamily: '"Space Grotesk", sans-serif'
  }}>
    <div className="meta">
      <div className="left">
        <span className="index-tag">D · Híbrida · variación de acento</span>
        <h2 className="direction-name" style={{
          fontFamily: '"Newsreader", serif',
          fontWeight: 400,
          letterSpacing: '-0.015em'
        }}>
          {accentName}<em>.</em>
        </h2>
        <p className="direction-concept">
          Acento {accentHex.toUpperCase()} aplicado sobre la base de papel #F4EFE6. {contrastNote}
        </p>
      </div>
      <div className="right">
        Base: Mostrador (A)<br/>
        Tipografía: Tierra (C)<br/>
        <br/>
        Acento: {accentRole}
      </div>
    </div>

    {/* Palette */}
    <div>
      <p className="section-label" style={{ borderBottomColor: 'rgba(26,23,20,0.18)' }}>01 · Paleta</p>
      <div className="palette">
        <div className="swatch-row large">
          <div className="swatch lg" style={{ background: '#F4EFE6', color: '#1A1714', border: '1px solid rgba(26,23,20,0.08)' }}>
            <div className="name">Papel</div>
            <div className="hex">#F4EFE6 · base</div>
          </div>
          <div className="swatch lg" style={{ background: '#1A1714', color: '#F4EFE6' }}>
            <div className="name">Tinta</div>
            <div className="hex">#1A1714 · texto</div>
          </div>
        </div>
        <div className="swatch-row">
          <div className="swatch" style={{ background: accent, color: contrastNote.includes('oscuro') ? '#F4EFE6' : '#1A1714', outline: '2px solid #1A1714', outlineOffset: 4 }}>
            <div className="name">{accentName}</div>
            <div className="hex">{accentHex.toUpperCase()} · acento</div>
          </div>
          <div className="swatch" style={{ background: '#E8DFCE', color: '#1A1714' }}>
            <div className="name">Lino</div>
            <div className="hex">#E8DFCE · superficie</div>
          </div>
          <div className="swatch" style={{ background: '#8B7F70', color: '#F4EFE6' }}>
            <div className="name">Cobre seco</div>
            <div className="hex">#8B7F70 · muted</div>
          </div>
        </div>
      </div>
    </div>

    {/* Type */}
    <div>
      <p className="section-label" style={{ borderBottomColor: 'rgba(26,23,20,0.18)' }}>02 · Tipografía · Newsreader + Space Grotesk</p>
      <div className="type-stack">
        <div className="type-row">
          <span className="type-tag">Display · Newsreader 400 + Italic · 64</span>
          <p className="specimen-display" style={{ fontFamily: '"Newsreader", serif', fontWeight: 400 }}>
            <em>Donde ocurre</em> lo real.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">H2 · Space Grotesk 500 · 36</span>
          <p className="specimen-h2" style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500 }}>
            Formación, talento y consultoría retail.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">Body · Space Grotesk 400 · 17/27</span>
          <p className="specimen-body" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            La Trastienda conecta a personas en transición laboral con empresas del sector retail que buscan talento real, formado y comprometido. Modelo híbrido: subvención + servicio.
          </p>
        </div>
        <div className="type-row">
          <span className="type-tag">Caption · IBM Plex Mono 400 · 13</span>
          <p className="specimen-mono">PROGRAMAS · EMPRESAS · INSTITUCIONES · CONTACTO</p>
        </div>
      </div>
    </div>

    {/* Applied — light hero showing accent on cream */}
    <div className="applied" style={{
      background: '#F4EFE6',
      color: '#1A1714',
      border: '1px solid rgba(26,23,20,0.12)',
      borderRadius: 6
    }}>
      <div>
        <Lockup fill="#1A1714" bgHighlight="#F4EFE6" subtitle="Retail con propósito" />
        <div className="eyebrow" style={{ marginTop: 40, opacity: 0.6 }}>HERO · WEB · LIGHT</div>
        <h3 className="hero-h" style={{ fontFamily: '"Newsreader", serif', fontWeight: 400 }}>
          El comercio,<br/>
          <em style={{ color: accent }}>desde dentro.</em>
        </h3>
        <p className="hero-p">
          Formamos a personas en riesgo de exclusión para el sector retail. Y conectamos su talento con las empresas que lo necesitan.
        </p>
        <div className="cta-row">
          <button className="cta solid" style={{ background: accent, color: contrastNote.includes('oscuro') ? '#F4EFE6' : '#1A1714' }}>
            Trabaja con nosotros
          </button>
          <button className="cta ghost" style={{ color: '#1A1714', borderColor: 'rgba(26,23,20,0.3)' }}>
            Formaciones abiertas
          </button>
        </div>
      </div>
      <div className="stat-col" style={{ borderLeftColor: 'rgba(26,23,20,0.15)' }}>
        <div>
          <p className="stat-num" style={{ fontFamily: '"Newsreader", serif', fontWeight: 400 }}>
            <span style={{ color: accent }}>2</span> canales
          </p>
          <p className="stat-lab">Subvención + Empresa</p>
        </div>
        <div>
          <p className="stat-num" style={{ fontFamily: '"Newsreader", serif', fontWeight: 400 }}>
            <span style={{ color: accent }}>3</span> audiencias
          </p>
          <p className="stat-lab">Personas · Empresas · Instituciones</p>
        </div>
        <div style={{
          marginTop: 12,
          padding: '14px 16px',
          background: accent,
          color: contrastNote.includes('oscuro') ? '#F4EFE6' : '#1A1714',
          borderRadius: 4,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase'
        }}>
          → badge · destacado
        </div>
      </div>
    </div>

    {/* Contrast row — quick reading test */}
    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 16, marginTop: -20 }}>
      <div style={{ flex: 1, padding: 24, background: '#F4EFE6', border: '1px solid rgba(26,23,20,0.12)', borderRadius: 4 }}>
        <p style={{ margin: 0, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 8 }}>Acento sobre papel</p>
        <p style={{ margin: 0, color: accent, fontFamily: '"Newsreader", serif', fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em' }}>Trabaja con nosotros →</p>
      </div>
      <div style={{ flex: 1, padding: 24, background: '#1A1714', borderRadius: 4 }}>
        <p style={{ margin: 0, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 8, color: '#F4EFE6' }}>Acento sobre tinta</p>
        <p style={{ margin: 0, color: accent, fontFamily: '"Newsreader", serif', fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em' }}>Trabaja con nosotros →</p>
      </div>
    </div>
  </div>
);

/* ----------------------- ROOT ----------------------- */
const App = () => (
  <DesignCanvas title="La Trastienda · Identidad Visual" subtitle="Exploración de paleta + tipografía · 3 direcciones">
    <DCSection id="intro" title="Punto de partida">
      <DCArtboard id="intro" label="Resumen" width={1800} height={1200}>
        <IntroBoard />
      </DCArtboard>
    </DCSection>
    <DCSection id="logo" title="Logo · Iteración T">
      <DCArtboard id="logo-t" label="Marcas T · exploración" width={2200} height={2600}>
        <LogoBoard />
      </DCArtboard>
    </DCSection>
    <DCSection id="hybrid" title="D · Híbrida — paleta A + tipografía C · 3 acentos a comparar">
      <DCArtboard id="dir-d1" label="D1 · Trigo profundo" width={1800} height={1900}>
        <HybridBoard
          accent="#C9A227"
          accentName="Trigo"
          accentHex="#C9A227"
          accentRole="Trigo profundo · dorado natural"
          contrastNote="Suficiente contraste para títulos y CTAs sobre crema. Mantiene calidez y se lee bien."
        />
      </DCArtboard>
      <DCArtboard id="dir-d2" label="D2 · Ocre / mostaza" width={1800} height={1900}>
        <HybridBoard
          accent="#B8821C"
          accentName="Ocre"
          accentHex="#B8821C"
          accentRole="Ocre tostado · más saturado"
          contrastNote="Más cuerpo que el trigo, todavía cálido. Buen punto medio — destaca sin ser estridente."
        />
      </DCArtboard>
      <DCArtboard id="dir-d3" label="D3 · Bronce / oro viejo" width={1800} height={1900}>
        <HybridBoard
          accent="#8F5E1A"
          accentName="Bronce"
          accentHex="#8F5E1A"
          accentRole="Bronce oscuro · oro viejo · texto seguro"
          contrastNote="El más oscuro de los tres — puede usarse incluso como color de texto. Más institucional y serio."
        />
      </DCArtboard>
    </DCSection>
    <DCSection id="directions" title="Referencia · direcciones originales">
      <DCArtboard id="dir-a" label="A · Mostrador" width={1800} height={1700}>
        <BoardA />
      </DCArtboard>
      <DCArtboard id="dir-b" label="B · Almacén" width={1800} height={1700}>
        <BoardB />
      </DCArtboard>
      <DCArtboard id="dir-c" label="C · Tierra" width={1800} height={1700}>
        <BoardC />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
