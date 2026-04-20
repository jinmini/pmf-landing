# LynC Landing Page MVP

LynC의 PMF 탐색 및 고객 발견 방향성 공유를 위한 단일 페이지 랜딩 MVP입니다.  
Next.js(App Router) + TypeScript + Tailwind CSS로 구성되어 Vercel에 빠르게 배포할 수 있습니다.

## 1) 설치

```bash
npm install
```

## 2) 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 3) 프로덕션 빌드 확인

```bash
npm run build
npm run start
```

## 4) Vercel 배포

1. Git 리포지토리를 Vercel에 연결
2. Framework Preset: `Next.js` 확인
3. Build Command: `next build` (기본값)
4. Deploy 실행

추가 설정 없이 기본 구성으로 배포 가능합니다.

도메인 `carbonhero.kr` 기준 운영 배포 절차는 `docs/deployment-carbonhero.md`를 참고하세요.

## 주요 편집 포인트

- 카피/문구 수정: `constants/content.ts`
- 프로토타입 플로우 정의: `constants/prototypeFlows.ts`
- 섹션 조합 순서 변경: `app/page.tsx`
- 섹션별 레이아웃/스타일 수정: `components/*Section.tsx`

## 프로토타입 플로우 접근 경로

- 허브(메인): `/`
- 플로우 A: `/flow-a`
- 플로우 B: `/flow-b`
- 플로우 C: `/flow-c`
