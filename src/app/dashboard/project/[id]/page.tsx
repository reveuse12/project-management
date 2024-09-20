"use client";

import { useState } from "react";
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
  Clipboard,
  Users,
  ListTodo,
  Plus,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";
// import { format } from "date-fns";

export default function ProjectManagementPage() {
  const [project, setProject] = useState({
    _id: "1",
    title: "Project Alpha",
    description: "A groundbreaking software development project",
    organization: { _id: "1", name: "Acme Inc." },
    members: [
      {
        _id: "1",
        user: { _id: "1", fullname: "John Doe", email: "john@example.com" },
        role: { _id: "1", name: "Project Manager" },
      },
      {
        _id: "2",
        user: { _id: "2", fullname: "Jane Smith", email: "jane@example.com" },
        role: { _id: "2", name: "Developer" },
      },
    ],
    tasks: [
      {
        _id: "1",
        title: "Design UI",
        description: "Create user interface mockups",
        status: "in progress",
        priority: "high",
        dueDate: new Date(2023, 11, 31),
        assignedTo: { _id: "2", fullname: "Jane Smith" },
      },
      {
        _id: "2",
        title: "Implement API",
        description: "Develop backend API endpoints",
        status: "not started",
        priority: "medium",
        dueDate: new Date(2024, 0, 15),
        assignedTo: { _id: "1", fullname: "John Doe" },
      },
    ],
    status: "in progress",
    startDate: new Date(2023, 9, 1),
    endDate: new Date(2024, 2, 31),
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "not started",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });
  const [newMember, setNewMember] = useState({ userId: "", roleId: "" });

  // const handleAddTask = () => {
  //   if (
  //     newTask.title &&
  //     newTask.description &&
  //     newTask.dueDate &&
  //     newTask.assignedTo
  //   ) {
  //     setProject({
  //       ...project,
  //       tasks: [
  //         ...project.tasks,
  //         {
  //           _id: Date.now().toString(),
  //           ...newTask,
  //           dueDate: new Date(newTask.dueDate),
  //         },
  //       ],
  //     });
  //     setNewTask({
  //       title: "",
  //       description: "",
  //       status: "not started",
  //       priority: "medium",
  //       dueDate: "",
  //       assignedTo: "",
  //     });
  //   }
  // };

  const handleAddMember = () => {
    if (newMember.userId && newMember.roleId) {
      const user = {
        _id: newMember.userId,
        fullname: "New User",
        email: "newuser@example.com",
      };
      const role = { _id: newMember.roleId, name: "New Role" };
      setProject({
        ...project,
        members: [
          ...project.members,
          { _id: Date.now().toString(), user, role },
        ],
      });
      setNewMember({ userId: "", roleId: "" });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setProject({
      ...project,
      members: project.members.filter((m) => m._id !== memberId),
    });
  };

  const handleUpdateProject = () => {
    // In a real app, this would make an API call to update the project
    console.log("Project updated:", project);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Clipboard className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Manage your project's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  value={project.title}
                  onChange={(e) =>
                    setProject({ ...project, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={project.description}
                  onChange={(e) =>
                    setProject({ ...project, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectStatus">Status</Label>
                  <Select
                    value={project.status}
                    onValueChange={(value) =>
                      setProject({ ...project, status: value })
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
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={project.organization.name}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    // value={format(project.startDate, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        startDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    // value={format(project.endDate, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        endDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProject}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="taskDescription">Description</Label>
                    <Input
                      id="taskDescription"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskStatus">Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, status: value })
                      }
                    >
                      <SelectTrigger id="taskStatus">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not started">Not Started</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskPriority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger id="taskPriority">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskDueDate">Due Date</Label>
                    <Input
                      id="taskDueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskAssignee">Assignee</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, assignedTo: value })
                      }
                    >
                      <SelectTrigger id="taskAssignee">
                        <SelectValue placeholder="Assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {project.members.map((member) => (
                          <SelectItem key={member._id} value={member.user._id}>
                            {member.user.fullname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => console.log("add task")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {/* {format(task.dueDate, "MMM d, yyyy")} */}
                          DAte
                        </TableCell>
                        <TableCell>{task.assignedTo.fullname}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit task</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage project team members</CardDescription>
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
                        <SelectItem value="3">New User</SelectItem>
                        {/* In a real app, this would be populated with actual users */}
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
                        <SelectItem value="1">Project Manager</SelectItem>
                        <SelectItem value="2">Developer</SelectItem>
                        <SelectItem value="3">Designer</SelectItem>
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
                {project.members.map((member) => (
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
    </div>
  );
}
