-- Supabase / PostgreSQL 초기 테이블 생성 스크립트
-- 실행 전 Supabase 프로젝트(cursor-project)의 SQL 에디터나 supabase CLI에서 실행하세요.

-- UUID 생성 함수가 필요하면 pgcrypto 사용
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 방명록 테이블
CREATE TABLE IF NOT EXISTS guestbook (
  id text PRIMARY KEY,
  name varchar(50) NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 좋아요(투표) 항목 테이블
CREATE TABLE IF NOT EXISTS vote_items (
  id text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0
);

-- 사용자별 좋아요 기록(중복 방지)
CREATE TABLE IF NOT EXISTS user_likes (
  id bigserial PRIMARY KEY,
  vote_id text NOT NULL REFERENCES vote_items(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vote_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);

-- 추천 문구 테이블
CREATE TABLE IF NOT EXISTS recommendations (
  id text PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  context text
);

-- 포트폴리오(전체 JSON 저장용)
CREATE TABLE IF NOT EXISTS portfolio (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 기본 데이터: vote_items (nextjs, portfolio, api)
INSERT INTO vote_items (id, count)
VALUES
  ('nextjs', 42),
  ('portfolio', 38),
  ('api', 45)
ON CONFLICT (id) DO NOTHING;

-- 기본 추천 문구(파일의 내용을 그대로 삽입)
INSERT INTO recommendations (id, title, message, context) VALUES
('first-step', '첫 줄의 코드도 충분히 의미 있어요', '바이브 코딩의 첫 Next.js 프로젝트처럼 천천히 구조를 살피고 한 줄씩 고쳐 보세요. 작은 변화가 페이지 전체에 생기를 불어넣습니다.', 'Next.js Hero Section')
,('api-lab', 'API 실습 구역을 마음껏 활용하세요', '방명록, 좋아요, 랜덤 추천 API는 실시간으로 결과를 확인할 수 있는 실험실입니다. 두려워하지 말고 요청을 보내 보세요.', 'API Practice Tabs')
,('guestbook-cheer', '방명록 한 줄이 또 다른 개발자를 돕습니다', '첫 방문자라면 자신의 이름과 다짐을 남겨 보세요. 기록이 쌓일수록 커뮤니티가 탄탄해집니다.', 'Guestbook Section')
,('like-journey', '좋아요 버튼은 피드백의 씨앗이에요', '바이브 코딩의 세 가지 투표 항목 중 마음에 드는 부분을 선택하고 하트를 눌러 주세요. 어떤 요소가 더 집중해야 할 부분인지 한눈에 보이거든요.', 'Likes Section')
,('ui-focus', '디자인 시스템을 믿고 반복하세요', 'shadcn/ui 카드와 탭은 이미 조화롭게 구성돼 있습니다. 내용을 채우는 데만 집중하면 완성도가 빠르게 올라갑니다.', 'UI System')
,('api-flow', '백엔드는 생각보다 가까이에 있습니다', 'lib/data에서 JSON을 정리하고 /app/api로 노출하는 패턴만 익히면 어떤 데이터든 즉시 API로 공유할 수 있어요.', 'Backend Tips')
ON CONFLICT (id) DO NOTHING;

-- 포트폴리오 초기 데이터 (portfolio 테이블에 바이브 코딩 포트폴리오 삽입)
INSERT INTO portfolio (id, data, updated_at) VALUES
('vibe-coding', 
 jsonb_build_object(
   'profile', jsonb_build_object(
     'name', '바이브 코딩',
     'title', '프론트엔드 엔지니어',
     'tagline', '바이브 코딩 첫 Next.js 프로젝트',
     'description', '데이터 기반 실험과 디자인 시스템 운영 경험을 바탕으로, 프로덕트 아이디어를 빠르게 검증하고 안정적으로 확장 가능한 환경을 설계합니다.',
     'email', 'hello@vibecoding.dev',
     'github', 'https://github.com/vibe-coding',
     'yearsOfExperience', 3,
     'role', '프론트엔드 리드'
   ),
   'projects', jsonb_build_array(
     jsonb_build_object(
       'title', '실시간 협업 IDE 플랫폼',
       'description', 'WebSocket 기반 시그널 서버와 Monaco Editor를 결합해 여러 사용자가 동시에 코드 리뷰와 페어 프로그래밍을 진행할 수 있는 클라우드 IDE를 제작했습니다.',
       'impact', '세션 동기화 지연 150ms 이하, 주당 300+ 팀이 사용하는 내부 도구로 확장',
       'stack', jsonb_build_array('Next.js', 'tRPC', 'WebSocket', 'PostgreSQL', 'Redis')
     ),
     jsonb_build_object(
       'title', 'AI 코드 베이스 탐색 도우미',
       'description', '대규모 리포지토리에서 의미 기반 검색을 제공하고, LLM 체인을 이용해 코드 설명과 리팩터링 제안을 제공하는 개발 플러그인을 만들었습니다.',
       'impact', '온보딩 시간 40% 단축, 월간 2만 회 질의를 처리하는 서비스',
       'stack', jsonb_build_array('Next.js', 'LangChain', 'OpenAI API', 'Supabase', 'Tailwind CSS')
     ),
     jsonb_build_object(
       'title', '모듈형 디자인 시스템',
       'description', '일관된 인터랙션 경험을 위해 토큰 기반 디자인 시스템과 컴포넌트 라이브러리를 구축하고 사내 프로젝트 6개에 적용했습니다.',
       'impact', 'UI 개발 속도 30% 향상, 접근성 이슈 20% 감소',
       'stack', jsonb_build_array('Storybook', 'Next.js', 'Radix UI', 'TypeScript')
     )
   ),
   'experiences', jsonb_build_array(
     jsonb_build_object(
       'company', 'Vibe Coding Lab',
       'role', '프론트엔드 리드',
       'period', '2023.06 - 현재',
       'summary', '제품 로드맵 수립, 디자인 시스템 운영, 데이터 파이프라인 자동화를 통해 실험-배포 사이클을 단축했습니다.'
     ),
     jsonb_build_object(
       'company', 'Nextrail',
       'role', '풀스택 엔지니어',
       'period', '2021.03 - 2023.05',
       'summary', 'B2B 대시보드, 인증 시스템, 멀티 테넌트 인프라를 설계하고 유지보수했습니다.'
     )
   ),
   'skills', jsonb_build_array(
     jsonb_build_object(
       'title', 'Frontend',
       'items', jsonb_build_array('Next.js', 'React', 'TanStack Query', 'Next Auth', 'Zustand')
     ),
     jsonb_build_object(
       'title', 'Backend & DevOps',
       'items', jsonb_build_array('Node.js', 'tRPC', 'PostgreSQL', 'Prisma', 'Docker', 'Vercel')
     ),
     jsonb_build_object(
       'title', 'Productivity',
       'items', jsonb_build_array('Jira', 'Figma', 'Storybook', 'GitHub Actions', 'Linear')
     )
   )
 ),
 now()
)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data,
  updated_at = EXCLUDED.updated_at;

-- 투표 카운트 원자적 증가/감소를 위한 간단한 함수
CREATE OR REPLACE FUNCTION increment_vote_count(vid text)
RETURNS void LANGUAGE sql AS $$
  UPDATE vote_items SET count = count + 1 WHERE id = vid;
$$;

CREATE OR REPLACE FUNCTION decrement_vote_count(vid text)
RETURNS void LANGUAGE sql AS $$
  UPDATE vote_items SET count = GREATEST(count - 1, 0) WHERE id = vid;
$$;

