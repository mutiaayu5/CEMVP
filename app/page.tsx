import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {/* Minimalistic centered content */}
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#FFE5B4] flex items-center justify-center">
            <Construction className="h-10 w-10 text-[#D97706]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          CEMVP
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          AI Automation Marketplace
        </p>

        {/* Under Construction Badge */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE5B4] border-2 border-[#D97706] rounded-full">
            <Construction className="h-5 w-5 text-[#D97706]" />
            <span className="text-[#D97706] font-semibold text-sm uppercase tracking-wide">
              Under Construction
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-lg mt-8 max-w-md mx-auto">
          We're building something amazing! The marketplace is currently under development.
        </p>

        {/* Action Buttons */}
        {user ? (
          <div className="space-y-4 pt-8">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-green-800">
                ✅ You are signed in as: <strong>{user.email}</strong>
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-[#D97706] hover:bg-[#B45309] text-white">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" className="border-[#D97706] text-[#D97706] hover:bg-[#FFE5B4]">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center pt-8">
            <Button asChild className="bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-6 text-base">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#D97706] text-[#D97706] hover:bg-[#FFE5B4] px-8 py-6 text-base">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
