# 포트폴리오 API 문서

이 API는 바이브 코딩의 포트폴리오 정보를 JSON 형식으로 제공합니다. 웹사이트에 접속하지 않아도 개발자 정보와 포트폴리오를 조회할 수 있습니다.

## Base URL

```
http://localhost:3000/api/portfolio
```

프로덕션 환경에서는 실제 도메인으로 변경됩니다.

## 엔드포인트

### 1. 전체 포트폴리오 데이터

모든 포트폴리오 정보를 한 번에 조회합니다.

**요청**
```
GET /api/portfolio
```

**응답 예시**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "바이브 코딩",
      "title": "프론트엔드 엔지니어",
      "tagline": "바이브 코딩 첫 Next.js 프로젝트",
      "description": "데이터 기반 실험과 디자인 시스템 운영 경험을 바탕으로...",
      "email": "hello@vibecoding.dev",
      "github": "https://github.com/vibe-coding",
      "yearsOfExperience": 3,
      "role": "프론트엔드 리드"
    },
    "projects": [...],
    "experiences": [...],
    "skills": [...]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. 프로필 정보만 조회

**요청**
```
GET /api/portfolio/profile
```

**응답 예시**
```json
{
  "success": true,
  "data": {
    "name": "바이브 코딩",
    "title": "프론트엔드 엔지니어",
    "tagline": "바이브 코딩 첫 Next.js 프로젝트",
    "description": "데이터 기반 실험과 디자인 시스템 운영 경험을 바탕으로...",
    "email": "hello@vibecoding.dev",
    "github": "https://github.com/vibe-coding",
    "yearsOfExperience": 3,
    "role": "프론트엔드 리드"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. 프로젝트 목록 조회

**요청**
```
GET /api/portfolio/projects
```

**응답 예시**
```json
{
  "success": true,
  "data": [
    {
      "title": "실시간 협업 IDE 플랫폼",
      "description": "WebSocket 기반 시그널 서버와 Monaco Editor를 결합해...",
      "impact": "세션 동기화 지연 150ms 이하, 주당 300+ 팀이 사용하는 내부 도구로 확장",
      "stack": ["Next.js", "tRPC", "WebSocket", "PostgreSQL", "Redis"]
    },
    ...
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. 경력 정보 조회

**요청**
```
GET /api/portfolio/experiences
```

**응답 예시**
```json
{
  "success": true,
  "data": [
    {
      "company": "Vibe Coding Lab",
      "role": "프론트엔드 리드",
      "period": "2023.06 - 현재",
      "summary": "제품 로드맵 수립, 디자인 시스템 운영..."
    },
    ...
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. 기술 스택 조회

**요청**
```
GET /api/portfolio/skills
```

**응답 예시**
```json
{
  "success": true,
  "data": [
    {
      "title": "Frontend",
      "items": ["Next.js", "React", "TanStack Query", "Next Auth", "Zustand"]
    },
    {
      "title": "Backend & DevOps",
      "items": ["Node.js", "tRPC", "PostgreSQL", "Prisma", "Docker", "Vercel"]
    },
    ...
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 데이터 구조

### Profile
```typescript
{
  name: string;
  title: string;
  tagline: string;
  description: string;
  email: string;
  github?: string;
  yearsOfExperience: number;
  role: string;
}
```

### Project
```typescript
{
  title: string;
  description: string;
  impact: string;
  stack: string[];
}
```

### Experience
```typescript
{
  company: string;
  role: string;
  period: string;
  summary: string;
}
```

### SkillGroup
```typescript
{
  title: string;
  items: string[];
}
```

## 에러 응답

모든 엔드포인트는 오류 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "success": false,
  "error": "에러 메시지",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 캐싱

모든 응답은 다음 헤더를 포함합니다:
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

이는 1시간 동안 캐시되며, 24시간 동안 stale-while-revalidate가 적용됩니다.

## 사용 예시

### cURL
```bash
curl http://localhost:3000/api/portfolio
```

### JavaScript (fetch)
```javascript
const response = await fetch('http://localhost:3000/api/portfolio');
const data = await response.json();
console.log(data);
```

### TypeScript
```typescript
interface PortfolioResponse {
  success: boolean;
  data: PortfolioData;
  timestamp: string;
}

const response = await fetch('http://localhost:3000/api/portfolio');
const result: PortfolioResponse = await response.json();
```

## 업데이트

포트폴리오 데이터를 업데이트하려면 `lib/data/portfolio.ts` 파일을 수정하면 됩니다. 변경사항은 모든 API 엔드포인트에 자동으로 반영됩니다.

