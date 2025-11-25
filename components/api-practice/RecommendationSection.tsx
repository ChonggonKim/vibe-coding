"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Sparkles, Quote } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  id: string;
  title: string;
  message: string;
  context: string;
}

export default function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Recommendation[]>([]);

  const primary = useMemo(() => recommendations[0] ?? null, [recommendations]);
  const secondary = useMemo(() => recommendations.slice(1), [recommendations]);

  const fetchRecommendations = async (count = 3) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/recommendations?count=${count}`);
      const data = await response.json();
      if (data.success) {
        const items: Recommendation[] = data.data.recommendations;
        if (items.length > 0) {
          setRecommendations(items);
          setHistory((prev) => {
            const combined = [...items, ...prev];
            const uniqueById = combined.filter(
              (rec, index, self) => self.findIndex((item) => item.id === rec.id && item.message === rec.message) === index,
            );
            return uniqueById.slice(0, 6);
          });
        }
      } else {
        setError(data.error || "추천 문구를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("추천 문구를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-2 flex w-fit items-center gap-2 uppercase tracking-wide">
              <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-300" />
              추천 API
            </Badge>
            <CardTitle>오늘의 한 줄 추천</CardTitle>
            <CardDescription className="mt-2">
              바이브 코딩을 처음 배우는 사람에게 힘이 되는 메시지를 API로 전달합니다
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fetchRecommendations()}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            새 추천 받기
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* 메인 추천 */}
          {primary ? (
            <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 shadow-lg dark:border-neutral-800 dark:from-blue-950/30 dark:via-neutral-900 dark:to-purple-950/30">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/10 p-3 text-blue-500 dark:text-blue-300">
                  <Quote className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-300">
                    {primary.context}
                  </p>
                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                    {primary.title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-200">{primary.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-10 dark:border-neutral-800">
              <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                추천 문구를 불러오는 중입니다...
              </div>
            </div>
          )}

          {/* 추가 추천 카드 */}
          {secondary.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {secondary.map((rec) => (
                <div
                  key={rec.id}
                  className="h-full rounded-2xl border border-neutral-200 p-5 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50/40 dark:border-neutral-800 dark:hover:border-blue-400 dark:hover:bg-blue-950/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {rec.context}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{rec.title}</h4>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{rec.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* API 응답 예시 / 히스토리 */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                최근 추천 히스토리
              </p>
              <div className="mt-4 space-y-3">
                {history.slice(0, 4).map((rec) => (
                  <div key={`${rec.id}-${rec.title}`} className="flex items-start gap-3 text-sm">
                    <span className="text-blue-500">•</span>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-100">{rec.title}</p>
                      <p className="text-neutral-600 dark:text-neutral-300">{rec.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                API 응답: /api/recommendations?count=3
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

