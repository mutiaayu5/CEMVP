import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Your account information and connection status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">{user.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Connection Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Connected to Supabase</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Status</CardTitle>
            <CardDescription>
              Verify that all integrations are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm">✅ Supabase Authentication</span>
                <span className="text-xs text-green-700">Working</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm">✅ Protected Routes</span>
                <span className="text-xs text-green-700">Working</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm">✅ shadcn/ui Components</span>
                <span className="text-xs text-green-700">Working</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                <span className="text-sm">⏳ Vercel Deployment</span>
                <span className="text-xs text-blue-700">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

