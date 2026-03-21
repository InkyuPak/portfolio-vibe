export function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      <svg
        width="420"
        height="420"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="hero-glow-f">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Ambient glow ── */}
        <ellipse cx="210" cy="210" rx="170" ry="170" fill="url(#hero-glow)" filter="url(#hero-blur)" />

        {/* ── Orbit rings ── */}
        <circle cx="210" cy="210" r="100" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="0.8" strokeDasharray="3 5">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="40s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="210" r="148" fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="0.8" strokeDasharray="2 6">
          <animateTransform attributeName="transform" type="rotate" from="360 210 210" to="0 210 210" dur="55s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="210" r="185" fill="none" stroke="rgba(139,92,246,0.04)" strokeWidth="0.5" strokeDasharray="1 8" />

        {/* ── Connection lines ── */}
        {/* center → Kafka */}
        <line x1="210" y1="210" x2="210" y2="78" stroke="url(#hero-line)" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </line>
        {/* center → MSA */}
        <line x1="210" y1="210" x2="338" y2="148" stroke="url(#hero-line)" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="2.6s" repeatCount="indefinite" begin="0.5s" />
        </line>
        {/* center → PostgreSQL */}
        <line x1="210" y1="210" x2="345" y2="290" stroke="url(#hero-line)" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite" begin="0.8s" />
        </line>
        {/* center → Docker */}
        <line x1="210" y1="210" x2="82" y2="290" stroke="url(#hero-line)" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="3.2s" repeatCount="indefinite" begin="0.3s" />
        </line>
        {/* center → AI */}
        <line x1="210" y1="210" x2="76" y2="148" stroke="url(#hero-line)" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="2.4s" repeatCount="indefinite" begin="1s" />
        </line>

        {/* ── Data packets ── */}
        <circle r="2.5" fill="#c4b5fd" opacity="0.9" filter="url(#hero-glow-f)">
          <animateMotion path="M210,210 L210,78" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#8b5cf6" opacity="0.9" filter="url(#hero-glow-f)">
          <animateMotion path="M210,210 L338,148" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
          <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
        </circle>
        <circle r="2.5" fill="#a78bfa" opacity="0.9">
          <animateMotion path="M345,290 L210,210" dur="2.2s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle r="2.5" fill="#c4b5fd" opacity="0.9">
          <animateMotion path="M82,290 L210,210" dur="2.4s" repeatCount="indefinite" begin="0.4s" />
          <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="0.4s" />
        </circle>
        <circle r="2" fill="#6ee7b7" opacity="0.8">
          <animateMotion path="M76,148 L210,210" dur="1.6s" repeatCount="indefinite" begin="0.8s" />
          <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" begin="0.8s" />
        </circle>

        {/* ═══ CENTER — Spring Boot ═══ */}
        <circle cx="210" cy="210" r="48" fill="#0d0d1a" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
        <circle cx="210" cy="210" r="48" fill="rgba(139,92,246,0.1)" />
        <circle cx="210" cy="210" r="56" fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="0.8" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="20s" repeatCount="indefinite" />
        </circle>
        {/* Spring leaf */}
        <path d="M210 196 C214 188 224 188 226 196 C228 204 220 214 210 224 C200 214 192 204 194 196 C196 188 206 188 210 196Z" fill="#6ee7b7" opacity="0.85" />
        <text x="210" y="246" textAnchor="middle" fill="rgba(196,181,253,0.65)" fontSize="9" fontFamily="monospace" letterSpacing="1">Spring Boot</text>

        {/* ═══ TOP — CI/CD ═══ */}
        <g>
          <circle cx="210" cy="68" r="30" fill="#0d0d1a" stroke="rgba(139,92,246,0.35)" strokeWidth="1.2" />
          <circle cx="210" cy="68" r="30" fill="rgba(139,92,246,0.06)" />
          {/* Pipeline icon: three connected stages */}
          <circle cx="198" cy="65" r="4" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
          <circle cx="210" cy="65" r="4" fill="#a78bfa" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="1.2" />
          <circle cx="222" cy="65" r="4" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
          <line x1="202" y1="65" x2="206" y2="65" stroke="#a78bfa" strokeWidth="1" />
          <line x1="214" y1="65" x2="218" y2="65" stroke="#a78bfa" strokeWidth="1" />
          {/* Checkmark in last stage */}
          <polyline points="219,65 221,67 224,62" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
          <text x="210" y="94" textAnchor="middle" fill="rgba(196,181,253,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="1">CI/CD</text>
        </g>

        {/* ═══ RIGHT-TOP — MSA / Microservice ═══ */}
        <g>
          <circle cx="338" cy="148" r="30" fill="#0d0d1a" stroke="rgba(99,102,241,0.35)" strokeWidth="1.2" />
          <circle cx="338" cy="148" r="30" fill="rgba(79,70,229,0.06)" />
          {/* Microservice grid icon */}
          <rect x="328" y="138" width="8" height="8" rx="2" fill="none" stroke="#818cf8" strokeWidth="1" />
          <rect x="338" y="138" width="8" height="8" rx="2" fill="none" stroke="#818cf8" strokeWidth="1" />
          <rect x="328" y="148" width="8" height="8" rx="2" fill="none" stroke="#818cf8" strokeWidth="1" />
          <rect x="338" y="148" width="8" height="8" rx="2" fill="#818cf8" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1" />
          {/* Inter-service arrows */}
          <line x1="336" y1="142" x2="338" y2="142" stroke="#818cf8" strokeWidth="0.6" opacity="0.5" />
          <line x1="332" y1="146" x2="332" y2="148" stroke="#818cf8" strokeWidth="0.6" opacity="0.5" />
          <text x="338" y="174" textAnchor="middle" fill="rgba(196,181,253,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="1">MSA</text>
        </g>

        {/* ═══ RIGHT-BOTTOM — PostgreSQL ═══ */}
        <g>
          <circle cx="345" cy="290" r="30" fill="#0d0d1a" stroke="rgba(139,92,246,0.35)" strokeWidth="1.2" />
          <circle cx="345" cy="290" r="30" fill="rgba(139,92,246,0.06)" />
          {/* DB cylinder */}
          <ellipse cx="345" cy="281" rx="10" ry="4" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
          <path d="M335 281 L335 296 Q345 302 355 296 L355 281" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
          <ellipse cx="345" cy="296" rx="10" ry="4" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.5" />
          <text x="345" y="316" textAnchor="middle" fill="rgba(196,181,253,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="0.5">Database</text>
        </g>

        {/* ═══ LEFT-BOTTOM — Docker ═══ */}
        <g>
          <circle cx="82" cy="290" r="30" fill="#0d0d1a" stroke="rgba(139,92,246,0.35)" strokeWidth="1.2" />
          <circle cx="82" cy="290" r="30" fill="rgba(139,92,246,0.06)" />
          {/* Docker whale containers */}
          <rect x="72" y="284" width="6" height="5" rx="1" fill="#38bdf8" opacity="0.85" />
          <rect x="80" y="282" width="6" height="7" rx="1" fill="#38bdf8" opacity="0.85" />
          <rect x="88" y="285" width="6" height="4" rx="1" fill="#38bdf8" opacity="0.85" />
          <path d="M70 291 Q82 300 94 291" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.6" />
          <text x="82" y="316" textAnchor="middle" fill="rgba(196,181,253,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="1">Docker</text>
        </g>

        {/* ═══ LEFT-TOP — AI / LLM Infra ═══ */}
        <g>
          <circle cx="76" cy="148" r="30" fill="#0d0d1a" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2" />
          <circle cx="76" cy="148" r="30" fill="rgba(52,211,153,0.05)" />
          {/* Neural network / AI icon */}
          {/* Layer 1 */}
          <circle cx="68" cy="140" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="68" cy="152" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          {/* Layer 2 */}
          <circle cx="80" cy="136" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="80" cy="148" r="3" fill="#6ee7b7" fillOpacity="0.15" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="80" cy="160" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          {/* Layer 3 */}
          <circle cx="92" cy="144" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="92" cy="156" r="3" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          {/* Connections */}
          <line x1="71" y1="140" x2="77" y2="136" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="71" y1="140" x2="77" y2="148" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="71" y1="152" x2="77" y2="148" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="71" y1="152" x2="77" y2="160" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="83" y1="136" x2="89" y2="144" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="83" y1="148" x2="89" y2="144" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="83" y1="148" x2="89" y2="156" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <line x1="83" y1="160" x2="89" y2="156" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
          <text x="76" y="174" textAnchor="middle" fill="rgba(110,231,183,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="0.5">AI Infra</text>
        </g>

        {/* ── Floating code snippets ── */}
        <g opacity="0.5">
          <rect x="270" y="215" width="88" height="40" rx="6" fill="rgba(10,10,30,0.85)" stroke="rgba(139,92,246,0.18)" strokeWidth="0.8" />
          <text x="278" y="229" fill="#6ee7b7" fontSize="7.5" fontFamily="monospace">@Service</text>
          <text x="278" y="240" fill="#c4b5fd" fontSize="7.5" fontFamily="monospace">public class</text>
          <text x="278" y="251" fill="#818cf8" fontSize="7.5" fontFamily="monospace">  QueryService</text>
        </g>
        <g opacity="0.4">
          <rect x="42" y="210" width="78" height="34" rx="6" fill="rgba(10,10,30,0.85)" stroke="rgba(139,92,246,0.15)" strokeWidth="0.8" />
          <text x="50" y="224" fill="#f472b6" fontSize="7.5" fontFamily="monospace">@GetMapping</text>
          <text x="50" y="235" fill="#c4b5fd" fontSize="7.5" fontFamily="monospace">/api/public</text>
        </g>

        {/* ── Terminal snippet (bottom-right) ── */}
        <g opacity="0.35">
          <rect x="290" y="320" width="95" height="32" rx="6" fill="rgba(10,10,30,0.85)" stroke="rgba(139,92,246,0.12)" strokeWidth="0.8" />
          <text x="298" y="334" fill="#34d399" fontSize="7.5" fontFamily="monospace">$ gradle test</text>
          <text x="298" y="346" fill="rgba(196,181,253,0.5)" fontSize="7.5" fontFamily="monospace">BUILD SUCCESS</text>
        </g>
      </svg>
    </div>
  );
}
