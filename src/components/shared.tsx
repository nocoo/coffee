import { ArrowUpRight, X } from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef } from 'react';
import { sources } from '../data/sources';
import type { SourceId } from '../data/types';
import { useCoffee } from '../lib/context';

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? 'brand-small' : ''}`}>
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 4C22 12 26 15 35 13C30 19 30 24 35 29C27 27 22 29 20 37C18 29 13 27 5 29C10 24 10 19 5 13C14 15 18 12 20 4Z"
          fill="currentColor"
        />
        <ellipse cx="20" cy="21" rx="5.1" ry="7.1" fill="var(--bg)" transform="rotate(28 20 21)" />
        <path d="M23 15C18 19 23 23 17 27" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span>
        coffee<span className="brand-period">.</span>
      </span>
    </span>
  );
}

export function AppLink({
  to,
  children,
  className,
  onNavigate,
  ...props
}: { to: string; children: ReactNode; className?: string; onNavigate?: () => void } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  const { go } = useCoffee();
  return (
    <a
      href={to}
      className={className}
      {...props}
      onClick={(event) => {
        if (
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          onNavigate?.();
          go(to);
        }
      }}
    >
      {children}
    </a>
  );
}

export function Modal({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const { ui } = useCoffee();
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal();
    ref.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id={id}>{title}</h2>
        <button type="button" className="icon-button" aria-label={ui.close} onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function SourceLinks({ ids }: { ids: SourceId[] }) {
  const { ui, l } = useCoffee();
  return (
    <div className="source-links">
      <span>{ui.reference}</span>
      {ids.map((id) => (
        <a
          key={id}
          href={sources[id].url}
          target="_blank"
          rel="noreferrer"
          title={l(sources[id].scope)}
        >
          {sources[id].name}
          <ArrowUpRight size={11} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <span className="eyebrow">
        <span className="tiny-star" aria-hidden="true">
          ✳
        </span>
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </header>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  low,
  high,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  low?: string;
  high?: string;
  suffix?: string;
}) {
  const id = useId();
  return (
    <div className="range-field">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>
          {value}
          {suffix}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {(low || high) && (
        <div className="range-ends">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      )}
    </div>
  );
}

export function BrewGlyph({ method, className = '' }: { method: string; className?: string }) {
  return (
    <svg className={`brew-glyph ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="105" rx="37" ry="5" fill="currentColor" opacity=".08" />
      {['v60', 'kalita', 'chemex'].includes(method) ? (
        <>
          <path
            d="M32 68H87L82 99H37L32 68Z"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M88 72C111 70 108 92 84 91" stroke="currentColor" strokeWidth="3" />
          <path
            d={method === 'kalita' ? 'M18 28H100L80 64H39L18 28Z' : 'M20 25H99L64 68H56L20 25Z'}
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M39 30L59 60M60 30V60M82 30L64 59"
            stroke="currentColor"
            opacity=".3"
            strokeWidth="2"
          />
          <path
            d="M54 8C44 14 63 16 56 21M69 7C59 13 78 15 71 20"
            stroke="currentColor"
            opacity=".3"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : method === 'espresso' ? (
        <>
          <rect
            x="22"
            y="20"
            width="79"
            height="72"
            rx="9"
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M31 47H91V82H31V47Z" fill="var(--bg)" />
          <circle cx="84" cy="33" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M42 67H74L70 84H47L42 67ZM54 49V60M64 49V60M34 96H88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : method === 'moka' ? (
        <>
          <path
            d="M40 99L32 75L43 61H76L86 75L78 99H40ZM42 59L33 30H84L76 59H42Z"
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M83 34C105 32 103 58 78 56M31 30L20 35L37 45M40 25H79M55 21V16H64V21M48 68L44 96M70 68L74 96"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : method === 'siphon' ? (
        <>
          <circle
            cx="53"
            cy="80"
            r="21"
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M34 18H72L66 48H59V62H48V48H40L34 18Z"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M76 27H91V99H106M84 100H29M43 83H63M71 45H88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : method === 'turkish' ? (
        <>
          <path
            d="M37 48H78L86 96H28L37 48Z"
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M78 56L111 29M34 48L25 50L32 58M39 42H78"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x="33"
            y="29"
            width="48"
            height="70"
            rx={method === 'cold-brew' ? 14 : 5}
            fill="var(--illustration)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M37 64H78V91H37V64Z" fill="currentColor" opacity=".18" />
          {method === 'aeropress' ? (
            <path
              d="M27 100H87M45 14H69V68H45V14ZM38 13H77"
              stroke="currentColor"
              strokeWidth="3"
            />
          ) : (
            <path
              d="M27 26H87M55 16H65M60 18V78M39 80H76M82 37C110 30 111 81 83 81"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
        </>
      )}
    </svg>
  );
}
