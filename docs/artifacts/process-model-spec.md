### [TOC] [HOME](/docs)

- [세부 실행 목표](/docs/concept.md)
- [개발 및 운영 환경](/docs/devops)
- [개념 검증](/docs/poc)
- [구축 로드맵](/docs/roadmap)
- [산출물](/docs/artifacts)
  - [공정 모델 명세](/docs/artifacts/process-model-spec.md)
  - [기기 모델 명세](/docs/artifacts/device-model-spec.md)
  - [모듈 인티그레이션 명세](/docs/artifacts/module-integration-spec.md)

---

# 공정 설계 모델 명세

이 문서는 공정 설계 모델의 명세를 정리합니다.

## 공정 설계 UI 시안

![UItemp](https://user-images.githubusercontent.com/1257178/127439296-87162915-9dd8-4417-84c9-c8db90a25e9c.png)

- [공정 설계 UI Demo link](https://xd.adobe.com/view/b48de54e-3898-46f9-967f-28eeafef01b7-e1de/)

## 공정 설계 모델 명세 협의 사항

공정설계 모델에는 크게 기기모듈과 플로우(기기모듈간 연결선)으로 구성되므로, 명세로 정의하기 위해 협의가 필요한 사항을 정리합니다.

### 기기 모듈

#### 표현

[] 기기모듈의 크기가 가변 여부 (Resize 기능 필요 여부)
[] 입출력의 갯수는 고정인가 ? 가변인가 ?
[] 입출력의 연결 포트를 정의할 필요가 있는가 ? 각 모듈별로 입출력의 타입과 갯수가 고정이라면, 플로우가 연결될 수 있는 Anchor(연결 포트)를 모듈 주변에 표현하고, Anchor와 Anchor간에 플로우가 연겷되는 것으로 모델을 잡아야 합니다.

### 플로우

#### 타입

[] 플로우는 용도나 머티리얼에 따라 다른 속성을 가질 수 있는가 ?
[] 플로우의 속성 차이로 몇가지 타입의 플로우로 구분할 수 있는가 ?
[] 플로우의 방향성 : 항상 Uni-Directional 인가 ? 가변적일 수 있는가 ?

#### 표현

[] 플로우 타입에 따라 표현이 달라지는 게 좋은가 ? 색상, 또는 선의 굵기와 패턴 등
[] 플로우는 waypoint(분절)를 가질 수 있는 직선 형태인데, Waypoint를 사용자가 직접 지정할 것인가? 아니면, 최대한 단순하게 자동으로 만들어지도록 할 것인가 ?
[] Waypoint를 사용자가 직접 지정하도록 한다면, Waypoint는 몇개까지 가능하도록 할 것인가 ?

#### 속성

[] 플로우가 가져야 하는 속성은 어떤 것이 있는가 ?
...
