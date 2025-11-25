export interface Recommendation {
  id: string;
  title: string;
  message: string;
  context: string;
}
import supabase from '@/lib/supabase';

const recommendationPool: Recommendation[] = [
  {
    id: 'first-step',
    title: '첫 줄의 코드도 충분히 의미 있어요',
    message:
      "바이브 코딩의 첫 Next.js 프로젝트처럼 천천히 구조를 살피고 한 줄씩 고쳐 보세요. 작은 변화가 페이지 전체에 생기를 불어넣습니다.",
    context: 'Next.js Hero Section',
  },
  {
    id: 'api-lab',
    title: 'API 실습 구역을 마음껏 활용하세요',
    message:
      '방명록, 좋아요, 랜덤 추천 API는 실시간으로 결과를 확인할 수 있는 실험실입니다. 두려워하지 말고 요청을 보내 보세요.',
    context: 'API Practice Tabs',
  },
  {
    id: 'guestbook-cheer',
    title: '방명록 한 줄이 또 다른 개발자를 돕습니다',
    message:
      '첫 방문자라면 자신의 이름과 다짐을 남겨 보세요. 기록이 쌓일수록 커뮤니티가 탄탄해집니다.',
    context: 'Guestbook Section',
  },
  {
    id: 'like-journey',
    title: '좋아요 버튼은 피드백의 씨앗이에요',
    message:
      '바이브 코딩의 세 가지 투표 항목 중 마음에 드는 부분을 선택하고 하트를 눌러 주세요. 어떤 요소가 더 집중해야 할 부분인지 한눈에 보이거든요.',
    context: 'Likes Section',
  },
  {
    id: 'ui-focus',
    title: '디자인 시스템을 믿고 반복하세요',
    message:
      'shadcn/ui 카드와 탭은 이미 조화롭게 구성돼 있습니다. 내용을 채우는 데만 집중하면 완성도가 빠르게 올라갑니다.',
    context: 'UI System',
  },
  {
    id: 'api-flow',
    title: '백엔드는 생각보다 가까이에 있습니다',
    message:
      'lib/data에서 JSON을 정리하고 /app/api로 노출하는 패턴만 익히면 어떤 데이터든 즉시 API로 공유할 수 있어요.',
    context: 'Backend Tips',
  },
];

export async function getRandomRecommendations(count = 1): Promise<Recommendation[]> {
  if (supabase) {
    const { data, error } = await supabase.from('recommendations').select('*');
    if (error) {
      console.error('Supabase recommendations select error', error);
      // fallback
      const shuffled = [...recommendationPool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(Math.max(count, 1), recommendationPool.length));
    }
    const pool = (data as any[]).map((r) => ({
      id: String(r.id),
      title: r.title,
      message: r.message,
      context: r.context,
    }));
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(Math.max(count, 1), pool.length));
  }

  const clampedCount = Math.min(Math.max(count, 1), recommendationPool.length);
  const shuffled = [...recommendationPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, clampedCount);
}

export async function getAllRecommendations(): Promise<Recommendation[]> {
  if (supabase) {
    const { data, error } = await supabase.from('recommendations').select('*');
    if (error) {
      console.error('Supabase recommendations select error', error);
      return recommendationPool;
    }
    return (data as any[]).map((r) => ({
      id: String(r.id),
      title: r.title,
      message: r.message,
      context: r.context,
    }));
  }

  return recommendationPool;
}

