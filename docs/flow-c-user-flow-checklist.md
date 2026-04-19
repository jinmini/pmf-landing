# Flow C User Flow Checklist

Flow C 실제 사용자 흐름을 릴리즈 기준으로 점검하기 위한 체크리스트입니다.

## 1) 환경/인프라 준비

- [ ] `.env.local`에 아래 값이 모두 설정되어 있다.
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`
  - [ ] `ESTIMATE_REQUEST_NOTIFICATION_TO`
- [ ] Supabase SQL Editor에서 `docs/supabase/estimate_requests.sql`을 실행했다.
- [ ] 알림 메일 수신 주소(`ESTIMATE_REQUEST_NOTIFICATION_TO`)를 팀 메일로 지정했다.

## 2) 핵심 플로우 수동 테스트 (정상 케이스)

- [ ] 시작 페이지 진입 후 Step 1~4를 완료하면 결과 페이지로 이동한다.
- [ ] `상세진단 보기` 진입 후 체크리스트 토글/세부 단계 펼침이 정상 동작한다.
- [ ] 이메일 입력 후 `상세 견적 요청 등록` 클릭 시 요청이 성공한다.
- [ ] 성공 상태 메시지가 사용자에게 표시된다.
- [ ] Supabase `estimate_requests` 테이블에 요청 데이터가 생성된다.
- [ ] 내부 알림 메일이 수신된다.

## 3) 예외/오류 플로우 테스트

- [ ] 이메일 형식 오류 시 제출이 차단되고 안내 문구가 표시된다.
- [ ] 필수 선택값 누락 시 다음 단계/제출이 차단된다.
- [ ] 메일 환경변수 제거 시 저장은 성공하고 mailStatus가 `skipped`로 내려온다.
- [ ] DB 연결 실패 시 사용자 에러 메시지가 노출된다.

## 4) 데이터 품질 점검

- [ ] `service_ids`, `goal_ids`가 중복 없이 저장된다.
- [ ] `estimate_min/max`, `service_breakdown`, `detail_service_progress` 값이 정합하다.
- [ ] `submitted_at_client`, `request_ip`, `user_agent` 필드가 정상 저장된다.
- [ ] LCA SW 미선택 시 온보딩 항목이 저장 데이터에 포함되지 않는다.

## 5) UX 최종 점검 (모바일 포함)

- [ ] Step 전환 시 `fade + vertical slide` 전환이 자연스럽다.
- [ ] Progress/뒤로가기 정렬이 의도대로 보인다.
- [ ] 버튼 disabled 상태 피드백이 명확하다.
- [ ] 결과 금액 count-up 속도/blur 전환이 과하지 않다.
- [ ] 긴 금액/긴 문구에서 줄바꿈 깨짐이 없다.

## 6) 릴리즈 전 권장 점검

- [ ] 운영 환경의 보안 헤더/CORS 설정을 검토했다.
- [ ] API 남용 방지(최소 rate limit 또는 bot 대응)를 검토했다.
- [ ] 관리자 조회/내보내기(CSV) 필요 여부를 결정했다.
- [ ] 개인정보 보관 기간 및 삭제 정책을 정리했다.

---

## 실행 로그

점검 시 아래 형식으로 간단히 기록합니다.

```
[YYYY-MM-DD HH:mm] 항목: 2-3, 결과: PASS, 메모: 실제 수신 메일 확인
```

