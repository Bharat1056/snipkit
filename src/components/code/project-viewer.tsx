import { Button } from "../ui/button";
import { Download, Calendar, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileViewerProps {
  code: string;
  filename: string;
  author: string;
  createdAt: string;
  downloadUrl: string;
}

export function FileViewer({
  code,
  filename,
  author,
  createdAt,
  downloadUrl,
}: FileViewerProps) {
  return (
    <div className="container max-w-5xl py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{filename}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4">
            <a href={downloadUrl} download>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </a>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="border rounded-lg max-h-[600px] p-4">
        <SyntaxHighlighter style={oneDark}>
          {code}
        </SyntaxHighlighter>
      </ScrollArea>
    </div>
  );
}
