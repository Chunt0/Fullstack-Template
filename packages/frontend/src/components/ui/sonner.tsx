import { Toaster as SonnerToaster, toast } from 'sonner'
import { useTheme } from '@/components/layout/ThemeProvider'

export function Toaster() {
  const { resolvedTheme } = useTheme()
  return <SonnerToaster theme={resolvedTheme} richColors closeButton position="top-right" />
}

export { toast }
