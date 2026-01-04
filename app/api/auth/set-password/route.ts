import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:5',message:'POST set-password entry',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:17',message:'Unauthorized - returning 401',data:{hasError:!!authError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
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
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:25',message:'JSON parsed successfully',data:{hasPasswordSet:'passwordSet' in requestBody},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } catch (jsonError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:28',message:'JSON parse error',data:{error:String(jsonError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { passwordSet } = requestBody

    // Update profile to mark password as set
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:30',message:'Before database update',data:{userId:user.id,passwordSet:passwordSet === true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          passwordSet: passwordSet === true,
        }
      })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:38',message:'Database update successful',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (dbError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:41',message:'Database update error',data:{error:String(dbError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: 'Password status updated',
    })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/14b86784-da4f-452a-b8f8-43f91f8ed809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/set-password/route.ts:50',message:'Error caught in catch block',data:{error:String(error),errorType:error instanceof Error ? error.constructor.name : typeof error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Error setting password status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

