export interface CodeFile {
  id: string;
  title: string;
  description?: string;
  slug: string;
  language: string;
  exploitLocation: string;
  access: string;
  createdAt: string;
  user: { username: string };
  downloadUrl?: string;
}
