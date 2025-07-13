import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/code/projct-details";
import { db } from "@/lib/db";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; codename: string }>;
}) {
  const { username, codename } = await params;

  if (!username || !codename) {
    return notFound();
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    return notFound();
  }

  const code = await db.code.findFirst({
    where: {
      authorId: user.id,
      title: codename,
    },
    include: {
      files: true,
    },
  });

  if (!code) {
    return notFound();
  }

  return (
    <ProjectDetail
      username={username}
      title={code.title}
      description={code.description}
      downloadPath={code.downloadPath ?? ""}
      access={code.access}
      files={code.files.map((f) => ({
        id: f.id,
        name: f.name,
        key: f.key ?? "",
        signedUrl: f.signedUrl,
        size: f.size,
      }))}
    />
  );
}
