# API Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# 사용자 그룹 및 사용자 생성
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --production
COPY . .

# 앱 파일의 소유권을 appuser로 변경
RUN chown -R appuser:appgroup /app

# 이후 명령어는 appuser 권한으로 실행
USER appuser

EXPOSE 5000
CMD ["node", "src/app.js"]