### [TOC] [HOME](/docs)

- [세부 실행 목표](/docs/concept.md)
- [개발 및 운영 환경](/docs/devops)
- [개념 검증](/docs/poc)
  - [공정 설계](./process-design.md)
  - [기기 설계](./device-design.md)
- [구축 로드맵](/docs/roadmap)
- [산출물](/docs/artifacts)

---

# 공정 설계 (Process Design) 개념 검증

Process Design 모델구조, 모델러 UX 및 실행 엔진 개념 검증

- 공정설계 논리 모델 정의 (기기모듈간의 연결 및 흐름제어, 피드백 구조, 시작과 끝)
- 모델러에 대한 사용자 측면의 수월성 검증
- 실행 엔진은 얼마나 많은 프로그램관점의 논리연산 및 흐름 구조를 지원하는가 ? 기기 모듈을 통한 확장성에 제약은 없는가 ?
- 설계 결과 리포트 구성 방법

## 실행(분석) 가능한 공정 설계 모델 정의

### 모델 구성 요소 설계

공정설계 모델은 [블록 다이아그램 모델](https://eleceng.dit.ie/gavin/Control/Block%20Diagrams/General%20Intro.htm)
또는 Directed Cyclic Graph 모델(Vertex/Node와 Edge/Link 로 구성되고, 방향성이 있고 순환이 가능한 모델)로 판단됨

- Nodes
  - 이벤트
    - 시작
    - 종료
    - 필요여부 판단
  - 게이트웨이
    - 조건 분기
    - 피드백
    - 필요여부 판단
  - 기기모듈
    - 입출력 앵커(연결부위)
    - 모듈 속성 데코레이터
- Edges
  - 플로우(흐름 연결)
  - 플로우 Waypoint
  - Annotation

### 참조

- BPMN 2.0 모델 참조
- [BPMN 모델러](https://demo.bpmn.io/bpmn)
  ![BPMN 2.0 모델러](https://bpmtips.com/wp-content/uploads/2020/06/Camunda-Modeler.png)

### 공정 설계 모델러 시안

준비중입니다.
