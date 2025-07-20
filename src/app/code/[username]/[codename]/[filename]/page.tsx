import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FileViewer } from "@/components/code/project-viewer";
import { getSignedDownloadUrl } from "@/s3/function";

export default async function CodeFilePage({
  params,
  }: {
    params: Promise<{ username: string; codename: string; filename: string }>;
}) {
  const { username, codename, filename } = await params;

  if (!username || !codename || !filename) {
    return notFound();
  }

  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return notFound();
  }

  const code = await db.code.findFirst({
    where: { authorId: user.id, title: codename },
    include: { files: { where: { name: filename } } },
  });

  const file = code?.files[0];

  if (!code || !file) {
    return notFound();
  }

  const viewUrl = await getSignedDownloadUrl({
    key: file.key as string,
    expiresIn: 3600, // 1 hour
  });

  const downloadUrl = await getSignedDownloadUrl({
    key: file.key as string,
    expiresIn: 3600, // 1 hour
    disposition: "attachment",
    filename: file.name,
  });

  const response = await fetch(viewUrl);
  const fileContent = await response.text();

  return (
    <FileViewer
      code={fileContent}
      filename={file.name}
      author={username}
      createdAt={code.createdAt.toISOString()}
      downloadUrl={downloadUrl}
      path={file.path}  
    />
  );
}