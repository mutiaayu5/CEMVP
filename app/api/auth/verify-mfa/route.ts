import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { isPinExpired } from '@/lib/auth/mfa'

export async function POST(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:6',message:'POST verify-mfa entry',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:14',message:'Auth check result',data:{hasUser:!!user,hasError:!!authError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (authError || !user) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:17',message:'Unauthorized - returning 401',data:{authError:authError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let requestBody;
    try {
      requestBody = await request.json()
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:25',message:'JSON parsed successfully',data:{hasPin:!!requestBody.pin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } catch (jsonError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:28',message:'JSON parse error',data:{error:String(jsonError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { pin } = requestBody

    if (!pin) {
      return NextResponse.json(
        { error: 'MFA PIN is required' },
        { status: 400 }
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:32',message:'Before database query',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    let profile;
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          mfaEnabled: true,
          mfaPin: true,
          mfaPinExpires: true,
        }
      })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:42',message:'Database query result',data:{hasProfile:!!profile,mfaEnabled:profile?.mfaEnabled,hasPin:!!profile?.mfaPin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (dbError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:45',message:'Database query error',data:{error:String(dbError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw dbError;
    }

    if (!profile || !profile.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA not enabled' },
        { status: 400 }
      )
    }

    // Check if PIN exists and is not expired
    if (!profile.mfaPin || isPinExpired(profile.mfaPinExpires)) {
      return NextResponse.json(
        { error: 'MFA PIN has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify PIN
    if (profile.mfaPin !== pin) {
      return NextResponse.json(
        { error: 'Invalid MFA PIN' },
        { status: 400 }
      )
    }

    // Mark MFA as verified
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:104',message:'Before MFA update',data:{profileId:profile.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          mfaVerified: true,
        }
      })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:113',message:'MFA update successful',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (updateError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:116',message:'MFA update error',data:{error:String(updateError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw updateError;
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:120',message:'MFA verified successfully',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      success: true,
      message: 'MFA verified successfully',
    })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/verify-mfa/route.ts:82',message:'Error caught in catch block',data:{error:String(error),errorType:error instanceof Error ? error.constructor.name : typeof error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('Error verifying MFA:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

