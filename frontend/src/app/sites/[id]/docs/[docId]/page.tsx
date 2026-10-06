import DocumentDetailScreen from "@/screens/DocumentDetailScreen";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id, docId } = await params;
  return <DocumentDetailScreen siteId={id} docId={docId} />;
}
