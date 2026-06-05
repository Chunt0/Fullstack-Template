import { NavLink } from 'react-router'
import { PuttyMascot } from '@/components/brand/PuttyMascot'
import { APP_NAME } from '@/lib/config'
import { routes } from '@/routes.manifest'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <PuttyMascot size={24} glow />
        <span className="text-base font-bold tracking-tight lowercase">{APP_NAME}</span>
      </div>
      <nav className="space-y-1 px-3 py-2">
        {routes.map((r) => (
          <NavLink
            key={r.path}
            to={r.path}
            end={r.path === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <r.icon
                  className={cn(
                    'size-4 transition-[opacity,color]',
                    isActive
                      ? 'text-primary opacity-100'
                      : 'opacity-50 group-hover:opacity-100',
                  )}
                />
                {r.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
