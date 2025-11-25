import supabase from '@/lib/supabase';

export interface Project {
  title: string;
  description: string;
  impact: string;
  stack: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    tagline: string;
    description: string;
    email: string;
    github?: string;
    yearsOfExperience: number;
    role: string;
  };
  projects: Project[];
  experiences: Experience[];
  skills: SkillGroup[];
}

// 메모리 폴백용 기본 데이터
const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "바이브 코딩",
    title: "프론트엔드 엔지니어",
    tagline: "바이브 코딩 첫 Next.js 프로젝트",
    description:
      "데이터 기반 실험과 디자인 시스템 운영 경험을 바탕으로, 프로덕트 아이디어를 빠르게 검증하고 안정적으로 확장 가능한 환경을 설계합니다.",
    email: "hello@vibecoding.dev",
    github: "https://github.com/vibe-coding",
    yearsOfExperience: 3,
    role: "프론트엔드 리드",
  },
  projects: [
    {
      title: "실시간 협업 IDE 플랫폼",
      description:
        "WebSocket 기반 시그널 서버와 Monaco Editor를 결합해 여러 사용자가 동시에 코드 리뷰와 페어 프로그래밍을 진행할 수 있는 클라우드 IDE를 제작했습니다.",
      impact:
        "세션 동기화 지연 150ms 이하, 주당 300+ 팀이 사용하는 내부 도구로 확장",
      stack: ["Next.js", "tRPC", "WebSocket", "PostgreSQL", "Redis"],
    },
    {
      title: "AI 코드 베이스 탐색 도우미",
      description:
        "대규모 리포지토리에서 의미 기반 검색을 제공하고, LLM 체인을 이용해 코드 설명과 리팩터링 제안을 제공하는 개발 플러그인을 만들었습니다.",
      impact: "온보딩 시간 40% 단축, 월간 2만 회 질의를 처리하는 서비스",
      stack: ["Next.js", "LangChain", "OpenAI API", "Supabase", "Tailwind CSS"],
    },
    {
      title: "모듈형 디자인 시스템",
      description:
        "일관된 인터랙션 경험을 위해 토큰 기반 디자인 시스템과 컴포넌트 라이브러리를 구축하고 사내 프로젝트 6개에 적용했습니다.",
      impact: "UI 개발 속도 30% 향상, 접근성 이슈 20% 감소",
      stack: ["Storybook", "Next.js", "Radix UI", "TypeScript"],
    },
  ],
  experiences: [
    {
      company: "Vibe Coding Lab",
      role: "프론트엔드 리드",
      period: "2023.06 - 현재",
      summary:
        "제품 로드맵 수립, 디자인 시스템 운영, 데이터 파이프라인 자동화를 통해 실험-배포 사이클을 단축했습니다.",
    },
    {
      company: "Nextrail",
      role: "풀스택 엔지니어",
      period: "2021.03 - 2023.05",
      summary:
        "B2B 대시보드, 인증 시스템, 멀티 테넌트 인프라를 설계하고 유지보수했습니다.",
    },
  ],
  skills: [
    {
      title: "Frontend",
      items: ["Next.js", "React", "TanStack Query", "Next Auth", "Zustand"],
    },
    {
      title: "Backend & DevOps",
      items: ["Node.js", "tRPC", "PostgreSQL", "Prisma", "Docker", "Vercel"],
    },
    {
      title: "Productivity",
      items: ["Jira", "Figma", "Storybook", "GitHub Actions", "Linear"],
    },
  ],
};

// DB 또는 메모리 기본 데이터에서 포트폴리오 정보를 읽음
export async function getPortfolioData(): Promise<PortfolioData> {
  if (supabase) {
    const { data, error } = await supabase
      .from('portfolio')
      .select('data')
      .eq('id', 'vibe-coding')
      .single();

    if (error) {
      console.error('Supabase portfolio select error', error);
      return defaultPortfolioData;
    }

    if (data && (data as any).data) {
      return (data as any).data as PortfolioData;
    }
  }

  return defaultPortfolioData;
}

// 기본값 내보내기 (호환성용)
export const portfolioData = defaultPortfolioData;