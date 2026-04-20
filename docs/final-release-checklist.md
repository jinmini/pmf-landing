# CarbonHero 최종 배포 점검 체크리스트

이 문서는 `carbonhero.kr` 운영 배포 직전/직후에 반드시 확인할 항목만 모아둔 실행 체크리스트입니다.

## 1) 배포 전 필수 확인

- [ ] Vercel Production 환경변수 확인
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL` (예: `CarbonHero <no-reply@carbonhero.kr>`)
  - [ ] `ESTIMATE_REQUEST_NOTIFICATION_TO`
  - [ ] `NEXT_PUBLIC_SITE_URL=https://carbonhero.kr`
  - [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (사용 시)
- [ ] Resend 도메인 `carbonhero.kr` 상태 `Verified`
- [ ] Vercel 도메인 상태
  - [ ] `carbonhero.kr` Valid
  - [ ] `www.carbonhero.kr` Valid
- [ ] Supabase 테이블 생성 완료
  - [ ] `docs/supabase/estimate_requests.sql`
  - [ ] `docs/supabase/estimate_request_drafts.sql`

## 2) 기능 스모크 테스트 (운영 도메인)

- [ ] `https://carbonhero.kr` 첫 화면 진입
- [ ] Step 1~4 진행 후 결과 화면 진입
- [ ] 상세 옵션에서 체크박스 동작 확인
- [ ] 이메일 제출 시 네트워크 응답 확인
  - [ ] `POST /api/estimate-draft` → `200`
  - [ ] `POST /api/estimate-request` → `201`
- [ ] 성공 메시지 노출 확인

## 3) 데이터/메일 검증

- [ ] Supabase `estimate_request_drafts`에 draft 생성/갱신 확인
- [ ] Supabase `estimate_requests`에 최종 요청 생성 확인
- [ ] 제출 시 draft가 `submitted`로 변경되는지 확인
- [ ] 내부 알림 메일 수신 확인
- [ ] Resend 이벤트(Delivered/Bounced/Rejected) 확인

## 4) iOS Safari 전용 점검

- [ ] iPhone Safari에서 `https://carbonhero.kr` 정상 로드
- [ ] iPhone Safari에서 `https://www.carbonhero.kr` 정상 로드
- [ ] 첫 화면 잠깐 노출 후 흰 오류 화면 재발 없음
- [ ] Step 2/3/4 타이틀 줄바꿈이 단어 단위로 자연스러움

문제 재발 시:
- Safari 캐시/웹사이트 데이터 삭제 후 재시도
- Private Relay, 콘텐츠 차단기 비활성화 후 재시도
- Vercel Function 로그에서 5xx 로그 확인

## 5) 배포 직후 모니터링 (최소 30분)

- [ ] Vercel Function Logs에 `500` 급증 없음
- [ ] `/api/estimate-draft`, `/api/estimate-request` 오류율 확인
- [ ] 메일 전송 실패율(Resend) 확인
- [ ] 주요 퍼널 이벤트(GA) 유입 확인

## 6) 장애 대응 메모

- DB 저장 실패가 동시에 발생하면 먼저 Supabase 환경변수/권한 점검
- 메일만 실패하면 Resend 도메인 상태/`RESEND_FROM_EMAIL` 도메인 일치 여부 점검
- Safari만 실패하면 저장소 접근/초기 렌더 효과 관련 최근 변경분 우선 점검
