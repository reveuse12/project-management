"use client";

import { Key, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Users,
  Clipboard,
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getOgranizations } from "@/app/actions/organization/organization";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import Link from "next/link";
import Loading from "../loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProjects } from "@/app/actions/project/project";
import { getUser } from "@/app/actions/user/user";

interface Organization {
  _id?: string;
  name?: string;
  description?: string;
  projects?: Array<{
    _id?: string;
    title?: string;
    status?: string;
    members?: Array<{
      _id?: string;
      email?: string;
      name?: string;
      role?: string;
    }>;
  }>;
  admin?: Array<{ _id?: string; email?: string }>;
  members?: Array<{ user: string; role?: string }>;
}

interface Memberss {
  id: string;
  username: string;
}

interface ProjectType {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  members?: Array<{ _id?: string; email?: string; name?: string }>;
  admin?: Array<{ _id?: string; email?: string }>;
}

interface MemberType {
  userId: string;
  roleId?: string;
}

export default function OrganizationManagementPage() {
  const [organization, setOrganization] = useState<Organization>({
    name: "Acme Inc.",
    description: "A leading technology company",
    projects: [
      { _id: "1", title: "Project Alpha", status: "in progress" },
      { _id: "2", title: "Project Beta", status: "not started" },
    ],
    members: [
      {
        _id: "1",
        user: { _id: "1", fullname: "John Doe", email: "john@example.com" },
        role: { _id: "1", name: "Admin" },
      },
      {
        _id: "2",
        user: { _id: "2", fullname: "Jane Smith", email: "jane@example.com" },
        role: { _id: "2", name: "Member" },
      },
    ],
  });

  const [currentProject, setCurrentProject] = useState<ProjectType>({
    title: "",
    description: "",
    status: "not started",
  });

  const [roles, setRoles] = useState([
    {
      _id: "1",
      name: "Admin",
      permissions: ["read", "write", "create", "update", "delete"],
    },
    { _id: "2", name: "Member", permissions: ["read", "write"] },
  ]);

  const [newMember, setNewMember] = useState<MemberType>({
    userId: "",
    roleId: "",
  });

  const [newProject, setNewProject] = useState<ProjectType>({
    title: "",
    description: "",
    status: "not started",
  });

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const addOrganizationMutation = useMutation({
    mutationFn: async (organization: Organization) => {
      const res = await axios.post("/api/organization", organization);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("success", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (project: ProjectType) => {
      const res = await axios.post("/api/project", project);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("success", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (member: MemberType) => {
      const res = await axios.post("/api/member", member);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("success", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    data: Organizations,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOgranizations(),
  });

  const {
    data: Projectss,
    isFetching: ProjectsIsFetching,
    isError: projectsIsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  console.log(Projectss);

  const {
    data: Members,
    isFetching: MembersIsFetching,
    isError: MembersIsError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: () => getUser(),
  });

  const handleUpdateOrganization = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    addOrganizationMutation.mutate(organization);
  };

  if (isFetching || ProjectsIsFetching) return <Loading />;
  if (isError || projectsIsError) return <h1>Error fetching data</h1>;

  const handleAddMember = () => {
    if (newMember.userId && newMember.roleId) {
      const user = {
        _id: newMember.userId,
        fullname: "New User",
        email: "newuser@example.com",
      };
      const role = roles.find((r) => r._id === newMember.roleId);
      setOrganization({
        ...organization,
        members: [
          ...organization.members,
          { _id: Date.now().toString(), user },
        ],
      });
      addMemberMutation.mutate(newMember);
      setNewMember({ userId: "", roleId: "" });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setOrganization({
      ...organization,
      members: organization.members.filter((m) => m._id !== memberId),
    });
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      setOrganization({
        ...organization,
        projects: [
          ...organization.projects,
          { _id: Date.now().toString(), ...newProject },
        ],
      });
      setNewProject({ title: "", description: "", status: "not started" });
    }
    addProjectMutation.mutate(newProject);
  };

  const handleEditClick = (project: ProjectType) => {
    setCurrentProject(project);
    setOpenDialog(true);
  };

  return (
    <ScrollArea className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Building2 className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Clipboard className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Manage your organization's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={organization.name}
                  onChange={(e) =>
                    setOrganization({ ...organization, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgDescription">Description</Label>
                <Textarea
                  id="orgDescription"
                  value={organization.description}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Admin</Label>
                {/* <Input value={organization.admin.fullname} disabled /> */}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateOrganization}>
                Add Organizations
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Organizations</CardTitle>
              <CardDescription>
                All Organizations in the system.
              </CardDescription>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Organizations &&
                    Organizations.organizations.map((project: Organization) => (
                      <TableRow key={project._id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(project)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit project</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Dialog Component */}
          {currentProject && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit Project: {currentProject.name}</DialogTitle>
                </DialogHeader>
                <form>
                  <div>
                    <label htmlFor="projectName">Project Name</label>
                    <input
                      id="projectName"
                      defaultValue={currentProject.name}
                      className="input-class"
                    />
                  </div>
                  <div>
                    <label htmlFor="projectDescription">Description</label>
                    <textarea
                      id="projectDescription"
                      defaultValue={currentProject.description}
                      className="input-class"
                    />
                  </div>
                </form>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenDialog(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage organization projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description</Label>
                    <Input
                      id="projectDescription"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectStatus">Status</Label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) =>
                        setNewProject({ ...newProject, status: value })
                      }
                    >
                      <SelectTrigger id="projectStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not started">Not Started</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Projectss &&
                      Projectss.projects.map(
                        (project: ProjectType, _index: Key) => (
                          <TableRow key={project._id}>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  project.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit project</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage organization members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="userId">User</Label>
                    <Select
                      value={newMember.userId}
                      onValueChange={(value) =>
                        setNewMember({ ...newMember, userId: value })
                      }
                    >
                      <SelectTrigger id="userId">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {Members?.users?.map((member: Memberss) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="roleId">Role</Label>
                    <Select
                      value={newMember.roleId}
                      onValueChange={(value) =>
                        setNewMember({ ...newMember, roleId: value })
                      }
                    >
                      <SelectTrigger id="roleId">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role._id} value={role._id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddMember}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {organization.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={member.user.fullname}
                        />
                        <AvatarFallback>
                          {member.user.fullname
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.fullname}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{member.role.name}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove member</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
