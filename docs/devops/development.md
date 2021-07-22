### TOC [HOME](/) | [UP](..)

- [세부 실행 목표](/docs/concept.md)
- [개발 및 운영 환경](/docs/devops)
- [개념 검증](/docs/poc)
- [구축 로드맵](/docs/roadmap)

---

# 개발 환경

열에너지 다소비 산업설비 스마트 설계 플랫폼 개발(development) 환경에 관련된 내용을 다룹니다.

- 개발환경 구성을 위해서 상업용 라이선스 구매가 필요한 툴은 사용하지 않는 것을 원칙으로 합니다.

## 개발 프레임워크

플랫폼 서비스를 위한 어플리케이션 개발은 [Things-Factory Framework](http://www.hatiolab.com/things-factory-doc/ko/intro/framework/) 을 기반으로 진행합니다.(당 과제에 한해서 무상 제공할 예정입니다.)

- [Things-Factory Framework 개발가이드](http://www.hatiolab.com/things-factory-doc/ko/intro/framework/) 사이트에 Things-Factory 프레임워크와 관련해서 다음과 같은 내용의 자료가 정리되고 있으니, 참고하시기 바랍니다.
  - 프레임워크 소개
  - 개발환경 셋업
  - 애플리케이션 개발
  - 따라하기
  - 애플리케이션 운영

## 개발 언어

- javascript(typescript) in nodejs
  - 웹어플리케이션의 서버사이드에서 사용될 어플리케이션 구동 환경은 nodejs 입니다.
  - nodejs 환경은 javascript를 백엔드 개발에 사용할 수 있도록 만들어진 환경입니다.
  - typescript는 javascript의 superset 언어로 javascript의 단점을 보완한 meta language 입니다.
- javascript(ECMA5), HTML5, CSS3
  - 웹어플리케이션의 클라이언트(브라우저) 사이드는 선택의 여지가 없이 HTML5, CSS3, javascript을 사용해서 웹표준 방식으로 구현됩니다.
- python
  - 많은 현업 담당자들이 접근하기 쉬운 스크립트 언어로서 데이타 분석 및 AI(Machine Learning) 등을 위해서 광범위하게 사용되는 언어입니다.
  - 플랫폼 개발의 효율과 확장성을 위해서는 python 언어로 개발된 프로그램도 통합할 수 있도록 지원합니다.

## 개발 도구

### 소스 편집 도구

- [visual studio code](https://code.visualstudio.com/)

### 소스 형상관리

- [github](https://github.com/)
- 형상관리 클라이언트 도구 : [github desktop](https://desktop.github.com/)

### 배포 도구

- 모듈 배포
  - (node module package)[https://www.npmjs.com/]
- 도커 이미지 배포
  - [docker hub](https://hub.docker.com/)
  - 클라이언트 도구 : docker desktop

## 데이타베이스

- postgresql
- PGAdmin (postgresql 관리도구)
