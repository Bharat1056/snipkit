import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FileViewer } from '@/components/code/project-viewer';
import { getSignedDownloadUrl } from '@/s3/function';

interface CodeFilePageProps {
  readonly params: Promise<{
    readonly username: string;
    readonly codename: string;
    readonly filename: string;
  }>;
}

export default async function CodeFilePage({ params }: CodeFilePageProps) {
  const { username, codename, filename } = await params;

  if (!username || !codename || !filename) {
    return notFound();
  }

  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return notFound();
  }

  const code = await db.code.findFirst({
    where: { authorId: user.id, slug: codename },
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
    disposition: 'attachment',
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
