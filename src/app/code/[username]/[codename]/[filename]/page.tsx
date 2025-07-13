import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FileViewer } from "@/components/code/project-viewer";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/s3/client";

interface FileViewerPageProps {
  params: Promise<{
    username: string;
    codename: string;
    filename: string
  }>;
}

export default async function FileViewerPage({
  params,
}: FileViewerPageProps) {
  const { username, codename, filename } = await params;
  console.log(username, codename, filename);
  // Fetch user
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) notFound();

  // Fetch project
  const code = await db.code.findFirst({
    where: {
      authorId: user.id,
      title: codename,
    },
    include: {
      files: true,
    },
  });

  if (!code) notFound();

  // Find the file
  const file = code.files.find((f) => f.id === filename);

  if (!file) notFound();

  // Fetch file content
  const fileResponse = await fetch(file.signedUrl ?? "");
  const content = await fileResponse.text();

  return (
    <FileViewer
      code={content}
      filename={file.name}
      author={user.username}
      createdAt={code.createdAt.toISOString()}
      downloadUrl={file.signedUrl ?? ""}
    />
  );
}