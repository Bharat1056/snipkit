import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

const NotAuthenticate: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="shadow-xl border-2 border-primary/20 bg-card/80">
        <CardContent className="flex flex-col items-center justify-center py-16 px-12">
          <Lock className="h-12 w-12 text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-center">You are not logged in</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-xs">
            To access this page, please log in to your account. Your journey awaits—sign in to unlock all features!
          </p>
          <Button
            asChild
            size="lg"
            className="px-8 py-4 text-lg font-semibold"
          >
            <Link href="/login" prefetch={false}>
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAuthenticate;
