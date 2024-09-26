"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Building2,
  Users,
  Briefcase,
  CheckSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    organizations: { total: 25, change: 5 },
    projects: { total: 78, change: -3 },
    users: { total: 1250, change: 50 },
    tasks: { total: 456, change: 22 },
  });

  const [projectStatus, setProjectStatus] = useState([
    { name: "Not Started", value: 10 },
    { name: "In Progress", value: 25 },
    { name: "Completed", value: 15 },
  ]);

  const [monthlyTasks, setMonthlyTasks] = useState([
    { name: "Jan", tasks: 65 },
    { name: "Feb", tasks: 59 },
    { name: "Mar", tasks: 80 },
    { name: "Apr", tasks: 81 },
    { name: "May", tasks: 56 },
    { name: "Jun", tasks: 55 },
  ]);

  const [recentProjects, setRecentProjects] = useState([
    {
      id: "1",
      title: "Website Redesign",
      organization: "Acme Inc.",
      progress: 75,
    },
    {
      id: "2",
      title: "Mobile App Development",
      organization: "Tech Corp",
      progress: 30,
    },
    {
      id: "3",
      title: "Database Migration",
      organization: "Innovate LLC",
      progress: 100,
    },
    {
      id: "4",
      title: "AI Integration",
      organization: "Future Systems",
      progress: 10,
    },
  ]);

  const [topUsers, setTopUsers] = useState([
    { id: "1", fullname: "John Doe", email: "john@example.com", tasks: 23 },
    { id: "2", fullname: "Jane Smith", email: "jane@example.com", tasks: 19 },
    { id: "3", fullname: "Bob Johnson", email: "bob@example.com", tasks: 17 },
    { id: "4", fullname: "Alice Brown", email: "alice@example.com", tasks: 15 },
  ]);

  return (
    <ScrollArea>
      <div className="container h-screen mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Organizations",
              value: stats.organizations.total,
              icon: Building2,
              change: stats.organizations.change,
            },
            {
              title: "Projects",
              value: stats.projects.total,
              icon: Briefcase,
              change: stats.projects.change,
            },
            {
              title: "Users",
              value: stats.users.total,
              icon: Users,
              change: stats.users.change,
            },
            {
              title: "Tasks",
              value: stats.tasks.total,
              icon: CheckSquare,
              change: stats.tasks.change,
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {item.value.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.change > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {item.change} increase
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      {Math.abs(item.change)} decrease
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTasks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {projectStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`/placeholder.svg?height=36&width=36`}
                        alt={project.title}
                      />
                      <AvatarFallback>
                        {project.title.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.organization}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {project.progress === 100 ? (
                        <Badge>Completed</Badge>
                      ) : (
                        <span className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                          {project.progress}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topUsers.map((user) => (
                  <div key={user.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`/placeholder.svg?height=36&width=36`}
                        alt={user.fullname}
                      />
                      <AvatarFallback>
                        {user.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.fullname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {user.tasks} tasks
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
