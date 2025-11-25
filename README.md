This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase (Optional) — DB 연동 안내

이 프로젝트는 Supabase에 연결하여 다음 리소스를 DB로 대체할 수 있도록 준비되어 있습니다:

- `guestbook` (방명록)
- `vote_items`, `user_likes` (좋아요 기능)
- `recommendations` (추천 문구 풀)
- `portfolio` (포트폴리오 전체 JSON 저장)

설치 및 적용 방법 (요약):

1. Supabase 프로젝트를 생성하거나 기존 `cursor-project`에 접속합니다.
2. SQL 에디터에 `supabase/migrations/001_create_tables.sql` 파일의 내용을 붙여 실행합니다.
3. 환경변수 설정 (로컬 `.env` 또는 호스팅 환경):
	- NEXT_PUBLIC_SUPABASE_URL: Supabase URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY: 익명 공개 키 (클라이언트용)
	- SUPABASE_SERVICE_ROLE_KEY: 서비스 롤 키 (서버 전용, 안전하게 보관)
4. 의존성 설치:

```powershell
npm install
# 또는
npm install @supabase/supabase-js
```

5. 로컬에서 `npm run dev`로 서버를 실행하고 API가 DB로 동작하는지 확인하세요.

참고:
- DB가 설정되지 않았더라도 기존 코드(메모리 기반)가 동작하도록 폴백이 구현되어 있습니다.
- 서비스롤 키는 절대 클라이언트(브라우저)에 노출하지 마세요.
