import { Check, Palette } from 'lucide-react'
import { PuttyMascot } from '@/components/brand/PuttyMascot'
import { useTheme } from '@/components/layout/ThemeProvider'
import { APP_NAME } from '@/lib/config'
import { THEMES } from '@/lib/themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TopBar() {
  const { theme, setTheme } = useTheme()
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-5">
      <div className="flex items-center gap-2 md:hidden">
        <PuttyMascot size={22} glow />
        <span className="text-base font-bold tracking-tight lowercase">{APP_NAME}</span>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Change theme">
              <Palette />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
            {THEMES.map((t) => (
              <DropdownMenuItem
                key={t.key}
                onSelect={() => setTheme(t.key)}
                className="justify-between gap-3"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-4 shrink-0 rounded-full border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch.bg} 50%, ${t.swatch.accent} 50%)`,
                    }}
                  />
                  {t.label}
                </span>
                {theme === t.key && <Check className="text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
