/* global React */

/* =============================================================
   T-MARKS — Iteraciones de logo
   Cada marca es un SVG limpio, viewBox 0 0 100 100, currentColor.
   La paleta `bg` se usa cuando hay carve / negativos.
   ============================================================= */

/* 01 — Umbral · T con la grieta de una puerta entornada en el alma */
const TmarkUmbral = ({ size = 120, color = "currentColor", bg = "#F4EFE6" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Umbral">
    <rect x="6" y="14" width="88" height="17" fill={color} />
    <rect x="40" y="31" width="20" height="61" fill={color} />
    <rect x="52.5" y="35" width="1.6" height="53" fill={bg} />
  </svg>
);

/* 02 — Vano · T sobre dos jambas que forman un hueco de puerta */
const TmarkVano = ({ size = 120, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Vano">
    <rect x="6" y="14" width="88" height="17" fill={color} />
    <rect x="30" y="31" width="8" height="61" fill={color} />
    <rect x="62" y="31" width="8" height="61" fill={color} />
  </svg>
);

/* 03 — Slab · T con remates tipo serif, peso editorial */
const TmarkSlab = ({ size = 120, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Slab">
    {/* crossbar con dos pequeños drops a izq y der */}
    <path d="M 8 14 L 92 14 L 92 33 L 8 33 Z" fill={color} />
    <path d="M 8 14 L 14 14 L 14 21 L 8 21 Z" fill={color} />
    <path d="M 86 14 L 92 14 L 92 21 L 86 21 Z" fill={color} />
    {/* stem */}
    <rect x="42" y="33" width="16" height="53" fill={color} />
    {/* foot serif */}
    <rect x="32" y="86" width="36" height="6" fill={color} />
  </svg>
);

/* 04 — Marca · T geométrica con un punto = pomo / mirilla */
const TmarkMarca = ({ size = 120, color = "currentColor", bg = "#F4EFE6" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Marca">
    <rect x="6" y="14" width="88" height="17" fill={color} />
    <rect x="40" y="31" width="20" height="61" fill={color} />
    <circle cx="55" cy="58" r="2.6" fill={bg} />
  </svg>
);

/* 05 — Apertura · El alma de la T se abre en dos hojas */
const TmarkApertura = ({ size = 120, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Apertura">
    <rect x="6" y="14" width="88" height="17" fill={color} />
    <path d="M 40 31 L 50 31 L 50 92 L 36 88 Z" fill={color} />
    <path d="M 50 31 L 60 31 L 64 88 L 50 92 Z" fill={color} />
  </svg>
);

/* 06 — Sello · Bloque sólido con una T calada (negativo) */
const TmarkSello = ({ size = 120, color = "currentColor", bg = "#F4EFE6" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Sello">
    <rect x="6" y="6" width="88" height="88" rx="2" fill={color} />
    <rect x="16" y="22" width="68" height="14" fill={bg} />
    <rect x="42" y="36" width="16" height="48" fill={bg} />
  </svg>
);

/* 07 — Pórtico · T con pilares finos a los lados — storefront frontal */
const TmarkPortico = ({ size = 120, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Pórtico">
    <rect x="6" y="14" width="88" height="13" fill={color} />
    <rect x="10" y="27" width="5" height="65" fill={color} />
    <rect x="85" y="27" width="5" height="65" fill={color} />
    <rect x="44" y="27" width="12" height="65" fill={color} />
  </svg>
);

/* 08 — Mostrador · Crossbar largo + alma corta = una T baja, casi un mueble */
const TmarkMostrador = ({ size = 120, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="T · Mostrador">
    <rect x="4" y="32" width="92" height="14" fill={color} />
    <rect x="44" y="46" width="12" height="42" fill={color} />
    <rect x="38" y="86" width="24" height="4" fill={color} />
  </svg>
);

const ALL_MARKS = [
  { key: "umbral",     name: "Umbral",     concept: "T con una puerta entornada en el alma. Lee como inicial T y como umbral entreabierto.", Mark: TmarkUmbral,     hero: true },
  { key: "vano",       name: "Vano",       concept: "Dintel + dos jambas. La T sobre el hueco que se atraviesa. Muy storefront.",             Mark: TmarkVano },
  { key: "slab",       name: "Slab",       concept: "T con remates serif. Editorial, con peso de imprenta. Casa con Mostrador.",               Mark: TmarkSlab },
  { key: "marca",      name: "Marca",      concept: "T limpia con un punto · pomo / mirilla. Mínima y ownable.",                              Mark: TmarkMarca },
  { key: "apertura",   name: "Apertura",   concept: "El alma se abre en dos hojas. Movimiento, invitación a entrar.",                          Mark: TmarkApertura },
  { key: "sello",      name: "Sello",      concept: "Bloque con T calada en negativo. Stamp, marca de oficio.",                                Mark: TmarkSello },
  { key: "portico",    name: "Pórtico",    concept: "Dintel + dos pilares + alma. Arquitectura frontal de tienda.",                             Mark: TmarkPortico },
  { key: "mostrador",  name: "Mostrador",  concept: "T baja: el crossbar es el mostrador, el alma su pata. Más mueble que letra.",             Mark: TmarkMostrador },
];

/* =============================================================
   LOCKUP — mark + wordmark
   ============================================================= */

const Lockup2 = ({ Mark, size = 60, color = "#1A1714", bg = "#F4EFE6", subtitle = "Retail con propósito", wordSize = 26, gap = 18 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap, color }}>
    <Mark size={size} color={color} bg={bg} />
    <div style={{ fontFamily: '"Instrument Sans", sans-serif', fontWeight: 600, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      <div style={{ fontSize: wordSize }}>LA TRASTIENDA</div>
      {subtitle && (
        <div style={{ fontSize: wordSize * 0.62, opacity: 0.65, marginTop: 6, letterSpacing: '0.08em', fontWeight: 500 }}>{subtitle}</div>
      )}
    </div>
  </div>
);

/* T-as-glyph lockup: la marca reemplaza la T dentro de TRASTIENDA */
const LockupEmbedded = ({ Mark, color = "#1A1714", bg = "#F4EFE6", size = 56 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, color, fontFamily: '"Instrument Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1 }}>
    <span style={{ fontSize: size * 0.78, marginRight: 14 }}>LA</span>
    <span style={{ display: 'inline-flex', alignItems: 'center', transform: `translateY(${size * 0.08}px)` }}>
      <Mark size={size} color={color} bg={bg} />
    </span>
    <span style={{ fontSize: size * 0.78, marginLeft: 2 }}>RASTIENDA</span>
  </div>
);

/* =============================================================
   LOGO BOARD
   ============================================================= */

const LogoBoard = () => {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      padding: 80,
      background: '#F4EFE6', color: '#1A1714',
      fontFamily: '"Instrument Sans", sans-serif',
      display: 'flex', flexDirection: 'column', gap: 64,
    }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 60 }}>
        <div style={{ maxWidth: 880 }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 18 }}>
            Logo · Iteración 02 · marcas T
          </div>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 84, lineHeight: 0.96, letterSpacing: '-0.02em', margin: 0 }}>
            Ocho maneras de hacer que <em>la T</em> sea la puerta.
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.5, maxWidth: 720, marginTop: 24, opacity: 0.78 }}>
            Cada marca es un SVG vectorial — nítida a 16px o a 2&nbsp;metros. La T arranca el nombre y, al mismo tiempo, repite la arquitectura básica de un umbral: dintel arriba, vano debajo. Mismo concepto que la puerta del logo original, pero más legible, más propio, y mucho más versátil.
          </p>
        </div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, textAlign: 'right', lineHeight: 1.7 }}>
          Mayo 2026<br/>
          8 candidatas<br/>
          SVG · vectorial<br/>
          David · La Trastienda
        </div>
      </div>

      {/* GRID DE 8 MARCAS */}
      <div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, paddingBottom: 14, borderBottom: '1px solid rgba(26,23,20,0.18)', marginBottom: 32 }}>
          01 · Candidatas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {ALL_MARKS.map(({ key, name, concept, Mark, hero }) => (
            <div key={key} style={{
              background: '#FBF8F1',
              border: '1px solid rgba(26,23,20,0.10)',
              borderRadius: 6,
              padding: 28,
              display: 'flex', flexDirection: 'column', gap: 18,
              position: 'relative',
              outline: hero ? '2px solid #B85C3C' : 'none',
              outlineOffset: hero ? 4 : 0,
            }}>
              {hero && (
                <div style={{ position: 'absolute', top: -12, left: 20, background: '#B85C3C', color: '#F4EFE6', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 3 }}>
                  Favorita
                </div>
              )}
              <div style={{ aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4EFE6', borderRadius: 4 }}>
                <Mark size={170} color="#1A1714" bg="#F4EFE6" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 28, lineHeight: 1 }}>{name}</div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', opacity: 0.5 }}>0{ALL_MARKS.findIndex(m => m.key === key) + 1}</div>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, opacity: 0.72 }}>{concept}</p>
              </div>
              {/* Mini scale row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 14, borderTop: '1px dashed rgba(26,23,20,0.15)' }}>
                <Mark size={14} color="#1A1714" bg="#F4EFE6" />
                <Mark size={22} color="#1A1714" bg="#F4EFE6" />
                <Mark size={34} color="#1A1714" bg="#F4EFE6" />
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.12em', opacity: 0.5, marginLeft: 'auto' }}>14 · 22 · 34 px</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOCKUPS — favorita Umbral */}
      <div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, paddingBottom: 14, borderBottom: '1px solid rgba(26,23,20,0.18)', marginBottom: 32 }}>
          02 · Lockups · Umbral como propuesta principal
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ background: '#FBF8F1', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>A · Mark + Wordmark</div>
            <Lockup2 Mark={TmarkUmbral} size={84} wordSize={36} subtitle="Retail con propósito" />
            <div style={{ borderTop: '1px dashed rgba(26,23,20,0.15)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 24 }}>
              <Lockup2 Mark={TmarkUmbral} size={44} wordSize={18} subtitle={null} />
            </div>
            <div style={{ borderTop: '1px dashed rgba(26,23,20,0.15)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 24 }}>
              <Lockup2 Mark={TmarkUmbral} size={28} wordSize={12} subtitle={null} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.12em', opacity: 0.5 }}>Header · 28px</span>
            </div>
          </div>
          <div style={{ background: '#FBF8F1', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>B · T-as-glyph · la marca es la T del nombre</div>
            <LockupEmbedded Mark={TmarkUmbral} size={64} />
            <div style={{ borderTop: '1px dashed rgba(26,23,20,0.15)', paddingTop: 22 }}>
              <LockupEmbedded Mark={TmarkUmbral} size={38} />
            </div>
            <div style={{ borderTop: '1px dashed rgba(26,23,20,0.15)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
              <LockupEmbedded Mark={TmarkUmbral} size={22} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.12em', opacity: 0.5 }}>Compacto</span>
            </div>
          </div>
        </div>
      </div>

      {/* COLOR / FONDO TESTS */}
      <div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, paddingBottom: 14, borderBottom: '1px solid rgba(26,23,20,0.18)', marginBottom: 32 }}>
          03 · Sobre fondo — convive con las tres direcciones
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {/* Papel */}
          <div style={{ background: '#F4EFE6', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: 36, aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, color: '#1A1714' }}>Papel · base</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><TmarkUmbral size={160} color="#1A1714" bg="#F4EFE6" /></div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, opacity: 0.55, color: '#1A1714' }}>#F4EFE6 / #1A1714</div>
          </div>
          {/* Tinta */}
          <div style={{ background: '#1A1714', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: 36, aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, color: '#F4EFE6' }}>Tinta · inverso</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><TmarkUmbral size={160} color="#F4EFE6" bg="#1A1714" /></div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, opacity: 0.55, color: '#F4EFE6' }}>#1A1714 / #F4EFE6</div>
          </div>
          {/* Terracota (Mostrador) */}
          <div style={{ background: '#B85C3C', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: 36, aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, color: '#F4EFE6' }}>Mostrador · terracota</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><TmarkUmbral size={160} color="#F4EFE6" bg="#B85C3C" /></div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, opacity: 0.7, color: '#F4EFE6' }}>#B85C3C / #F4EFE6</div>
          </div>
          {/* Oliva (Tierra) */}
          <div style={{ background: '#3C4A2A', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: 36, aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, color: '#EFEAE0' }}>Tierra · oliva</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><TmarkUmbral size={160} color="#EFEAE0" bg="#3C4A2A" /></div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, opacity: 0.7, color: '#EFEAE0' }}>#3C4A2A / #EFEAE0</div>
          </div>
        </div>
      </div>

      {/* GEOMETRÍA — cómo está construida la favorita */}
      <div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, paddingBottom: 14, borderBottom: '1px solid rgba(26,23,20,0.18)', marginBottom: 32 }}>
          04 · Construcción · Umbral
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'stretch' }}>
          <div style={{ background: '#FBF8F1', border: '1px solid rgba(26,23,20,0.10)', borderRadius: 6, padding: 40, position: 'relative' }}>
            <svg width="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
              {/* Grid */}
              <defs>
                <pattern id="gridA" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(26,23,20,0.10)" strokeWidth="0.2"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#gridA)" />
              {/* Reference rectangles in outline */}
              <rect x="6" y="14" width="88" height="17" fill="none" stroke="#B85C3C" strokeWidth="0.3" strokeDasharray="0.8 0.8"/>
              <rect x="40" y="31" width="20" height="61" fill="none" stroke="#B85C3C" strokeWidth="0.3" strokeDasharray="0.8 0.8"/>
              {/* Mark itself */}
              <rect x="6" y="14" width="88" height="17" fill="#1A1714" />
              <rect x="40" y="31" width="20" height="61" fill="#1A1714" />
              <rect x="52.5" y="35" width="1.6" height="53" fill="#FBF8F1" />
              {/* Annotations */}
              <text x="50" y="9" fontFamily="IBM Plex Mono" fontSize="2.6" fill="#1A1714" textAnchor="middle" opacity="0.6">88 × 17 — dintel</text>
              <text x="32" y="62" fontFamily="IBM Plex Mono" fontSize="2.6" fill="#1A1714" textAnchor="end" opacity="0.6">alma 20w</text>
              <text x="68" y="62" fontFamily="IBM Plex Mono" fontSize="2.6" fill="#1A1714" textAnchor="start" opacity="0.6">grieta 1.6w</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center' }}>
            <h3 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 44, margin: 0, lineHeight: 1, fontWeight: 400 }}>
              Por qué Umbral.
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, opacity: 0.8 }}>
              Lee primero como inicial. Después, la grieta en el alma — un solo trazo finísimo — convierte la T en una puerta entreabierta. Mismo significado que la puerta original del logo, pero codificado en la propia letra. No depende de detalles para reconocerse a 16px: el dintel y el alma son suficientes.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}>
              <li style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, opacity: 0.55, minWidth: 28 }}>01</span>
                <span>Vectorial — escala perfecta de favicon (14px) a fachada.</span>
              </li>
              <li style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, opacity: 0.55, minWidth: 28 }}>02</span>
                <span>Monocromo · una sola tinta. Sin gradientes, sin efectos.</span>
              </li>
              <li style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, opacity: 0.55, minWidth: 28 }}>03</span>
                <span>Doble lectura: inicial T + umbral entreabierto. Memorable.</span>
              </li>
              <li style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, opacity: 0.55, minWidth: 28 }}>04</span>
                <span>Puede usarse sola (avatar, sello, favicon) o con wordmark.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

/* Export to window so boards.jsx can use it */
Object.assign(window, {
  LogoBoard,
  TmarkUmbral, TmarkVano, TmarkSlab, TmarkMarca, TmarkApertura, TmarkSello, TmarkPortico, TmarkMostrador,
  Lockup2, LockupEmbedded,
});
