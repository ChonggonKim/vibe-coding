"use client";

import Image from "next/image";
import { ArrowUpRight, Github, Mail, Sparkles, MessageSquare, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { portfolioData } from "@/lib/data/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestbookSection from "@/components/api-practice/GuestbookSection";
import LikesSection from "@/components/api-practice/LikesSection";
import RecommendationSection from "@/components/api-practice/RecommendationSection";

const heroImages = [
  { src: "/window.svg", alt: "제품 인터페이스 미리보기", size: 260 },
  { src: "/globe.svg", alt: "글로벌 네트워크 아이콘", size: 160 },
  { src: "/file.svg", alt: "문서 썸네일", size: 140 },
  { src: "/next.svg", alt: "Next.js 로고", size: 120 },
];

const { projects, experiences, skills: skillGroups, profile } = portfolioData;

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] xl:grid-cols-[1.3fr,0.7fr]">
          <Card className="relative overflow-hidden border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/70">
            <CardHeader className="space-y-6">
              <Badge variant="glow" className="w-fit gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {profile.tagline}
              </Badge>
              <CardTitle className="text-4xl font-semibold leading-tight sm:text-5xl">
                {profile.description.split(" ").slice(0, 8).join(" ")}
                <br />
                {profile.title}, {profile.name}입니다.
              </CardTitle>
              <CardDescription className="text-lg">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="gap-2 shadow-xl shadow-blue-600/30"
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" />
                  프로젝트 문의하기
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                <a href="#projects">
                  대표 작업 살펴보기
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          </Card>

          <Card className="relative flex flex-col gap-6 overflow-hidden border-dashed border-neutral-200 bg-gradient-to-br from-white via-blue-50/60 to-white dark:border-neutral-800 dark:from-neutral-900 dark:via-blue-950/20 dark:to-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-semibold">
                  {profile.yearsOfExperience}년 차 {profile.role}
                </CardTitle>
                <CardDescription className="mt-2 max-w-sm text-base">
                  실사용자 피드백과 빠른 실험에 집중해 협업 IDE, AI 코드 도우미
                  등 다양한 제품을 만들어왔습니다.
                </CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {heroImages.map((image) => (
                <div
                  key={image.alt}
                  className="flex items-center justify-center rounded-2xl border border-neutral-200/60 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.size}
                    height={image.size}
                    className="h-auto w-32 sm:w-36"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
              <p>• 실험-배포 리드타임 40% 단축</p>
              <p>• 사내 디자인 시스템 도입 및 유지</p>
              <p>• 멀티 테넌트 아키텍처/인프라 경험</p>
            </div>
          </Card>
        </section>

        <section id="projects" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="uppercase tracking-wide">
                Projects
              </Badge>
              <h2 className="mt-3 text-3xl font-semibold">
                사용자 문제를 해결한 대표 작업
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub 살펴보기
                  <Github className="h-4 w-4" />
                </a>
              )}
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card
                key={project.title}
                className="border-neutral-200 bg-white/90 transition hover:border-blue-300 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/80"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <span>{project.title}</span>
                    <ArrowUpRight className="h-5 w-5 text-neutral-400" />
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
                    {project.impact}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {project.stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="border-neutral-200 px-3 py-1 dark:border-neutral-700"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit uppercase tracking-wide">
              Visual Deck
            </Badge>
            <h2 className="text-3xl font-semibold">
              결과물 스냅샷 & UI 데모
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              기존 Next.js 데모 리소스를 활용해 레이아웃과 인터랙션을 빠르게
              시각화합니다.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/80">
              <Image
                src="/window.svg"
                alt="에디터 윈도우"
                width={320}
                height={200}
                className="mx-auto h-auto w-full max-w-xs transition duration-500 group-hover:scale-105"
              />
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-blue-600">
                  UI Shell
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  멀티 패널 레이아웃
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/80">
              <Image
                src="/globe.svg"
                alt="실시간 글로벌 지도"
                width={320}
                height={200}
                className="mx-auto h-auto w-full max-w-xs transition duration-500 group-hover:scale-105"
              />
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-blue-600">
                  Collaboration
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  글로벌 동기화 현황
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/80">
              <Image
                src="/file.svg"
                alt="문서 형상 비교"
                width={320}
                height={200}
                className="mx-auto h-auto w-full max-w-xs transition duration-500 group-hover:scale-105"
              />
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-blue-600">
                  Knowledge Base
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  코드 문서 자동화
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
            <CardHeader>
              <Badge variant="secondary" className="uppercase tracking-wide">
                Experience
              </Badge>
              <CardTitle className="text-3xl font-semibold">
                팀과 제품을 성장시킨 여정
              </CardTitle>
              <CardDescription>
                로드맵 수립부터 품질 지표 관리까지 엔드투엔드 경험을
                제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp) => (
                <div
                  key={exp.company}
                  className="rounded-2xl border border-transparent p-4 transition hover:border-blue-200 dark:hover:border-blue-500/40"
                >
                  <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                    <span>{exp.company}</span>
                    <span>{exp.period}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">{exp.role}</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                    {exp.summary}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
            <CardHeader>
              <Badge variant="secondary" className="uppercase tracking-wide">
                Skills
              </Badge>
              <CardTitle className="text-3xl font-semibold">
                문제 해결을 위한 기술 스택
              </CardTitle>
              <CardDescription>
                제품 수명주기 전반을 고려한 기술 선택을 지향합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {skillGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-neutral-100/70 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card className="border-neutral-200 bg-gradient-to-br from-white via-blue-50 to-white p-10 text-center dark:border-neutral-900 dark:from-neutral-900 dark:via-blue-950/40 dark:to-neutral-900">
          <Badge variant="secondary" className="mx-auto w-fit uppercase tracking-wide">
            Contact
          </Badge>
          <CardTitle className="mt-4 text-3xl font-semibold">
            함께 만들 제품이 있으신가요?
          </CardTitle>
          <CardDescription className="mx-auto mt-4 max-w-2xl text-lg">
            실험적인 아이디어부터 대규모 서비스 고도화까지, 필요한 영역을
            알려주시면 함께 설계안을 제안드립니다.
          </CardDescription>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <a href={`mailto:${profile.email}`}>
                <Mail className="h-4 w-4" />
                {profile.email}
              </a>
            </Button>
            {profile.github && (
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub에서 더 보기
                </a>
              </Button>
            )}
          </div>
        </Card>

        <section className="space-y-8">
          <Card className="border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/80">
            <CardHeader>
              <Badge variant="secondary" className="w-fit uppercase tracking-wide">
                API 실습
              </Badge>
              <CardTitle className="text-3xl font-semibold">
                백엔드 API 기능 테스트
              </CardTitle>
              <CardDescription className="text-lg">
                방명록, 좋아요, 랜덤 추천 API를 직접 테스트해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="guestbook" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="guestbook" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    방명록
                  </TabsTrigger>
                  <TabsTrigger value="likes" className="gap-2">
                    <Heart className="h-4 w-4" />
                    좋아요
                  </TabsTrigger>
                  <TabsTrigger value="recommendation" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    랜덤 추천
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="guestbook" className="mt-6">
                  <GuestbookSection />
                </TabsContent>

                <TabsContent value="likes" className="mt-6">
                  <LikesSection />
                </TabsContent>

                <TabsContent value="recommendation" className="mt-6">
                  <RecommendationSection />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
