# AWS 클라우드 보안 강의 - 실습 중심 학습 사이트

이커머스 서비스(ShopEasy)에 보안을 적용하면서 배우는 **AWS 클라우드 보안 과정(32시간)**입니다.  
(현대오토에버 모빌리티 SW 스쿨 IT 보안 과정용)

## 커리큘럼 구성

### 섹션 1: 클라우드 보안 기초 (Ch. 01 - 02)

| 챕터 | 주제 |
|------|------|
| 01 | 클라우드 보안 개요 & 공동 책임 모델 |
| 02 | AWS 보안 서비스 전체 맵 & 위협 분석 |

### 섹션 2: 계정 & 자격증명 보안 (IAM 심화) (Ch. 03 - 06)

| 챕터 | 주제 |
|------|------|
| 03 | IAM 정책 언어 심화 (정책 구조, 평가 로직, Condition, 시뮬레이터) |
| 04 | IAM 역할 & STS (임시 자격증명, 인스턴스 프로파일, AssumeRole) |
| 05 | 권한 경계 & 최소 권한 설계 (Permission Boundary, Access Analyzer) |
| 06 | 이커머스 IAM 설계 실습 (역할 분리, 그룹/MFA 강제 등) |

### 섹션 3: 네트워크 보안 (Ch. 07 - 09)

| 챕터 | 주제 |
|------|------|
| 07 | VPC 보안 심화 (보안그룹 체이닝, NACL, Flow Logs) |
| 08 | AWS WAF (관리형/커스텀 규칙, ALB/CloudFront 연동) |
| 09 | 이커머스 네트워크 보안 적용 (WAF, NACL, Session Manager 전환 등) |

### 섹션 4: 데이터 보호 (Ch. 10 - 13)

| 챕터 | 주제 |
|------|------|
| 10 | KMS & 암호화 기초 (전송/저장 암호화, 봉투 암호화, 키 로테이션) |
| 11 | S3 보안 (퍼블릭 액세스 차단, SSE, 액세스 포인트, Object Lock) |
| 12 | RDS & DynamoDB 보안 (암호화, IAM 인증, 세분화 접근 제어) |
| 13 | Secrets Manager & Parameter Store (.env → 시크릿 관리, 자동 로테이션) |

### 섹션 5: 애플리케이션 & 엣지 보안 (Ch. 14 - 16)

| 챕터 | 주제 |
|------|------|
| 14 | CloudFront 보안 (OAC, Signed URL/Cookie, 지역 제한, HTTPS 강제) |
| 15 | API Gateway 보안 (인증 방식 비교, 스로틀링, 리소스 정책, WAF 연동) |
| 16 | Lambda 보안 (실행 역할 최소 권한, VPC 내 Lambda, 환경변수 암호화) |

### 섹션 6: 탐지 & 모니터링 (Ch. 17 - 19)

| 챕터 | 주제 |
|------|------|
| 17 | CloudTrail (관리/데이터 이벤트, 로그 무결성, CloudTrail Lake) |
| 18 | AWS Config (구성 변경 추적, 관리형 규칙, 적합성 팩) |
| 19 | GuardDuty & Security Hub (위협 탐지, 보안 점수, CIS Benchmark) |

### 섹션 7: 사고 대응 & 거버넌스 (Ch. 20 - 22)

| 챕터 | 주제 |
|------|------|
| 20 | 보안 사고 대응 자동화 (EventBridge + Lambda, SNS 알림, 자동 격리) |
| 21 | AWS Organizations & SCP (멀티 계정 전략, 가드레일) |
| 22 | 보안 아키텍처 설계 패턴 (Well-Architected 보안 필러, Before/After) |

## 관련 브랜치

| 브랜치 | 설명 |
|--------|------|
| `main` | 실습용 이커머스 앱 소스 (React + Node.js) |
| `aws-theory` | AWS 기초 이론 + 실습 사이트
| `aws-security` | AWS 클라우드 보안 강의 사이트 