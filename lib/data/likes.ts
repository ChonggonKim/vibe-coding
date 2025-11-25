// 메모리 기반 저장소 (개발용, 프로덕션에서는 DB 사용 권장)
// 기본 더미 숫자: 42
// 각 투표 항목별로 좋아요 수와 좋아요한 사용자 추적
interface VoteLikes {
  count: number;
  likedUserIds: Set<string>;
}

const voteLikesMap: Record<string, VoteLikes> = {
  nextjs: { count: 42, likedUserIds: new Set<string>() },
  portfolio: { count: 38, likedUserIds: new Set<string>() },
  api: { count: 45, likedUserIds: new Set<string>() },
};

export function getLikesCount(voteId: string): number {
  const voteLikes = voteLikesMap[voteId];
  return voteLikes ? voteLikes.count : 0;
}

export function getAllLikesCounts(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [voteId, voteLikes] of Object.entries(voteLikesMap)) {
    result[voteId] = voteLikes.count;
  }
  return result;
}

export function toggleLike(
  voteId: string,
  userId: string
): { count: number; isLiked: boolean } {
  if (!voteLikesMap[voteId]) {
    // 새로운 투표 항목인 경우 초기화
    voteLikesMap[voteId] = { count: 0, likedUserIds: new Set<string>() };
  }

  const voteLikes = voteLikesMap[voteId];

  if (voteLikes.likedUserIds.has(userId)) {
    // 이미 좋아요한 경우 취소
    voteLikes.count = Math.max(0, voteLikes.count - 1);
    voteLikes.likedUserIds.delete(userId);
    return { count: voteLikes.count, isLiked: false };
  } else {
    // 좋아요 추가
    voteLikes.count += 1;
    voteLikes.likedUserIds.add(userId);
    return { count: voteLikes.count, isLiked: true };
  }
}

export function checkLikeStatus(voteId: string, userId: string): boolean {
  const voteLikes = voteLikesMap[voteId];
  return voteLikes ? voteLikes.likedUserIds.has(userId) : false;
}

export function resetLikes(): void {
  for (const voteId of Object.keys(voteLikesMap)) {
    voteLikesMap[voteId] = { count: 42, likedUserIds: new Set<string>() };
  }
}

