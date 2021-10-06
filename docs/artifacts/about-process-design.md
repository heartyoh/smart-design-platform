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

# Level 1 공정 설계

## Level 1 Design Overview

PFD (process flow diagram): 실제 설비(facility)를 기기(device, equipment) 단위로 분리하여 열과 물질의 흐름 등을 살펴볼 수 있도록 한 일종의 흐름도(flowsheet)

(From Wikipedia) A process flow diagram (PFD) is a diagram commonly used in chemical and process engineering to indicate the general flow of plant processes and equipment. The PFD displays the relationship between major equipment of a plant facility and does not show minor details such as piping details and designations. Another commonly used term for a PFD is flowsheet.

[그림 화학공정의 PFD 예시]

![PFD Sample](/docs/images/pfd-sample.png)

Level 1 design에서는 사용자가 설계한 PFD와 입력 조건을 사용하여 열 및 물질 정산(heat & mass balance)과 Utility 기기(pump, blower 등)를 위한 압력 계산을 수행
화학공정 등에 특화된 Aspen 류의 상용 프로그램과 달리, 우리의 스마트 설계 플랫폼은 열에너지 다소비 산업설비를 대상으로 하며 그에 부합하는 특징 및 차별성을 보유

## 구성요소 - Modules

- 실제 기기 내에서 일어나는 물리화학적 현상을 수학적으로 또는 DB로 모델링한 객체로서, 입력값들로부터 주어진 계산을 수행하고 출력하는 기본 단위
- 각 기기별로 다양한 형식들이 존재할 수 있음
  - (예) 열교환기라는 기기 내에는 판형, 쉘 & 튜브형, 핀튜브형 등의 형식이 존재
- 하나의 형식에 대해 하나의 모듈이 대응되거나, 형식에 관계없이 하나의 기기 종류에 대해 하나의 모듈이 대응될 수도 있음.
- GUI 내에서 각 모듈은 다른 것과 구분되는 기호로 표기되어야 하며, 각 모듈은 입력 및 출력 노드들을 갖는데 그 개수는 기기와 그 형식이 가지는 특성에 따라 다름
  - 모듈 표현의 예시 ![Module notation sample](/docs/images/module-notations-sample.png)
  - [ ] (검토) 위의 예와 같이 사각형의 블록 기호로 표기하는 것이 적절한지에 대해서는 논의 필요 (예를 들어 입력 노드의 개수가 많거나, 각 기기의 위치에 따라 입력을 연결해야 하는 경우에는 사각 블록이 부적절할 수 있음)
        일부 전력을 사용하는 모듈들(ex. Feed Roller, Blower, Drum 등)은 차별화된 표기
  - [ ] (검토: 전력사용 모듈) 운전조건에 따른 전력 사용량 데이터 도출 가능?
  - 각 모듈의 노드들을 명확히 표현할 수 있도록 작은 원형 점 기호를 모듈 블록에 붙여주는 것도 고려해 볼 수 있고, 이 때 마우스를 그 점 위에 가져가면 해당 노드의 설명이 자동으로 표기되도록 하는 것이 바람직
- 각 모듈은 기기 및 형식별로 적절히 구분 정렬하여 Palette 형태의 GUI로 제공하고, 사용자는 Drag & drop 형태로 사용
- 사용자가 작업창에 모듈을 삽입하면 자동으로 Naming (자동 Naming 방법 차후 논의, 사용자가 원하면 수정 가능)
- 각각의 모듈은 그 특성에 맞는 입력창을 가지며 사용자가 선택적으로 입력 (입력창은 UI 화면의 적정 위치에 dock 형태로 제공하거나 새로운 창으로 popup)
- 각각의 모듈이 수행해야 하는 계산 알고리즘은 담당 기술팀에서 제공
- 각 모듈 내에는 계산을 수행하는데 있어서 필요한 물성치 DB 등을 호출하여 사용하는 기능 포함
  - (예) 입력값으로 주어진 물질의 조성 및 온도와 압력으로부터 물성치 DB를 활용하여 물질의 엔탈피를 계산
  - [ ] (검토: 모든 모듈) 각 모듈에서 Level 1의 heat & mass balance 계산을 위해 필요로 하는 물성치는?
- 유체 이송을 위해 필요한 동력을 제공하는 Blower나 Fan 설계는 Level 1의 공정설계가 완료된 후 각 모듈의 운전조건 하에서 발생하는 차압을 모두 알아야 가능
  - [ ] (검토) 각 모듈별로 차압 데이터 도출 가능?
  - [ ] (검토) Level 1 설계 이후에 압력 계산을 위한 Level 1’ 해석 필요?Level 1 해석 → Level 1’ 해석 → Level 2 해석

