import EditSiteScreen from "@/screens/EditSiteScreen";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditSiteScreen siteId={id} />;
}
