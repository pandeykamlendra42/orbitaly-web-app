import lockupUrl from '../assets/oribitalyLogo.svg'
import markUrl from '../assets/orbitalyMark.svg'

// The brand SVG is a stacked lockup (orbit mark above the wordmark), so it only
// reads well where there's vertical room. In tight horizontal space we use the
// mark on its own and set the wordmark in type.
//
// Both files are brand blue; on dark surfaces we flatten them to white, since the
// gradient has almost no contrast there.
export default function Logo({ dark, variant = 'mark', className }) {
  const tint = dark ? 'brightness-0 invert' : ''

  if (variant === 'lockup') {
    return (
      <img
        src={lockupUrl}
        alt="Orbitaly"
        className={`${className ?? 'h-20 w-auto'} ${tint}`}
      />
    )
  }

  return (
    <span className="flex items-center gap-2">
      <img src={markUrl} alt="" className={`${className ?? 'h-9 w-auto'} ${tint}`} />
      <span className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
        Orbitaly<span className="align-super text-[10px] font-semibold opacity-60">™</span>
      </span>
    </span>
  )
}
