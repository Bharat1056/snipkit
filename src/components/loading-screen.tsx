import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    readonly message?: string;
}

const LoadingScreen: React.FC<Props> = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="shadow-xl border-2 border-primary/20 bg-card/80">
        <CardContent className="flex flex-col items-center justify-center py-16 px-12">
          <Button
            size="lg"
            className="gap-3 px-8 py-6 text-lg font-semibold cursor-default select-none"
            disabled
            tabIndex={-1}
            aria-busy="true"
          >
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <span className="ml-3">{message}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingScreen;
