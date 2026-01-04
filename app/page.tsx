import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Construction className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">CEMVP</CardTitle>
          <CardDescription className="text-lg">
            AI Automation Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full text-amber-800 text-sm font-medium">
              <Construction className="h-4 w-4" />
              <span>Under Construction</span>
            </div>
            <p className="text-muted-foreground mt-4">
              We're building something amazing! The marketplace is currently under development.
            </p>
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
