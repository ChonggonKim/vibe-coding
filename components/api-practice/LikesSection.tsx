"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 사용자 ID 생성 및 로컬 스토리지에 저장
function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  
  const storageKey = "vibe-coding-user-id";
  let userId = localStorage.getItem(storageKey);
  
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, userId);
  }
  
  return userId;
}

const voteOptions = [
  {
    id: "nextjs",
    title: "Next.js 프로젝트",
    description: "바이브 코딩의 첫 Next.js 프로젝트가 마음에 드시나요?",
  },
  {
    id: "portfolio",
    title: "포트폴리오 웹사이트",
    description: "개발자 포트폴리오 웹사이트 디자인이 마음에 드시나요?",
  },
  {
    id: "api",
    title: "API 실습 기능",
    description: "방명록, 좋아요, 랜덤 추천 API 기능이 유용하나요?",
  },
];

export default function LikesSection() {
  const [selectedVote, setSelectedVote] = useState(voteOptions[0].id);
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [likeStatuses, setLikeStatuses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId] = useState(() => getOrCreateUserId());
  const heartRef = useRef<HTMLDivElement>(null);

  // 모든 투표 항목의 좋아요 수 및 상태 불러오기
  const fetchAllLikes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/likes", {
        headers: {
          "x-user-id": userId,
        },
      });
      const data = await response.json();
      if (data.success) {
        if (data.data.counts) {
          // 모든 항목의 좋아요 수
          setLikesCounts(data.data.counts);
          setLikeStatuses(data.data.statuses || {});
        } else {
          // 단일 항목 (하위 호환성)
          setLikesCounts({ [selectedVote]: data.data.count });
          setLikeStatuses({ [selectedVote]: data.data.isLiked });
        }
      } else {
        setError(data.error || "좋아요 수를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("좋아요 수를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 선택한 투표 항목 변경 시 해당 항목의 상태 불러오기
  const handleVoteChange = async (voteId: string) => {
    setSelectedVote(voteId);
    // 이미 불러온 데이터가 있으면 사용, 없으면 새로 불러오기
    if (!likesCounts[voteId] && likesCounts[voteId] !== 0) {
      await fetchAllLikes();
    }
  };

  // 좋아요 토글
  const handleToggle = async () => {
    setIsToggling(true);
    setError(null);
    setSuccess(null);

    // 호버 이펙트 애니메이션
    if (heartRef.current) {
      heartRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        heartRef.current?.classList.remove("animate-pulse");
      }, 300);
    }

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, voteId: selectedVote }),
      });

      const data = await response.json();

      if (data.success) {
        // 선택한 항목의 좋아요 수 및 상태 업데이트
        setLikesCounts((prev) => ({
          ...prev,
          [selectedVote]: data.data.count,
        }));
        setLikeStatuses((prev) => ({
          ...prev,
          [selectedVote]: data.data.isLiked,
        }));
        setSuccess(data.message);
        // 2초 후 성공 메시지 제거
        setTimeout(() => setSuccess(null), 2000);
      } else {
        setError(data.error || "좋아요 토글에 실패했습니다.");
      }
    } catch (err) {
      setError("좋아요 토글 중 오류가 발생했습니다.");
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    fetchAllLikes();
  }, []);

  const currentVote = voteOptions.find((v) => v.id === selectedVote) || voteOptions[0];
  const currentLikesCount = likesCounts[selectedVote] ?? 0;
  const currentIsLiked = likeStatuses[selectedVote] ?? false;

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>바이브 코딩 좋아요 투표</CardTitle>
              <CardDescription className="mt-2">
                인스타그램처럼 좋아요를 누르고 취소할 수 있습니다
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllLikes}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 투표 옵션 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              투표할 항목 선택
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {voteOptions.map((option) => {
                const optionLikesCount = likesCounts[option.id] ?? 0;
                const optionIsLiked = likeStatuses[option.id] ?? false;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVoteChange(option.id)}
                    className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                      selectedVote === option.id
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                          {option.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Heart
                          className={`h-5 w-5 transition-all ${
                            optionIsLiked
                              ? "fill-red-500 text-red-500"
                              : "fill-neutral-300 text-neutral-300"
                          }`}
                        />
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                          {optionLikesCount}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 현재 투표 항목 및 좋아요 수 표시 */}
          <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-gradient-to-br from-pink-50/50 via-red-50/30 to-pink-50/50 p-12 dark:border-neutral-800 dark:from-pink-950/20 dark:via-red-950/10 dark:to-pink-950/20">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                <span className="text-lg text-neutral-500 dark:text-neutral-400">
                  불러오는 중...
                </span>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {currentVote.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                    {currentVote.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    ref={heartRef}
                    className={`transition-transform duration-200 hover:scale-110 ${
                      currentIsLiked ? "animate-bounce" : ""
                    }`}
                  >
                    <Heart
                      className={`h-12 w-12 transition-all duration-200 ${
                        currentIsLiked
                          ? "fill-red-500 text-red-500"
                          : "fill-neutral-300 text-neutral-300 hover:fill-red-300 hover:text-red-300"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-red-600 dark:text-red-400">
                      {currentLikesCount}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {currentIsLiked ? "좋아요를 눌렀습니다" : "좋아요를 눌러주세요"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-base">
                  {currentLikesCount}개의 좋아요
                </Badge>
              </>
            )}
          </div>

          {/* 좋아요 버튼 */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleToggle}
              disabled={isToggling || isLoading}
              className={`group relative w-full max-w-xs overflow-hidden rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ${
                currentIsLiked
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              } hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 disabled:opacity-50 disabled:hover:scale-100`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isToggling ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    처리 중...
                  </>
                ) : currentIsLiked ? (
                  <>
                    <Heart className="h-5 w-5 fill-white" />
                    좋아요 취소
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    좋아요
                  </>
                )}
              </div>
              {/* 호버 이펙트 배경 */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            {error && (
              <div className="w-full max-w-xs rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="w-full max-w-xs rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
                {success}
              </div>
            )}
          </div>

          {/* 설명 */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              💡 <strong>인스타그램 스타일 좋아요:</strong> 좋아요 버튼을 한 번 더 클릭하면
              취소됩니다. 서버에서 좋아요 상태를 기억하므로 새로고침해도 유지됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

