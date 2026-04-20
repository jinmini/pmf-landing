# CarbonHero 운영 배포 설정 (carbonhero.kr)

이 문서는 `carbonhero.kr` 기준의 최종 운영 배포 설정 체크리스트입니다.

## 1) Vercel 프로젝트/도메인 연결

1. Vercel 프로젝트에 현재 Git 리포지토리를 연결합니다.
2. `Settings > Domains`에서 아래를 연결합니다.
- `carbonhero.kr` (apex)
- `www.carbonhero.kr` (선택)
3. DNS 제공업체에서 Vercel 안내 레코드를 반영합니다.
- Apex: `A 76.76.21.21` (Vercel 안내값 우선)
- www: `CNAME cname.vercel-dns.com`
4. Vercel에서 두 도메인 모두 `Valid Configuration`인지 확인합니다.

## 2) 운영 환경변수 (Vercel)

`Settings > Environment Variables`에 아래 값을 Production에 등록합니다.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ESTIMATE_REQUEST_NOTIFICATION_TO`
- `NEXT_PUBLIC_SITE_URL=https://carbonhero.kr`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4 사용 시)

`SUPABASE_SERVICE_ROLE_KEY`는 민감 정보이므로 절대 클라이언트 코드에 노출되지 않도록 합니다.

## 3) Supabase 준비

Supabase SQL Editor에서 아래 SQL을 실행합니다.

- `docs/supabase/estimate_requests.sql`
- `docs/supabase/estimate_request_drafts.sql`

검증 포인트:
- `estimate_requests` insert 가능
- `estimate_request_drafts` upsert/patch 가능
- 운영에서 요청 생성 후 `submitted_request_id` 업데이트 가능

## 4) Resend 도메인 인증 (carbonhero.kr)

1. Resend에서 발신 도메인을 `carbonhero.kr`로 추가합니다.
2. DNS에 Resend가 안내하는 레코드를 추가합니다.
- SPF/TXT
- DKIM/CNAME(복수)
- Return-Path 관련 레코드(제공 시)
3. Resend 검증이 모두 `verified`가 된 후 운영 발신 주소를 설정합니다.
- 예: `RESEND_FROM_EMAIL=CarbonHero <notify@carbonhero.kr>`

## 5) 분석/검색 인덱싱 점검

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` 적용 후 실시간 이벤트 유입 확인
- 배포 후 아래 경로 정상 응답 확인
  - `/robots.txt`
  - `/sitemap.xml`
- Google Search Console에 `https://carbonhero.kr` 속성 등록 및 sitemap 제출

## 6) 출시 직전 최소 시나리오

1. `/flow-c` 진입
2. Step 1~4 완료
3. 결과 페이지 표시 확인
4. 상세 옵션 체크 후 이메일 제출
5. `estimate_requests` 데이터 생성 확인
6. 알림 메일 수신 확인

## 7) 권장 보안/운영 보강

- `/api/estimate-draft`, `/api/estimate-request`에 rate limit 적용
- bot 방지(예: Turnstile/hCaptcha) 검토
- 개인정보 보관 기간 및 삭제 주기 운영 정책 문서화
