USE diary_app;

INSERT INTO USER (email, password, nickname) 
VALUES ('test@test.com', '$2b$10$pGslvyTrAoXFX40RbuDOBOOY9ZC0tuFmkamYZfo/wS3Nv2Oz2PmyO', '테스터');

INSERT INTO DIARY (user_id, title, content, is_shared) 
VALUES (1, '오늘의 일기', '오늘은 백엔드를 배웠다.', false);

INSERT INTO DIARY (user_id, title, content, is_shared) 
VALUES (1, '공유 일기', '이 일기는 공유됩니다.', true);