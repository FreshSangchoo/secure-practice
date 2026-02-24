## git bash 에서 aws cli 경로 설정 하는 방법 

```bash
$ echo "alias aws='\"/c/Program Files/Amazon/AWSCLIV2/aws.exe\"'" >> ~/.bashrc
$ source ~/.bashrc
$ aws --version
```

---

## 온라인 서비스 아키텍처

https://vision-ai.tistory.com/entry/On-Premise-%EC%99%80-Cloud-Services

---


# ShopEasy 로컬 실행 가이드

---

## Windows에서 실행 (Git Bash)

### 사전 준비

1. **Node.js 18 이상** 설치
   - https://nodejs.org 에서 LTS 버전 다운로드 → 설치 (기본 옵션 그대로 Next)
   - 설치 중 "Add to PATH" 체크되어 있는지 확인

2. **Git for Windows** 설치 (Git Bash 포함)
   - https://gitforwindows.org 에서 다운로드 → 설치 (기본 옵션 그대로 Next)

3. 설치 확인 — Git Bash 열고:
   ```bash
   node -v   # v18.x.x 이상
   npm -v    # 9.x.x 이상
   git --version
   ```

> Git Bash가 node를 못 찾으면: Git Bash를 닫았다가 다시 열기 (PATH 반영 필요)

### 실행 순서

```bash
# 1. 원하는 폴더로 이동 (예: 바탕화면)
cd ~/Desktop

# 2. 소스 클론
git clone https://github.com/<your-repo>/ecommerce-app.git
cd ecommerce-app

# 3. API 서버
cd api-server
npm install
node seed.js
npm start
```

서버가 뜨면 이런 로그가 나옴:
```
========================================
  이커머스 API 서버 시작
  포트: 5000
  DB: sqlite
  스토리지: local
  리뷰 저장소: local
  캐시: memory
  큐: sync
========================================
```

확인: 브라우저에서 http://localhost:5000/api/health

```bash
# 4. Git Bash 창 하나 더 열고 — 프론트엔드
cd ~/Desktop/ecommerce-app/frontend
npm install
npm run dev
```

브라우저에서: http://localhost:3000

> API 서버(터미널 1)와 프론트엔드(터미널 2) 둘 다 켜져 있어야 정상 동작

### 서버 종료

각 Git Bash 창에서 `Ctrl + C`

### 다시 시작할 때 (이미 설치 완료 상태)

```bash
# 터미널 1: API 서버
cd ~/Desktop/ecommerce-app/api-server
npm start

# 터미널 2: 프론트엔드
cd ~/Desktop/ecommerce-app/frontend
npm run dev
```

`npm install`과 `node seed.js`는 처음 한 번만 하면 됨.

### Windows 트러블슈팅

| 문제 | 해결 |
|------|------|
| `node: command not found` | Git Bash 닫고 다시 열기. 안 되면 Node.js 재설치 |
| `npm install` 중 permission 에러 | Git Bash를 **관리자 권한으로 실행** |
| 포트 5000이 이미 사용 중 | `.env` 파일에서 `PORT=5001`로 변경 |
| `ENOENT: no such file or directory` | 경로에 한글 폴더명이 있으면 영문 경로로 이동 |
| 브라우저에서 화면 안 뜸 | API 서버(5000)와 프론트(3000) 둘 다 실행 중인지 확인 |
| `Ctrl+C`로 서버 안 꺼짐 | `Ctrl+C` 두 번 누르기 |

---

## macOS / Linux에서 실행

### 사전 준비

- **Node.js 18 이상** (https://nodejs.org - LTS 버전)
- **Git**

```bash
node -v   # v18.x.x 이상
npm -v    # 9.x.x 이상
```

### 실행 순서

```bash
# 1. 소스 클론
git clone https://github.com/<your-repo>/ecommerce-app.git
cd ecommerce-app

# 2. API 서버
cd api-server
npm install
node seed.js
npm start

# 3. 터미널 하나 더 열고 — 프론트엔드
cd ecommerce-app/frontend
npm install
npm run dev
```

브라우저에서: http://localhost:3000

---


## 공통 정보

### 테스트 계정

| 항목 | 값 |
|------|-----|
| 이메일 | test@test.com |
| 비밀번호 | password123 |
| 이름 | 테스트유저 |

### .env 기본값 (로컬 모드)

`.env` 파일이 아래 상태면 AWS 없이 전부 로컬로 동작. 수정 불필요.

```env
PORT=5000
DB_TYPE=sqlite
STORAGE_TYPE=local
REVIEW_STORE=local
CACHE_TYPE=memory
QUEUE_TYPE=sync
JWT_SECRET=ecommerce-jwt-secret-key-2024
```
