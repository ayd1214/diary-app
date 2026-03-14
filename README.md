# 일기 작성 플랫폼 백엔드

KWEB 2026-1 BE 정회원 면제 과제입니다.
Node.js, Express, MySQL 기반의 일기 작성 플랫폼 REST API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcrypt

## 배포 URL

https://diary-app-production-2b81.up.railway.app

## 테스트 계정

- email: test@test.com
- password: 12345678
- nickname: 테스터

## API 목록

### 회원가입
- **POST** `/auth/signup`
- Request Body:
```json
{
  "email": "test@test.com",
  "password": "12345678",
  "nickname": "테스터"
}
```
- Response: `200 OK` / `400 Bad Request`

### 로그인
- **POST** `/auth/login`
- Request Body:
```json
{
  "email": "test@test.com",
  "password": "12345678"
}
```
- Response: `200 OK` (token 반환) / `401 Unauthorized`

### 일기 작성
- **POST** `/diaries`
- Headers: `Authorization: Bearer {token}`
- Request Body:
```json
{
  "title": "일기 제목",
  "content": "일기 내용",
  "is_shared": false
}
```
- Response: `201 Created` / `400 Bad Request`

### 내 일기 목록 조회
- **GET** `/diaries`
- Headers: `Authorization: Bearer {token}`
- Response: `200 OK`

### 내 특정 일기 조회
- **GET** `/diaries/:id`
- Headers: `Authorization: Bearer {token}`
- Response: `200 OK` / `403 Forbidden`

### 공유 일기 목록 조회
- **GET** `/shared`
- Headers: `Authorization: Bearer {token}`
- Response: `200 OK`

### 공유 특정 일기 조회
- **GET** `/shared/:id`
- Headers: `Authorization: Bearer {token}`
- Response: `200 OK` / `403 Forbidden`


## 로컬 환경 구성 방법

### 필수 설치
- Node.js
- MySQL

### 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/ayd1214/diary-app.git
cd diary-app
```

2. 의존성 설치
```bash
npm install
```

3. MySQL에서 DB 및 테이블 생성
```sql
CREATE DATABASE diary_app;
USE diary_app;

CREATE TABLE USER (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL
);

CREATE TABLE DIARY (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USER(id)
);
```

4. 테스트 데이터 삽입
```bash
mysql -u root -p < data.sql
```

5. 환경변수 설정 - 루트 폴더에 `.env` 파일 생성
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=본인의_MySQL_비밀번호
DB_NAME=diary_app
DB_PORT=3306
JWT_SECRET=mysecretkey123
```

6. 서버 실행
```bash
npm start
```

7. 접속 확인
```
http://localhost:3000
```

## AI 사용 내역

이번 과제 수행 과정에서 초기 환경 세팅과 반복적인 뼈대 코드 작성 시간을 단축하고, cloud 배포 환경에서의 troubleshooting을 보조받기 위해 Claude를 활용했습니다.

### 사용한 주요 프롬프트
- Node.js, Express, MySQL 환경에서의 REST API boilerplate 및 JWT 기반 인증 흐름 생성
- 과제 요구사항에 맞춘 일기 작성 및 조회(CR) API logic 설계
- Railway cloud 배포 시 발생하는 port binding(0.0.0.0) 오류 해결 방법 검색

### AI 사용 및 코드 반영 방식
- 초기 구조는 AI의 도움을 받아 빠르게 구성했으나, 제안받은 코드를 그대로 맹신하지 않고 각 API의 동작 원리와 보안 요소(비밀번호 해싱, JWT 인증, SQL injection 방어 등)를 직접 검증하며 프로젝트에 적용했습니다.
- 과제 명세를 다시 확인하여 불필요한 일기 수정(U)과 삭제(D) 기능을 제외하고, 요구된 생성(C)과 다양한 조회(R) logic 및 권한 처리만 정확히 동작하도록 코드를 수정했습니다.
- 기본 API 구현 이후, cloud 환경 배포 중 발생한 서버 host binding 이슈를 문서를 참고하여 직접 debugging하고 해결했습니다.
- 추가로 회원가입 시 이메일 유효성 검사 logic을 덧붙여 애플리케이션의 안정성을 높였습니다.