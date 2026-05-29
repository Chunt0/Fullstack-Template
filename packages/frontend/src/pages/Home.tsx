import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div>
      <PageHeader title="Home" description="Your new app's starting point." />
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
            <CardDescription>Radix + CVA primitives</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Compose pages from <code>components/ui</code>, <code>feedback</code>, and{' '}
            <code>patterns</code>. See <code>docs/DESIGN_SYSTEM.md</code>.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
