import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // 如果是访问上传的图片，直接放行
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/thumbnails/')) {
      return NextResponse.next();
    }

    // 如果用户未登录且尝试访问受保护的路由，将被重定向到登录页面
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
    },
  }
);

// 配置需要保护的路由
export const config = {
  matcher: [
    '/upload',
    '/profile',
    '/api/upload',
    '/uploads/:path*',
    '/thumbnails/:path*'
  ]
};
