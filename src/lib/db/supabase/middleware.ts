import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 极简配置：自动初始化连接
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  
  // 自动从环境变量获取配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => 
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // 自动处理认证状态
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // 如果需要认证的路由，重定向到登录页
    if (!user && !request.nextUrl.pathname.startsWith('/auth') && 
        !request.nextUrl.pathname.startsWith('/_next') && 
        !request.nextUrl.pathname.startsWith('/api')) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  } catch {
    // 静默处理错误
  }

  return supabaseResponse
}
