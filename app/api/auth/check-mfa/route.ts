import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:5',message:'GET check-mfa entry',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:13',message:'Auth check result',data:{hasUser:!!user,hasError:!!authError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (authError || !user) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:17',message:'Unauthorized - returning 401',data:{authError:authError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:23',message:'Before database query',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    let profile;
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          mfaEnabled: true,
          mfaVerified: true,
          mfaPin: true,
          mfaPinExpires: true,
          role: true,
          passwordSet: true,
        }
      })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:38',message:'Database query result',data:{hasProfile:!!profile,mfaEnabled:profile?.mfaEnabled,role:profile?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (dbError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:41',message:'Database query error',data:{error:String(dbError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw dbError;
    }

    if (!profile) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:46',message:'Profile not found - returning 404',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if PIN is expired
    const isPinExpired = profile.mfaPinExpires ? new Date() > profile.mfaPinExpires : true
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:54',message:'Returning MFA check result',data:{requiresMfa:profile.mfaEnabled && !profile.mfaVerified,needsPasswordSetup:!profile.passwordSet && profile.role === 'ADMIN'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      mfaEnabled: profile.mfaEnabled,
      mfaVerified: profile.mfaVerified,
      requiresMfa: profile.mfaEnabled && !profile.mfaVerified,
      pinExpired: isPinExpired,
      needsPasswordSetup: !profile.passwordSet && profile.role === 'ADMIN',
      role: profile.role,
    })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/check-mfa/route.ts:63',message:'Error caught in catch block',data:{error:String(error),errorType:error instanceof Error ? error.constructor.name : typeof error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('Error checking MFA:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

