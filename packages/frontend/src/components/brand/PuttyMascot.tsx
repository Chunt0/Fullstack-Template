import { cn } from '@/lib/utils'

/**
 * The putty-ai mascot — a soft, wobbly coral blob with a little smile.
 * The single pop of color in an otherwise monochrome system; reserve it for
 * the brand mark (sidebar, welcome, favicon), never as UI chrome.
 */
export function PuttyMascot({
  size = 28,
  glow = false,
  className,
  ...props
}: { size?: number; glow?: boolean } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="putty-ai"
      className={cn(glow && 'putty-glow', className)}
      {...props}
    >
      <path
        d="M50 5 C61 4 64 -1 73 5 C82 10 78 19 86 24 C95 30 91 40 93 48 C95 57 99 63 92 71 C86 78 77 73 70 81 C63 89 59 96 49 93 C40 90 36 96 28 89 C21 83 26 75 18 70 C9 65 7 56 9 48 C11 40 3 35 10 27 C16 20 25 25 31 17 C37 10 39 6 50 5 Z"
        fill="#e06c75"
      />
      <ellipse cx="39" cy="47" rx="6" ry="7.5" fill="#161719" />
      <ellipse cx="62" cy="47" rx="6" ry="7.5" fill="#161719" />
      <circle cx="41" cy="44" r="2" fill="#fff" />
      <circle cx="64" cy="44" r="2" fill="#fff" />
      <path d="M41 63 q4.5 5.5 9 0" fill="none" stroke="#161719" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}
