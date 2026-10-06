import SiteDetailScreen from "@/screens/SiteDetailScreen";

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SiteDetailScreen siteId={id} />;
}
