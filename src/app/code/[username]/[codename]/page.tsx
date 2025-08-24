'use client';

import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/code/projct-details';
import { apiClient } from '@/axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface CodeFile {
  name: string;
  path: string;
  size: string;
  createdAt: string;
  key: string;
  npmLink: string;
  redirectLink: string;
}

export interface Author {
  username: string;
  fullName: string;
}

export interface Folder {
  title: string;
  description: string;
  slug: string;
  downloadPath: string;
  access: string;
}

function ProjectDetailPage() {
  const { username, codename } = useParams<{
    username: string;
    codename: string;
  }>();

  const [files, setFiles] = useState<CodeFile[]>([]);
  const [author, setAuthor] = useState<Author>();
  const [folder, setFolder] = useState<Folder>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjectDetail() {
      try {
        const res = await apiClient.get(
          `/api/v1/web/folder/get-all-files?username=${username}&slug=${codename}`
        );
        console.log(res);
        setFiles(res.files || []);
        setAuthor(res.author || null);
        setFolder(res.folder || null);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetail();
  }, [username, codename]);

  if ((!author || !folder) && !loading) {
    return notFound();
  }

  if (!loading && author && folder) {
    return <ProjectDetail author={author} folder={folder} files={files} />;
  }
}

export default ProjectDetailPage;
