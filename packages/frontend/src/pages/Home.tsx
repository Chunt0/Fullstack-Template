import { Palette } from 'lucide-react'
import { PuttyMascot } from '@/components/brand/PuttyMascot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_NAME, APP_SLOGAN } from '@/lib/config'

export default function Home() {
  return (
    <div>
      <section className="mb-8 flex flex-col items-center gap-3 py-10 text-center">
        <PuttyMascot size={64} glow />
        <h1 className="text-3xl font-bold tracking-tight lowercase">{APP_NAME}</h1>
        <p className="od-slogan">{APP_SLOGAN}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          A self-hosted workspace — private, local-first, no telemetry. Your data, your hardware.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add a feature</CardTitle>
            <CardDescription>schema → route → hook → page → manifest</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Follow the build sequence in <code>CLAUDE.md</code>. The Announcements page is a worked
            example to copy, then remove with <code>bun run eject:reference</code>.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Design system</CardTitle>
            <CardDescription>coral accent · 18 themes · Inter + Fira Code</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Compose pages from <code>components/ui</code>, <code>feedback</code>, and{' '}
            <code>patterns</code>. Switch any of the 18 themes from the{' '}
            <Palette className="inline size-3.5 align-text-bottom" aria-hidden /> in the top bar.
            See <code>docs/DESIGN_SYSTEM.md</code>.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
