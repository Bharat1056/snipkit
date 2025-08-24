'use client';

import { notFound } from 'next/navigation';
import { FileViewer } from '@/components/code/project-viewer';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/axios';
import axios from 'axios';

interface File {
  name: string;
  size: string;
  createdAt: string;
  npmLink: string;
}

function Page() {
  const { username, codename, filename } = useParams<{
    username: string;
    codename: string;
    filename: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  useEffect(() => {
    async function fetchCodeFile() {
      try {
        const res = await apiClient.get(
          `/api/v1/web/file/get/content?username=${username}&slug=${codename}&filename=${filename}`
        );
        setFile(res.file);
        setDownloadUrl(res.url);
        const data = await axios.get(res.url);
        setFileContent(data.data);
      } catch (error) {
        console.error('Error fetching code file:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCodeFile();
  }, [codename, filename, username]);

  if (!file && !loading) {
    return notFound();
  }

  if (!loading && file) {
    return (
      <FileViewer
        code={fileContent}
        filename={file.name}
        author={username}
        createdAt={file.createdAt}
        downloadUrl={downloadUrl}
        command={file.npmLink}
      />
    );
  }
}

export default Page;
