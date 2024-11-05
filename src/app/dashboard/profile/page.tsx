"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Building } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/app/actions/user/user";
import axios from "axios";
import Loading from "../loading";

// Types for profile and password state
interface Profile {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  isSuperAdmin: boolean;
  organizations: { _id: string; name: string }[];
}

interface Password {
  current: string;
  new: string;
  confirm: string;
}

export default function UserProfilePage() {
  const { toast } = useToast();
  const [password, setPassword] = useState<Password>({
    current: "",
    new: "",
    confirm: "",
  });

  const [profile, setProfile] = useState<Profile>({
    _id: "1",
    fullname: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    isSuperAdmin: false,
    organizations: [{ _id: "1", name: "Acme Inc." }],
  });

  const {
    data: UserProfile,
    isLoading,
    isError,
  } = useQuery<Profile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await getUserProfile();
      setProfile(res);
      return res;
    },
  });

  const profileUpdateMutation = useMutation<Profile, Error, Profile>({
    mutationFn: async (data) => {
      const res = await axios.put(`/api/user/${UserProfile?._id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      setProfile(data);
      toast({
        title: "Profile updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
      });
    },
  });

  const passwordUpdateMutation = useMutation<void, Error, Password>({
    mutationFn: async (data) => {
      const res = await axios.patch(`/api/user/${UserProfile?._id}`, {
        currentPassword: data.current,
        newPassword: data.new,
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Password changed successfully",
      });
      setPassword({ current: "", new: "", confirm: "" });
    },
    onError: (error) => {
      console.error("Error changing password:", error);
      toast({
        title: "Error changing password",
      });
    },
  });

  const handleUpdateProfile = () => {
    profileUpdateMutation.mutate(profile);
  };

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      toast({ title: "Passwords do not match" });
      return;
    }
    passwordUpdateMutation.mutate(password);
  };

  const handleChange = (field: keyof Profile, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching user profile</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt={UserProfile?.fullname || ""}
              />
              <AvatarFallback>
                {UserProfile?.fullname
                  ? UserProfile.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : ""}
              </AvatarFallback>
            </Avatar>
            <Button>Change Picture</Button>
          </CardContent>
        </Card>
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={profile.fullname}
                      onChange={(e) => handleChange("fullname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={password.current}
                      onChange={(e) =>
                        setPassword({ ...password, current: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={password.new}
                      onChange={(e) =>
                        setPassword({ ...password, new: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={password.confirm}
                      onChange={(e) =>
                        setPassword({ ...password, confirm: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="superadmin"
                      checked={profile.isSuperAdmin}
                      onCheckedChange={(checked) =>
                        handleChange("isSuperAdmin", checked)
                      }
                    />
                    <Label htmlFor="superadmin">Super Admin</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="organizations">
              <Card>
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>
                    Organizations you&apos;re a part of.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {UserProfile?.organizations.map((org) => (
                      <div
                        key={org._id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center space-x-4">
                          <Building className="text-gray-400" />
                          <div>
                            <p className="font-medium">{org.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
