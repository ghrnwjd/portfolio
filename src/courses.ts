// ─────────────────────────────────────────────────────────────
// 수강 과목별 흐름. 과목을 추가하려면 배열에 하나 더 넣으면 됩니다.
// slug는 주소가 됩니다: /courses/<slug>
// kind: "learn" 학습 · "work" 발표·과제 · "research" 연구로 이어진 것
// ─────────────────────────────────────────────────────────────

export type Kind = "learn" | "work" | "research";
export type Step = { when: string; kind: Kind; title: string; desc: string; out?: string };
export type Course = {
  slug: string;
  name: string;
  meta: string;
  summary: string;
  card: string; // 메인 카드에 들어갈 한 줄
  steps: Step[];
  takeaway: string;
};

export const courses: Course[] = [
  {
    slug: "is-seminar",
    name: "정보시스템세미나",
    meta: "2026년 2학기",
    card: "AI 윤리 규범이 모델 학습 파이프라인에 들어가는 방식 · 발표 3회, 가설 3건",
    summary:
      "AI 윤리 교재를 장별로 읽고 발표하면서, 규범이 실제 모델 학습 파이프라인에 어떻게 들어가는지를 공학 관점으로 풀어낸 수업.",
    steps: [
      { when: "1주차", kind: "work", title: "AI 윤리 원칙 발표", desc: "국가법 → 기업 정책 → 모델 가중치로 내려가며 생기는 ‘번역 손실’을 학습 파이프라인(데이터 필터링, RLHF, Constitutional AI, 배포 분류기) 단위로 설명.", out: "발표 자료 12장 · 근거 논문 6편" },
      { when: "5장", kind: "work", title: "웰빙 장 요약", desc: "디지털 기술과 AI 시대의 웰빙, 네 가지 적용 영역과 정책·윤리를 정리.", out: "요약 덱 18장" },
      { when: "5장", kind: "research", title: "온디바이스 AI 보안 가설", desc: "온디바이스 AI는 위험을 줄이는 게 아니라 위협 표면을 서버에서 기기·모델 수준으로 옮긴다는 가설(H1)을 세우고 실제 사례로 뒷받침.", out: "가설 슬라이드 1장" },
      { when: "7주차", kind: "work", title: "AI 가치 조정 발표", desc: "7장 1.3절(사회문화적 맥락)과 2.1절(기획·설계 단계)을 2024~2026 사례와 함께 발표.", out: "발표 자료 29장" },
      { when: "7주차", kind: "research", title: "Constitutional AI 학습 구조와 가설", desc: "교수님 요청으로 CAI의 SL-CAI → RL-CAI 구조를 수도코드로 풀고, 헌법 적용 위치·원칙 충돌 처리에 관한 가설 2개를 제안.", out: "추가 덱 21장" },
    ],
    takeaway:
      "규범을 ‘선언’이 아니라 시스템에 들어가는 입력으로 보는 관점. 이 관점이 온디바이스 AI 보안과 모델 무결성 검증이라는 연구 질문으로 이어졌다.",
  },
  {
    slug: "on-device-ai",
    name: "온디바이스AI",
    meta: "2026년 2학기",
    card: "모델 경량화에서 경량화 모델의 무결성 검증까지",
    summary:
      "클라우드 밖에서 도는 모델을 어떻게 가볍게 만들고, 그렇게 만든 모델을 어떻게 믿을 수 있는지까지 따라간 수업.",
    steps: [
      { when: "수강 전", kind: "learn", title: "선수 학습 계획", desc: "2년 만의 공학 수업이라 PyTorch와 양자화(torch.quantization) 실습 위주로 준비 계획을 세움." },
      { when: "초반", kind: "learn", title: "경량화 기법 지도 그리기", desc: "양자화, 프루닝, 지식 증류, 경량 아키텍처, NAS를 비교. MobileNet의 depthwise separable convolution 구조를 정리." },
      { when: "중반", kind: "learn", title: "AWQ 깊게 보기", desc: "LLM 가중치 양자화 기법 AWQ와 GPTQ의 차이를 파고듦." },
      { when: "중반", kind: "research", title: "경량화 모델 무결성 검증", desc: "양자화된 모델이 배포 중 변조되지 않았음을 블록체인으로 검증하는 방향과, 이를 실제로 배포하는 백엔드 플랫폼 방향을 결합.", out: "논문 방향 정리 · 참고 논문" },
      { when: "[이후]", kind: "work", title: "[기말 과제]", desc: "[학기 후반 내용을 연구노트에 기록하면 여기에 추가]" },
    ],
    takeaway:
      "‘모델을 줄이는 것’과 ‘줄인 모델을 신뢰하는 것’은 별개의 문제라는 것. 두 번째 문제가 블록체인 관심사와 만나는 지점이 됐다.",
  },
  {
    slug: "deep-learning-research",
    name: "딥러닝기법을 활용한 데이터 분석과 논문작성",
    meta: "2026년 2학기",
    card: "[과목 한 줄 소개]",
    summary: "[과목 소개 — 이 과목에서 무엇을 배웠는지]",
    steps: [
      { when: "[주차]", kind: "learn", title: "[학습한 내용]", desc: "[설명]" },
      { when: "[주차]", kind: "work", title: "[실습 · 과제]", desc: "[설명]", out: "[산출물]" },
      { when: "[주차]", kind: "research", title: "[논문으로 이어진 부분]", desc: "[설명]" },
    ],
    takeaway: "[이 과목에서 가져간 것]",
  },
    {
    slug: "digital-platform-policy",
    name: "디지털플랫폼정책",
    meta: "2026년 1학기",
    card: "AI 시대 네트워크 효과와 데이터 독점 · 종합 보고서",
    summary: "AI가 들어오면 플랫폼의 네트워크 효과와 데이터 독점이 어떻게 바뀌는지를 이론 틀로 정리한 수업.",
    steps: [
      { when: "초반", kind: "learn", title: "AI 시대 플랫폼 특성 변화", desc: "네트워크 효과, 데이터 활용, 전환 비용, 규모의 경제가 AI 이전과 이후에 어떻게 달라지는지 문헌으로 비교.", out: "비교 덱 9장" },
      { when: "중반", kind: "work", title: "AI 민주화의 역설 가설", desc: "오픈 데이터는 진입 장벽을 낮추지만, 기존 플랫폼의 행동 데이터는 대체되지 않아 오히려 집중이 심화된다는 가설.", out: "가설 덱 2장" },
      { when: "중반", kind: "work", title: "OSI 계층으로 본 플랫폼 데이터 생태계", desc: "OSI 7계층에 에이전트 통신(L8)과 의미 조정(L9)을 더한 L1–L9 틀로 데이터 플라이휠을 분석.", out: "발표 덱 9장" },
      { when: "후반", kind: "work", title: "규제가 만드는 재중개화", desc: "STO 관련 법 개정을 사례로, 규제가 새로운 중개 계층을 만드는 구조를 분석." },
      { when: "기말", kind: "work", title: "종합 보고서", desc: "한 학기 발표 자료 158쪽을 하나의 보고서로 통합하고, 연구의 한계 5가지를 정직하게 정리.", out: "종합 보고서 · 데이터 흐름도" },
    ],
    takeaway:
      "기술 변화를 계층 구조로 쪼개서 보는 습관. 이후 시스템을 설계할 때도 ‘어느 계층의 문제인가’부터 묻게 됐다.",
  },
];
