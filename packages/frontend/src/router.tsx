import { type ComponentType, createElement, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AppShell } from '@/components/layout/AppShell'
import { NotFound } from '@/pages/NotFound'
import { RouteError } from '@/pages/RouteError'
import { routes } from '@/routes.manifest'

function wrap(Component: ComponentType) {
  return <Suspense fallback={<LoadingState />}>{createElement(Component)}</Suspense>
}

// Routes are derived from the manifest — never hand-maintained here.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      ...routes.map((r) =>
        r.path === '/'
          ? { index: true as const, element: wrap(r.Component) }
          : { path: r.path.replace(/^\//, ''), element: wrap(r.Component) },
      ),
      { path: '*', element: <NotFound /> },
    ],
  },
])
