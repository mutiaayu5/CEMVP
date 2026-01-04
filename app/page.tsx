import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">CEMVP</CardTitle>
          <CardDescription className="text-lg">
            AI Automation Marketplace - Test Website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Welcome to the CEMVP test website. This site is configured to test:
            </p>
            <ul className="list-disc list-inside text-left space-y-1 text-sm text-muted-foreground max-w-md mx-auto">
              <li>Vercel deployment</li>
              <li>Supabase connectivity</li>
              <li>Supabase authentication</li>
              <li>shadcn/ui components</li>
            </ul>
          </div>

          {user ? (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ You are signed in as: <strong>{user.email}</strong>
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="outline">
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

