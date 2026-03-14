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

이 과제는 Claude (claude.ai)의 도움을 받아 작성되었습니다.

### 사용한 주요 프롬프트
- 환경 세팅 (Node.js, MySQL 설치 및 설정)
- 프로젝트 구조 설계
- 각 API 코드 작성 (회원가입, 로그인, 일기 CRUD, 공유 기능)
- JWT 인증 미들웨어 구현
- Railway 배포 설정
- README 작성

### AI 사용 방식
단순 코드 복붙이 아닌, 각 코드의 동작 원리와 개념 
(JWT 인증 방식, bcrypt 해싱, SQL Injection 방어, 
미들웨어 패턴, REST API 설계 원칙 등)을 이해하면서 진행하였습니다.