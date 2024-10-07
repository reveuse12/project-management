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
import { getProjects } from "@/app/actions/project/project";
import { getUser } from "@/app/actions/user/user";
import { useToast } from "@/hooks/use-toast";
import {
  useOrganizationStore,
  useProjectStore,
  useRoleStore,
} from "@/app/store/store";
import { getRoles } from "@/app/actions/roles/roles";
import { Role } from "@/app/helpers/types";

interface Organization {
  _id: string;
  name: string;
  description: string;
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
  admin?: {
    _id: string;
    email?: string;
    name?: string;
    fullname?: string;
  };
  members?: Array<{ user: { _id: string; fullname: string }; role?: string }>;
}

interface Memberss {
  _id: string;
  username: string;
  fullname: string;
  email: string;
}

interface ProjectType {
  _id: string;
  title?: string;
  description?: string;
  status?: string;
  organization: {
    _id?: string;
    name: string;
  };
  members?: Array<{ _id?: string; email?: string; name?: string }>;
  admin?: Array<{ _id?: string; email?: string }>;
}

interface MemberType {
  userId: string;
  roleId: string;
  organizationId: string;
}

export default function OrganizationManagementPage() {
  const { toast } = useToast();
  const {
    setOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganizationStore();
  const { setProjects, updateProject, deleteProject } = useProjectStore();
  const { setRoles, addRole, updateRole, deleteRole } = useRoleStore();

  const [organization, setOrganization] = useState<Organization>({
    _id: "",
    name: "",
    description: "",
    members: [],
  });

  const [newProject, setNewProject] = useState<ProjectType>({
    _id: "",
    title: "",
    description: "",
    status: "not started",
    organization: { _id: "", name: "" },
  });

  const [newMember, setNewMember] = useState<MemberType>({
    userId: "",
    roleId: "",
    organizationId: "",
  });

  const handleEditClick = (organization: Organization) => {
    setOrganization(organization);
  };

  const handleMutationSuccess = (
    message: string,
    updatedData: Organization
  ) => {
    toast({ title: message });
    setOrganization({ _id: "", name: "", description: "", members: [] }); // Clear organization with safe default
  };

  const addOrganizationMutation = useMutation({
    mutationFn: (org: Organization) =>
      axios.post("/api/organization", org).then((res) => res.data),
    onSuccess: (data) => {
      addOrganization(data);
      handleMutationSuccess("New Organization Added", data);
    },
    onError: () => toast({ title: "Error Adding Organization" }),
  });

  const updateOrganizationMutation = useMutation({
    mutationFn: (org: Organization) =>
      axios.put(`/api/organization/${org._id}`, org).then((res) => res.data),
    onSuccess: (data) => {
      updateOrganization(data);
      handleMutationSuccess("Organization Updated", data);
    },
    onError: () => toast({ title: "Error Updating Organization" }),
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: (orgId: string) =>
      axios.delete(`/api/organization/${orgId}`).then((res) => res.data),
    onSuccess: (data) => {
      deleteOrganization(data._id as string);
      toast({ title: "Organization Deleted" });
    },
    onError: () => toast({ title: "Error Deleting Organization" }),
  });

  const handleUpdateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (organization._id) {
      updateOrganizationMutation.mutate(organization);
    } else {
      addOrganizationMutation.mutate(organization);
    }
  };

  const {
    data: Organizations,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOgranizations,
  });

  const {
    data: Projectss,
    isFetching: ProjectsIsFetching,
    isError: projectsIsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const {
    data: Members,
    isFetching: MembersIsFetching,
    isError: MembersIsError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getUser,
  });

  const {
    data: Roles,
    isFetching: RolesIsFetching,
    isError: RolesIsError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const addProjectMutation = useMutation({
    mutationFn: async (project: ProjectType) => {
      const res = await axios.post(
        `/api/organization/${project.organization?._id}/project`,
        project
      );
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "New Project Added",
      });
    },
    onError: () => {
      toast({
        title: "Error Adding Project",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (project: ProjectType) => {
      const res = await axios.put(
        `/api/organization/${project.organization?._id}/project/${project._id}`,
        project
      );
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Project Updated",
      });
    },
    onError: () => {
      toast({
        title: "Error Updating Project",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (project: ProjectType) => {
      const res = await axios.delete(
        `/api/organization/${project.organization?._id}/project/${project._id}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Project Deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Project",
      });
    },
  });

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject._id) {
      updateProjectMutation.mutate(newProject);
    } else {
      addProjectMutation.mutate(newProject);
    }
  };

  const handleEditProject = (project: ProjectType) => {
    setNewProject(project);
  };

  const addMemberMutation = useMutation({
    mutationFn: async (member: MemberType) => {
      const res = await axios.post(
        `/api/organization/${member.organizationId}/user/${member.userId}/${member.roleId}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "New Member Added",
      });
    },
    onError: () => {
      toast({
        title: "Error Adding Member",
      });
    },
  });

  const handleUpdateMember = () => {
    addMemberMutation.mutate(newMember);
  };

  const handleRemoveMember = (memberId: string) => {
    setOrganization({
      ...organization,
      members: organization.members!.filter((m) => m.user._id !== memberId),
    });
  };

  if (
    RolesIsFetching ||
    MembersIsFetching ||
    isFetching ||
    ProjectsIsFetching
  ) {
    return <Loading />;
  }

  if (isError || projectsIsError || RolesIsError || MembersIsError) {
    return <div>Error fetching data!</div>;
  }

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
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateOrganization}>
                {organization._id
                  ? updateOrganizationMutation.isPending
                    ? "Updating..."
                    : "Update Organization"
                  : addOrganizationMutation.isPending
                  ? "Adding..."
                  : "Add Organization"}
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
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Organizations &&
                    Organizations.organizations.map((project: Organization) => (
                      <TableRow key={project._id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell>{project.admin?.fullname}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(project)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit project</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              deleteOrganizationMutation.mutate(
                                project._id as string
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete project</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage organization projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Select
                      value={newProject.organization}
                      onValueChange={(value) =>
                        setNewProject({ ...newProject, organization: value })
                      }
                    >
                      <SelectTrigger id="organization">
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {Organizations.organizations.map(
                          (organization: Organization) => (
                            <SelectItem
                              key={organization._id}
                              value={organization._id}
                            >
                              {organization.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                <Button onClick={handleUpdateProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
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
                            <TableCell>{project.organization.name}</TableCell>
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
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProject(project)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit project</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) =>
                                  deleteProjectMutation.mutate(project)
                                }
                                className="ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
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
              <CardTitle>Assign Members to Organization</CardTitle>
              <CardDescription>Manage organization members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="organizationId">Organization</Label>
                    <Select
                      value={newMember.organizationId}
                      onValueChange={(value) =>
                        setNewMember({ ...newMember, organizationId: value })
                      }
                    >
                      <SelectTrigger id="organizationId">
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {Organizations.organizations.map(
                          (organization: Organization) => (
                            <SelectItem
                              key={organization._id}
                              value={organization._id}
                            >
                              {organization.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                          <SelectItem key={member._id} value={member._id}>
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
                        {Roles.map((role: Role) => (
                          <SelectItem key={role._id} value={role._id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUpdateMember}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {Members.users.map((member: Memberss, index: number) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={member.fullname}
                        />
                        <AvatarFallback>
                          {member.fullname
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.fullname}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <Badge variant="outline">{member}</Badge> */}
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
