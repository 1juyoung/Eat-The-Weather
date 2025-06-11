# 🌤️ Eat the Weather

![Image](https://github.com/user-attachments/assets/6eb3d246-57e4-42d8-a9a9-1b5bedcb1bda)


---


## 🌈 주요 기능 설명

### 🔐 회원가입 & 로그인
![image](https://github.com/user-attachments/assets/bffd409a-210c-4581-860f-7bea2bfc4a71)



### 🌡️ 날씨 민감도 기반 개인화 (온보딩)
![image](https://github.com/user-attachments/assets/966c8fd7-eb94-4e31-94c5-887c8ff33e42)



### 🧭 위치 기반 날씨 정보
- **[초기]** 브라우저 위치 → Kakao API로 행정구역 확인 → OpenWeather API로 날씨 조회
- **[이후]** 즐겨찾기에 저장된 지역 선택 → OpenWeather API로 날씨 조회
![image](https://github.com/user-attachments/assets/630f087a-1ae8-44e7-9589-d4a396a06978)



### 💬 지역 게시판 기능
- 대표 지역 기반으로 날씨 관련 이야기 공유
- 게시글 작성 시 **날씨/의류 태그** 필수 선택
- 댓글 작성 가능, **내 댓글만 삭제 가능**
- 좋아요 기능 제공
  
<br/>

---

## 🛠️ 기술 스택

![image](https://github.com/user-attachments/assets/c9eda392-524f-4418-a9c6-700e17e31c39)



---


## 🗂 데이터베이스 구조
![image](https://github.com/user-attachments/assets/1308739f-5f26-40c2-ba55-a657e3b67e46)



---

## 📄 참고사항

- Supabase는 인증 기능은 사용하지 않고, **DB 전용**으로만 활용
- 클라이언트 API는 Axios 기반 커스텀 인스턴스 사용
- 외부 API는 'fetch' 사용 (예: Kakao 주소 API, 날씨 API)
- 백엔드 구조는 "클린 아키텍처" 기반 작성
![image](https://github.com/user-attachments/assets/cdd819fe-a11d-477d-89ad-066f69bec5ec)


  <br/>

  
