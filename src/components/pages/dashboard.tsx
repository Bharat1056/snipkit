"use client"

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import { PublicCodeGallery } from "../code/public-code-gallery";
import React from "react";
import Link from "next/link";

const Dashboard: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div>
          <div className="container mx-auto px-4 mt-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {session?.user?.username ?? "User"}!
                </p>
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        My Codes
                      </CardTitle>
                      <CardDescription>
                        Manage your code snippets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/code">View Codes</Link>
                      </Button>
                    </CardContent>
              </Card>
            </div>
            {/* Public Code Snippets */}
            <div className="mb-8">
                <PublicCodeGallery />
            </div>
          </div>
        </div>

    )
}

export default Dashboard;