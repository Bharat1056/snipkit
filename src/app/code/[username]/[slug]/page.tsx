import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/s3/function";
import { CodeViewer } from "@/components/code/code-viewer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CopyCommandButton } from "../../component/copy-command-btn";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { username: string; slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username, slug } = params;

  const codeFile = await db.code.findUnique({
    where: { slug: `@${username}_${slug}` },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!codeFile) {
    return {
      title: "Snippet Not Found",
      description: "The code snippet you are looking for does not exist.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = 'https://snipkit.bharatpanigrahi.com';

  return {
    title: `${codeFile.title} by @${username}`,
    description: codeFile.description || `View and download the ${codeFile.language} code snippet: ${codeFile.title}`,
    openGraph: {
      title: `${codeFile.title} | Snipkit`,
      description: codeFile.description || `A ${codeFile.language} code snippet by @${username}.`,
      url: `${siteUrl}/code/${username}/${slug}`,
      images: [
        // You might want to generate dynamic OG images for snippets
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${codeFile.title} | Snipkit`,
      description: codeFile.description || `A ${codeFile.language} code snippet by @${username}.`,
      creator: `@${username}`, // assuming the username is the twitter handle
      // images: ['/og-image-for-snippet.png'],
    },
  };
}


interface CodeViewerPageProps {
  readonly params: {
    username: string;
    slug: string;
  };
}

export default async function CodeViewerPage({ params }: CodeViewerPageProps) {
  const { username, slug } = params;
  const session = await getServerSession(authOptions);

  // Find the user
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  // Find the code file
  const codeFile = await db.code.findUnique({
    where: { slug: `@${username}_${slug}` },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!codeFile) {
    notFound();
  }

  // Check access permissions
  if (codeFile.access === "private" && (!session?.user?.id || session.user.id !== codeFile.userId)) {
    notFound();
  }

  // Get signed download URL
  const downloadUrl = await getSignedDownloadUrl({ key: codeFile.s3Key });

  // Fetch the actual code content from S3
  let codeContent = "";
  try {
    const response = await fetch(downloadUrl);
    if (response.ok) {
      codeContent = await response.text();
    }
  } catch (error) {
    console.error("Failed to fetch code content:", error);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{codeFile.title}</h1>
          <p className="text-muted-foreground mb-4">
            {codeFile.description || "No description provided"}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {codeFile.user?.username || 'Unknown'}</span>
            <span>•</span>
            <span>{new Date(codeFile.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{codeFile.language}</span>
            <span>•</span>
            <span>Exploit Location: {codeFile.exploitLocation}</span>
          </div>
        </div>
        {/* Command block */}
        <div className="mb-8">
          <div className="flex items-center bg-muted rounded-lg px-4 py-3 font-mono text-sm">
            <span className="flex-1 select-all">npx snipkit create @{username}/{slug}</span>
              <CopyCommandButton command={`npx snipkit create @${username}/${slug}`} />
          </div>
        </div>
        <CodeViewer 
          code={codeContent}
          language={codeFile.language}
          filename={slug}
          downloadUrl={downloadUrl}
        />
      </div>
    </div>
  );
} 