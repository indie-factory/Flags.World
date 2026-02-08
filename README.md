# 🌍 세계 국기 검색

전 세계 모든 국가의 국기를 검색하고 정보를 확인할 수 있는 웹 애플리케이션입니다.

## 기능

- ✅ 전 세계 모든 국가의 국기 표시
- 🔍 국가명 또는 수도명으로 실시간 검색
- 📱 모바일 반응형 디자인
- 🚀 순수 Vanilla JavaScript (프레임워크 없음)

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- REST Countries API

## 로컬에서 실행하기

1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/flag-finder.git
cd flag-finder
```

2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# 또는 Node.js
npx serve
```

3. 브라우저에서 `http://localhost:8000` 접속

## GitHub Pages 배포 방법

1. GitHub에서 새 저장소 생성
2. 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flag-finder.git
git push -u origin main
```

3. 저장소 Settings > Pages > Source를 "main" 브랜치로 설정
4. 몇 분 후 `https://YOUR_USERNAME.github.io/flag-finder/` 에서 확인 가능

## 데이터 출처

[REST Countries API](https://restcountries.com/)

## 라이선스

MIT
