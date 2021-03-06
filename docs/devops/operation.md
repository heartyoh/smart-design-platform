### [TOC] [HOME](/docs)

- [세부 실행 목표](/docs/concept.md)
- [개발 및 운영 환경](/docs/devops)
  - [개발 환경](./development.md)
  - [운영 환경](./operation.md)
  - [BI 도구](./bi-tool.md)
- [개념 검증](/docs/poc)
- [구축 로드맵](/docs/roadmap)
- [산출물](/docs/artifacts)

---

# 운영 환경

이 문서는 열에너지 다소비 산업설비 스마트 설계 플랫폼의 운영환경에 관련된 내용을 다룹니다.

## 서버 인프라

- 방안 1. 퍼블릭 클라우드
  - [AWS](https://aws.amazon.com/ko/)(Amazon Web Services), Azure(Microsoft), GCP(Google Cloud Platform), Naver Cloud Platform 등
    - AWS가 리더의 포지션이며, 가장 성숙한 서비스를 제공함
  - 장점
    - 수요 변동에 탄력적인 높은 수준의 운영 환경 제공 (운영비용 절감)
    - 비기능적 개발에 필요한 비용 절감 (OAuth2를 통한 편리한 가입 및 인증, 보안, 파일 컨텐츠 관리, 데이타 백업 관리, 배포 기능, OS/DB/Storage 설치 관리 등)
    - 신뢰성, 확장성, 고가용성 탁월
    - Serverless 방식(On-Demand) 활용으로 사용량이 적은 기간의 운영 비용 절감 (대용량의 서버, 스토리지 등 H/W를 미리 확보할 필요가 없음)
  - 단점
    - 동 플랫폼 운영이 정부의 클라우드 정책의 제약이 적용되는 지 검토할 필요
- 방안 2. G-클라우드 환경
  - 장점
    - 정부 시스템의 클라우드 정책에 제약을 받지 않음
    - 대용량의 서버, 스토리지 등 H/W를 미리 확보할 필요가 없음
  - 단점
    - (퍼블릭 클라우드 대비 낮은 수요 때문에) 퍼블릭 클라우드 대비 제한된 PaaS (Platform as a service) 서비스만을 제공하고 있어서 개발 및 운영 비용 절감 효과가 높지 않음
- 방안 3. 센터내 서버 직접 운영
  - 장점
    - 정부시스템의 클라우드 제약을 받지 않음
  - 단점
    - 동 플랫폼 고유의 기능 측면의 개발과 비 기능적 개발 비용 부담
    - 최대 용량 개념의 서버, 스토리지 등 준비가 필요하며, 수요 증가에 따른 확장 비용 또는 수요

### 운영 OS

- 리눅스
- 장점
  - 리눅스 컨테이너 구조 기반
    - [도커](https://www.docker.com/) 등의 컨테이너 기술은 확장성(scailability) 확보
    - [쿠버네티스](https://kubernetes.io/) 등을 사용한 컨테이너 서비스 기술은 고가용성(High Availability) 및 운영 안정성에 탁월한 환경을 제공함
    - 여러 클라우드간에도 높은 이식성(portability) 제공
  - 웹플랫폼 운영체제로서 독보적인 적용 사례
  - Free License
- 유의 사항
  - 사업 참여자 중에서 플랫폼 내의 로직 구현을 위해서 DLL, Shared Library 등 바이너리 모듈을 제공하고자 하는 경우, 리눅스 운영체제에서 실행 가능한 형태로 제공되어야 운영이 가능합니다.

### 데이타베이스

- PostgreSQL
  - 장점
    - Commercial License Free
    - 클라우드 플랫폼에서 Serverless 방식의 서비스를 제공함
      - 사용량만큼만 비용 지불
      - 순간적인 사용량 증가에도 대응
      - 백업서비스 제공
    - 클라우드 - OnPremis 이식성 높음

### 파일 스토리지

- 파일 시스템
  - On-Premise 환경에서는 File System을 활용
- [AWS](https://aws.amazon.com/ko/) S3 서비스
  - 클라우드 환경에서는 스토리지 서비스를 활용
