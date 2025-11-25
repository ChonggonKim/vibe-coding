// 메모리 기반 저장소 (개발용, 프로덕션에서는 DB 사용 권장)
// 기본 더미 숫자: 42
// 각 투표 항목별로 좋아요 수와 좋아요한 사용자 추적
import supabase from '@/lib/supabase';

interface VoteLikes {
  count: number;
  likedUserIds: Set<string>;
}

// 메모리 기본값은 유지
const voteLikesMap: Record<string, VoteLikes> = {
  nextjs: { count: 42, likedUserIds: new Set<string>() },
  portfolio: { count: 38, likedUserIds: new Set<string>() },
  api: { count: 45, likedUserIds: new Set<string>() },
};

export async function getLikesCount(voteId: string): Promise<number> {
  if (supabase) {
    const { data, error } = await supabase
      .from('vote_items')
      .select('count')
      .eq('id', voteId)
      .single();
    if (error) {
      console.error('Supabase getLikesCount error', error);
      return voteLikesMap[voteId]?.count ?? 0;
    }
    return (data?.count as number) ?? 0;
  }

  return voteLikesMap[voteId] ? voteLikesMap[voteId].count : 0;
}

export async function getAllLikesCounts(): Promise<Record<string, number>> {
  if (supabase) {
    const { data, error } = await supabase.from('vote_items').select('*');
    if (error) {
      console.error('Supabase getAllLikesCounts error', error);
      // fallback
      const result: Record<string, number> = {};
      for (const [voteId, voteLikes] of Object.entries(voteLikesMap)) {
        result[voteId] = voteLikes.count;
      }
      return result;
    }
    const result: Record<string, number> = {};
    (data as any[]).forEach((r) => {
      result[String(r.id)] = r.count ?? 0;
    });
    return result;
  }

  const result: Record<string, number> = {};
  for (const [voteId, voteLikes] of Object.entries(voteLikesMap)) {
    result[voteId] = voteLikes.count;
  }
  return result;
}

export async function toggleLike(
  voteId: string,
  userId: string
): Promise<{ count: number; isLiked: boolean }> {
  if (supabase) {
    try {
      // 체크
      const { data: existing } = await supabase
        .from('user_likes')
        .select('*')
        .eq('vote_id', voteId)
        .eq('user_id', userId)
        .limit(1);

      if (existing && existing.length > 0) {
        // 삭제
        await supabase.from('user_likes').delete().eq('vote_id', voteId).eq('user_id', userId);
        // 카운트 감소
        await supabase.rpc('decrement_vote_count', { vid: voteId });
        // fallback: 읽어오기
        const count = await getLikesCount(voteId);
        return { count, isLiked: false };
      } else {
        // 추가
        await supabase.from('user_likes').insert([{ vote_id: voteId, user_id: userId }]);
        await supabase.rpc('increment_vote_count', { vid: voteId });
        const count = await getLikesCount(voteId);
        return { count, isLiked: true };
      }
    } catch (err) {
      console.error('Supabase toggleLike error', err);
      // fallback to memory
    }
  }

  // 메모리 fallback
  if (!voteLikesMap[voteId]) {
    voteLikesMap[voteId] = { count: 0, likedUserIds: new Set<string>() };
  }

  const voteLikes = voteLikesMap[voteId];

  if (voteLikes.likedUserIds.has(userId)) {
    voteLikes.count = Math.max(0, voteLikes.count - 1);
    voteLikes.likedUserIds.delete(userId);
    return { count: voteLikes.count, isLiked: false };
  } else {
    voteLikes.count += 1;
    voteLikes.likedUserIds.add(userId);
    return { count: voteLikes.count, isLiked: true };
  }
}

export async function checkLikeStatus(voteId: string, userId: string): Promise<boolean> {
  if (supabase) {
    const { data, error } = await supabase
      .from('user_likes')
      .select('*')
      .eq('vote_id', voteId)
      .eq('user_id', userId)
      .limit(1);
    if (error) {
      console.error('Supabase checkLikeStatus error', error);
      return voteLikesMap[voteId]?.likedUserIds.has(userId) ?? false;
    }
    return !!(data && (data as any[]).length > 0);
  }

  const voteLikes = voteLikesMap[voteId];
  return voteLikes ? voteLikes.likedUserIds.has(userId) : false;
}

export async function resetLikes(): Promise<void> {
  if (supabase) {
    // 간단한 reset 구현: vote_items의 count를 초기값(42)로 설정
    // 실제 운영에서는 신중히 사용하세요.
    await supabase.from('vote_items').update({ count: 42 }).in('id', ['nextjs', 'portfolio', 'api']);
    // user_likes 초기화
    await supabase.from('user_likes').delete().neq('id', -1);
    return;
  }

  for (const voteId of Object.keys(voteLikesMap)) {
    voteLikesMap[voteId] = { count: 42, likedUserIds: new Set<string>() };
  }
}

