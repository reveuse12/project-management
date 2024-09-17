"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Page = ({ params }: { params: { code: number } }) => {
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const verifyMutations = useMutation({
    mutationFn: async (code: number) => {
      const response = await axios.post(`/api/user/verify/${code}`);
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
    verifyMutations.mutate(params.code); // Pass the code from params
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
      <h1>Email Verification</h1>
      <p>Click the button below to verify your email address.</p>

      <Button onClick={handleVerification} disabled={verifyMutations.isPending}>
        {verifyMutations.isPending ? "Verifying..." : "Verify Email"}
      </Button>

      {status === "success" && (
        <p>Email verified successfully! Redirecting...</p>
      )}
      {status === "error" && <p>Verification failed. Please try again.</p>}
    </div>
  );
};

export default Page;