## 구성요소 - Wires

- 두 모듈 사이의 출력과 입력을 연결하여 물질, 열 등의 흐름을 나타내는 객체
- 흐름의 방향을 한 눈에 알아 볼 수 있도록 화살표로 표기하되, 객체의 종류에 따라 다른 색 또는 형태(실선, 겹선, 점선 등)의 화살표를 사용
  - (예시) 물질: -->, 열: -->
  - 두 모듈의 출력 노드와 입력 노드를 Wire로 연결할 때, 사용자가 Wire를 작도하는 순서에 관계없이 항상 화살표 방향은 “출력 노드 → 입력 노드”
  - Wire는 가로 세로 방향의 선분들을 연결하여 꺾인 화살표로 표현하며, 입력 및 출력 노드에 바로 연결된 선분을 제외하고 사용자가 조절 가능 해야 함.
- 사용자가 Wire를 삽입하면 자동으로 Naming (자동 Naming 방법 차후 논의, 사용자가 원하면 수정 가능)

- Wire 객체의 속성(변수)

  - 온도
  - 압력
  - 성분 물질
  - 질량 유량
  - 몰분율(mole fraction) 또는 질량분율(mass fraction)

- Wire 객체의 성분 물질
  (여기에 테이블)

  - [ ] (검토) 집진기를 위한 고체상 처리: 연소기나 건조기 등에서 생성 배출되는 PM의 특성을 예측할 수 있어야 하는데 가능할까?
  - [ ] (검토) 혼합물의 응축 조건 계산: 응축기를 제외한 다른 기기 모듈에서 상변화 현상을 고려할 필요가 있을까?

- Wire 객체의 상태량은 선행 모듈에 의해 결정 (별도의 사용자 입력창은 불필요)
  - 따라서 Level 1의 계산을 수행하기 전에는 Wire의 상태량이 결정되지 않음.
  - 계산 수행 후 Wire의 double click 등을 통해 상태량 표시 기능 필요

## 구성요소 - 물성치 DB (Property database)

- 기본 물질(공기, NG, 물 등)의 표준 물성 DB는 시스템 팀에서 제공
  - [ ] (검토) 어떠한 공개 DB를 사용할 것인지?
- 특수 물질(강재, 피건조물, 히트펌프 냉매 등)의 물성 DB는 담당 기술팀에서 제공 (기본 물질의 표준 물성 DB 양식에 부합하도록 제공)
- DB 표준화 방안 논의 필요

## Level 1 GUI

사각형의 block으로 표현된 모듈들과 각 모듈을 연결하는 wire들로 이루어진 일종의 PFD (process flow diagram)

[그림 Level 1 GUI example: 공업로 PFD]

![GUI Sample](/docs/images/pfd-gui-sample.png)

### GUI가 구현할 기능들

1. Module palette (종류별로 정렬된 팔렛트)
1. Drag & drop을 통해 팔렛트로부터 모듈 삽입 및 배치
1. 각 모듈의 설정창
1. 자동 및 수동 모듈 정렬 (가로 정렬, 세로 정렬, 균등 정렬 등)
1. 각 모듈의 입출력 단에서 마우스의 활성화(모양 변경), Click & dragging을 통한 wiring
1. 자동 및 수동 wire 정렬
1. (지속적으로 추가 및 정리 예정)

## Level 1 Algorithm

- 아래 좌측과 같이 Once-through process의 경우 순차적으로 module-by-module 계산을 한번만 수행하면 Heat & mass balance 계산이 완료
  - 계산 완료 후 각 모듈에 대해 결정된 조건에 따라 차압(pressure difference)을 계산하고 이로부터 Blower나 Pump 등에서 발생시켜야 할 구동압 계산
- 아래 우측과 같이 Feedback wire가 있는 경우 Feedback 지점에 대한 가상의 Break point가 필요
  - Break point에 적절한 초기 추정값을 설정하고 Heat & mass balance를 계산한 후 그 Break point에 대해 계산된 값이 초기값과 같아지도록 추정값을 지속적으로 update하면서 iteration
  - [ ] (검토) Break point를 Platform solver에서 자동으로 잡아 주려면 feedback wire들을 구별해 내고 선별적으로 breaking할 수 있는 스마트 알고리즘이 필요. 구현 가능?
  - [ ] (검토) Break point에 대한 초기 추정값을 어떻게 줄 것인지. 사용자의 입력을 요구한다면 비전문가를 대상으로 하는 스마트 플랫폼의 취지에서 벗어남. 자동으로 줄 수 있는 방법? 계산이 수렴하지 않고 발산할 경우에 대한 대처방법?
  - 차압(pressure difference) 계산은 수렴이 완료된 후 수행
