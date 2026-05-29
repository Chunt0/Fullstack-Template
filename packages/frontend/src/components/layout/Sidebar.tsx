import { NavLink } from 'react-router'
import { APP_NAME } from '@/lib/config'
import { routes } from '@/routes.manifest'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
      <div className="flex h-14 items-center px-5 text-base font-semibold">{APP_NAME}</div>
      <nav className="space-y-1 px-3 py-2">
        {routes.map((r) => (
          <NavLink
            key={r.path}
            to={r.path}
            end={r.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )
            }
          >
            <r.icon className="size-4" />
            {r.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
