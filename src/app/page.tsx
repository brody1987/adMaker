import { AdTypeCard } from "@/components/ad-type-card";

const AD_TYPES = [
  {
    title: "비즈보드",
    description:
      "카카오톡 채팅 목록 상단에 노출되는 프리미엄 배너 광고. 높은 도달률과 브랜드 인지도 향상에 효과적입니다.",
    href: "/bizboard",
    specs: ["1029 × 258px", "오브젝트형", "썸네일형", "마스킹형"],
    icon: "📢",
    previewImage: "/templates/bizboard-preview.svg",
  },
  {
    title: "디스플레이",
    description:
      "카카오 서비스 내 다양한 지면에 노출되는 이미지 광고. 다양한 비율로 유연하게 제작할 수 있습니다.",
    href: "/display",
    specs: ["2:1 (1200×600)", "1:1 (500×500)", "9:16 (720×1280)", "4:5 (800×1000)"],
    icon: "🖼️",
    previewImage: "/templates/display-preview.svg",
  },
  {
    title: "메시지",
    description:
      "카카오톡 비즈메시지를 통해 전달되는 이미지 광고. 와이드이미지, 캐러셀 등 다양한 형태를 지원합니다.",
    href: "/message",
    specs: ["와이드이미지", "와이드리스트", "캐러셀", "기본텍스트"],
    icon: "💬",
    previewImage: "/templates/message-preview.svg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            카카오 광고 배너 메이커
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI가 제품 이미지를 분석하여 카카오 광고 규격에 맞는 배너를 자동으로 생성합니다.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {AD_TYPES.map((adType) => (
            <AdTypeCard
              key={adType.href}
              title={adType.title}
              description={adType.description}
              href={adType.href}
              specs={adType.specs}
              icon={adType.icon}
              previewImage={adType.previewImage}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          광고 유형을 선택하면 제품 이미지 업로드 및 배너 생성 페이지로 이동합니다.
        </p>
      </main>
    </div>
  );
}
