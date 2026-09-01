import lockupUrl from '../assets/oribitalyLogo.svg'
import markUrl from '../assets/orbitalyMark.svg'

/**
 * The brand SVG is a stacked lockup (orbit mark above the wordmark), so it only
 * reads well where there's vertical room. In tight horizontal space we use the
 * mark on its own and set the wordmark in type.
 *
 * On dark surfaces the mark keeps its own gradient rather than being flattened
 * to white. The gradient runs #0A2472 → #00AEEF, and that cyan end has plenty
 * of contrast against the navy ground — knocking it out with `brightness-0
 * invert` threw away the only blue in an otherwise blue-less palette, which is
 * exactly what made the mark look pasted on. Only the wordmark changes colour.
 */
export default function Logo({ dark, variant = 'mark', className }) {
  if (variant === 'lockup') {
    return (
      <img
        src={lockupUrl}
        alt="Orbitaly"
        className={className ?? 'h-20 w-auto'}
      />
    )
  }

  return (
    <span className="flex items-center gap-2">
      <img src={markUrl} alt="" className={className ?? 'h-9 w-auto'} />
      <span
        className={`font-display text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}
      >
        Orbitaly
      </span>
    </span>
  )
}
