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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Key, Building, Shield } from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState({
    username: "johndoe",
    fullname: "John Doe",
    email: "john@example.com",
    isVerified: true,
    isSuperAdmin: false,
    organizations: [
      {
        organization: { _id: "1", name: "Acme Inc." },
        role: { _id: "1", name: "Admin" },
      },
      {
        organization: { _id: "2", name: "Tech Corp" },
        role: { _id: "2", name: "Member" },
      },
    ],
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleUpdateProfile = () => {
    // In a real app, this would make an API call to update the user profile
    console.log("Profile updated:", user);
  };

  const handleChangePassword = () => {
    // In a real app, this would make an API call to change the password
    console.log("Password change requested:", password);
    setPassword({ current: "", new: "", confirm: "" });
  };

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
                alt={user.fullname}
              />
              <AvatarFallback>
                {user.fullname
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
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
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={user.fullname}
                      onChange={(e) =>
                        setUser({ ...user, fullname: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="verified"
                      checked={user.isVerified}
                      onCheckedChange={(checked) =>
                        setUser({ ...user, isVerified: checked })
                      }
                    />
                    <Label htmlFor="verified">Verified Account</Label>
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
                      checked={user.isSuperAdmin}
                      onCheckedChange={(checked) =>
                        setUser({ ...user, isSuperAdmin: checked })
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
                    Organizations you're a part of.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.organizations.map((org, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center space-x-4">
                          <Building className="text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {org.organization.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Role: {org.role.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{org.role.name}</Badge>
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
