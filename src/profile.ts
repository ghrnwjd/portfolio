// ─────────────────────────────────────────────────────────────
// 포트폴리오 내용. 평소에는 이 파일과 courses.ts만 고치면 됩니다.
// 수정 → git push → Cloudflare가 자동 배포
// [ ] 로 표시된 곳은 직접 채워주세요.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "정호영",
  nameEn: "Hoyeong Jung",
  email: "hoyoung2@hufs.ac.kr",
  github: "https://github.com/ghrnwjd",
  photo: "", // 이미지 URL. 비워두면 자리 표시가 나옵니다. (public/me.jpg 처럼 넣어도 됨)

  intro:
    "한국외국어대학교 대학원 경영정보(MIS) 석사과정. 블록체인과 AI 에이전트를 백엔드 시스템 관점에서 연구하고, 직접 만들어 배포합니다.",

  about:
    "정보통신공학을 전공하고 지금은 경영정보 대학원에서 기술이 플랫폼과 비즈니스 안에서 어떻게 작동하는지를 연구하고 있습니다.",

  certs: ["AWS Developer Associate(DVA-C02)", "SQLD", "정보처리기사"],

  education: [
    { period: "2026.03 – 현재", text: "한국외국어대학교 대학원 국제경영학과 경영정보전공 석사과정" },
    { period: "– 2024.08", text: "한국외국어대학교 정보통신공학 학사" },
  ],

  career: [
    { period: "2026.03 - 2027.02", text: "한국외국어대학교 대학원 국제경영학과 조교" },
    { period: "2023.03 - 2026.07", text: "학생연구원 · 디지털새싹(한국과학창의재단), 찾아가는 학교 컨설팅" },
  ],

  interests: [
    { title: "블록체인", desc: "소프트웨어 공급망 무결성, 스마트 컨트랙트 기반 검증 구조" },
    { title: "AI 에이전트", desc: "도구를 쓰는 에이전트와 MCP 기반 시스템 연동" },
    { title: "온디바이스 AI", desc: "클라우드 밖에서 동작하는 경량 모델과 그 활용" },
  ],

  publications: [
    {
      year: "2024",
      title: "기하학적 특징 추가를 통한 얼굴 감정 인식 성능 개선",
      authors: ["정호영", "한희일"],
      venue: "한국인터넷방송통신학회 논문지(JIIBC)",
      detail: "24권 1호, 155–161",
      note: "학부 졸업논문을 발전시켜 게재",
      href: "#", // 논문 링크(DOI 등)
    },
  ],

  skills: ["Java", "Spring Boot", "Solidity", "web3j", "AWS", "SQL", "TypeScript", "Cloudflare Workers", "MCP", "Python"],

  // 메인에는 name/desc/stack만, /projects 에는 전부 나옵니다.
  projects: [
    {
      name: "ChainRegistry",
      featured: true,
      desc: "블록체인에 패키지 해시를 등록해 npm 패키지 위변조를 검증하는 시스템",
      lead: "npm 패키지가 배포 이후 바뀌지 않았는지 블록체인으로 검증합니다.",
      stack: ["Spring Boot", "web3j", "Solidity", "AWS"],
      flow: ["npm 클라이언트", "Spring Boot API", "web3j", "PackageRegistry.sol"],
      problem: "레지스트리 계정 탈취나 배포 후 변조를 사용자가 알아채기 어렵다.",
      approach: "배포 시점의 패키지 해시를 스마트 컨트랙트에 기록하고, 설치 시 대조한다.",
      result: "[측정 결과 — 예: 검증 지연, 등록 가스비]",
      links: [
        { text: "GitHub", href: "#" },
        { text: "제안서", href: "#" },
        { text: "발표 자료", href: "#" },
      ],
    },
    {
      name: "research-mcp",
      desc: "Claude에 MCP로 연결해 대화 중 연구 진행을 기록하는 개인 연구노트 서버",
      lead: "Claude에 MCP로 연결되는 개인 연구노트 서버. 이 사이트의 연구노트도 여기서 옵니다.",
      stack: ["Cloudflare Workers", "D1", "MCP"],
      links: [{ text: "GitHub", href: "#" }],
    },
    {
      name: "대학원 관리 시스템",
      desc: "논문 라이브러리, 연구 일지, 마일스톤 등 9개 데이터베이스로 구성한 대학원 생활 운영 체계",
      lead: "논문 라이브러리, 연구 일지, 아이디어 박스, 마일스톤 등 9개 데이터베이스로 대학원 생활을 운영합니다.",
      stack: ["Notion"],
      links: [],
    },
  ] as Project[],
};

export type Project = {
  name: string;
  featured?: boolean;
  desc: string;
  lead: string;
  stack: string[];
  flow?: string[];
  problem?: string;
  approach?: string;
  result?: string;
  links: { text: string; href: string }[];
};
