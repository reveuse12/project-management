"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
} from "recharts";
import {
  Building2,
  Users,
  Briefcase,
  // TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  useOrganizationStore,
  useProjectStore,
  useRoleStore,
  useUsersStore,
} from "../store/store";
import { getOgranizations } from "../actions/organization/organization";
import { getProjects } from "../actions/project/project";
import { getUser } from "../actions/user/user";
import Loading from "./loading";
import { getRoles } from "../actions/roles/roles";
import { Memberss, Project } from "../helpers/types";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboardPage() {
  const { organizations, setOrganizations } = useOrganizationStore();
  const { projects, setProjects } = useProjectStore();
  const { users, setUsers } = useUsersStore();
  const { roles, setRoles } = useRoleStore();
  const {
    data: Organizations,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const data = await getOgranizations();
      setOrganizations(data);
      return data;
    },
  });
  const {
    data: Projectss = [],
    isFetching: ProjectsIsFetching,
    isError: projectsIsError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await getProjects();
      setProjects(data);
      return data;
    },
  });

  const {
    data: Members = [],
    isFetching: MembersIsFetching,
    isError: MembersIsError,
  } = useQuery<Memberss[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const users = await getUser();
      setUsers(users); // Handle success logic here
      return users.map((user: Memberss) => ({
        _id: user._id,
        username: user.username, // Assuming `name` from User is the same as `username` in Memberss
        fullname: user.fullname, // Assuming `name` from User is used as `fullname` in Memberss
        email: user.email,
      }));
    },
  });

  const {
    data: Roles,
    isFetching: RolesIsFetching,
    isError: RolesIsError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const data = await getRoles();
      setRoles(data); // Handle success logic here
      return data; // Handle success logic here
    },
  });

  const [stats, setStats] = useState({
    organizations: { total: 0, change: 5 },
    projects: { total: 0, change: -3 },
    users: { total: 0, change: 50 },
    roles: { total: 0, change: 0 },
  });

  useEffect(() => {
    setStats({
      organizations: { total: Organizations?.length, change: 5 },
      projects: { total: Projectss?.length, change: -3 },
      users: { total: Members?.length, change: 50 },
      roles: { total: Roles?.length, change: 0 },
    });
  }, [organizations, projects, Members, roles, users]);

  // const [projectStatus, setProjectStatus] = useState([
  //   { name: "Not Started", value: 10 },
  //   { name: "In Progress", value: 25 },
  //   { name: "Completed", value: 15 },
  // ]);

  const [monthlyTasks] = useState([
    { name: "Jan", tasks: 65 },
    { name: "Feb", tasks: 59 },
    { name: "Mar", tasks: 80 },
    { name: "Apr", tasks: 81 },
    { name: "May", tasks: 56 },
    { name: "Jun", tasks: 55 },
  ]);

  // const [recentProjects, setRecentProjects] = useState([
  //   {
  //     id: "1",
  //     title: "Website Redesign",
  //     organization: "Acme Inc.",
  //     progress: 75,
  //   },
  //   {
  //     id: "2",
  //     title: "Mobile App Development",
  //     organization: "Tech Corp",
  //     progress: 30,
  //   },
  //   {
  //     id: "3",
  //     title: "Database Migration",
  //     organization: "Innovate LLC",
  //     progress: 100,
  //   },
  //   {
  //     id: "4",
  //     title: "AI Integration",
  //     organization: "Future Systems",
  //     progress: 10,
  //   },
  // ]);

  // const [topUsers, setTopUsers] = useState([
  //   { id: "1", fullname: "John Doe", email: "john@example.com", tasks: 23 },
  //   { id: "2", fullname: "Jane Smith", email: "jane@example.com", tasks: 19 },
  //   { id: "3", fullname: "Bob Johnson", email: "bob@example.com", tasks: 17 },
  //   { id: "4", fullname: "Alice Brown", email: "alice@example.com", tasks: 15 },
  // ]);

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
    <ScrollArea>
      <div className="container min-h-screen mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {users &&
            [
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
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
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
          {/* <Card className="col-span-3">
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
          </Card> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Projectss.map((project) => (
                  <div key={project._id} className="flex items-center">
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
                        {project.organization.name}
                      </p>
                    </div>
                    {/* <div className="ml-auto font-medium">
                      {project.progress === 100 ? (
                        <Badge>Completed</Badge>
                      ) : (
                        <span className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                          {project.progress}%
                        </span>
                      )}
                    </div> */}
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
                {users.map((user) => (
                  <div key={user._id} className="flex items-center">
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
                    {/* <div className="ml-auto font-medium">
                      {user.tasks} tasks
                    </div> */}
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
