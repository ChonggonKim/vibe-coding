"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 방명록 목록 불러오기
  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      if (data.success) {
        setEntries(data.data);
      } else {
        setError(data.error || "방명록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("방명록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 방명록 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 방명록을 삭제하시겠습니까?")) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("방명록이 삭제되었습니다.");
        // 목록 새로고침
        await fetchEntries();
      } else {
        setError(data.error || "방명록 삭제에 실패했습니다.");
      }
    } catch (err) {
      setError("방명록 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // 새 방명록 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("방명록이 작성되었습니다!");
        setName("");
        setMessage("");
        // 목록 새로고침
        await fetchEntries();
      } else {
        setError(data.error || "방명록 작성에 실패했습니다.");
      }
    } catch (err) {
      setError("방명록 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* 작성 폼 */}
      <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
        <CardHeader>
          <CardTitle>방명록 작성</CardTitle>
          <CardDescription>이름과 메시지를 남겨주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                maxLength={50}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                메시지
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                maxLength={500}
                rows={4}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {message.length}/500
              </p>
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
                {success}
              </div>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  방명록 작성
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 방명록 목록 */}
      <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>방명록 목록</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEntries}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "새로고침"
              )}
            </Button>
          </div>
          <CardDescription>
            총 {entries.length}개의 방명록이 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
              아직 방명록이 없습니다. 첫 번째 방명록을 작성해보세요!
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                          {entry.name}
                        </Badge>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        {entry.message}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {deletingId === entry.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

