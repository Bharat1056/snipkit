"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugAuth() {
  const { data: session, status } = useSession();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>Status:</strong> {status}
          </div>
          {session ? (
            <div className="space-y-1">
              <div><strong>User ID:</strong> {session.user?.id}</div>
              <div><strong>Email:</strong> {session.user?.email}</div>
              <div><strong>Username:</strong> {session.user?.username}</div>
              <div><strong>Name:</strong> {session.user?.fullName}</div>
            </div>
          ) : (
            <div>No session</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 