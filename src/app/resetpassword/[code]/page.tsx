"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Page = ({ params }: { params: { code: number } }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const resetPasswordMutation = useMutation({
    mutationFn: async (code: number) => {
      const response = await axios.post(`/api/user/reset/${code}`, {
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      setStatus("success");
      toast({
        title: "Verification successful",
      });
      router.push("/login");
    },
    onError: (error) => {
      setStatus("error");
      toast({
        title: "Error verifying",
        description: "Please try again.",
      });
      console.log(error);
    },
  });

  const handleVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    resetPasswordMutation.mutate(params.code);
  };

  useEffect(() => {
    if (!params?.code) {
      setStatus("error");
      toast({
        title: "No verification code",
        description: "Invalid verification request.",
      });
    }
  }, [params, toast]);

  return (
    <div className="container">
      <h1>Password Reset</h1>
      <p>Add your new password below.</p>

      <form onSubmit={handleVerification}>
        <Input
          name="password"
          type="password"
          placeholder="new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending
            ? "Saving new password..."
            : "Save password"}
        </Button>
      </form>

      {status === "success" && (
        <p>Password reset successfully! Redirecting...</p>
      )}
      {status === "error" && <p>Password reset failed. Please try again.</p>}
    </div>
  );
};

export default Page;
