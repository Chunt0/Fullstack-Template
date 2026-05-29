import { Home as HomeIcon } from 'lucide-react'
// REFERENCE-START
import { Megaphone } from 'lucide-react'
// REFERENCE-END
import { type ComponentType, lazy, type LazyExoticComponent } from 'react'

export interface RouteEntry {
  /** URL path. '/' is the index route. */
  path: string
  /** Sidebar label. */
  label: string
  /** Sidebar icon. */
  icon: ComponentType<{ className?: string }>
  /** Lazily-loaded page (default export). */
  Component: LazyExoticComponent<ComponentType>
}

// ── The single source of truth for app pages ─────────────────────────────
// Add a page: append one entry here. router.tsx builds the routes from this
// list and Sidebar.tsx builds the nav from it — they cannot drift. (SEED_SPEC §6.3)
export const routes: RouteEntry[] = [
  { path: '/', label: 'Home', icon: HomeIcon, Component: lazy(() => import('@/pages/Home')) },
  // REFERENCE-START
  {
    path: '/announcements',
    label: 'Announcements',
    icon: Megaphone,
    Component: lazy(() => import('@/pages/AnnouncementsPage')),
  },
  // REFERENCE-END
]
