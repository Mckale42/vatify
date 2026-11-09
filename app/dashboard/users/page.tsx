import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const allUsers = [
  { username: "AJ", role: "admin", status: "active" },
  { username: "Eddie", role: "admin", status: "active" },
  { username: "Boks", role: "admin", status: "active" },
  { username: "Warren", role: "admin", status: "active" },
  { username: "Demo", role: "user", status: "active" },
]

export default async function UsersPage() {
  const user = await getUser()

  if (user?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.username}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
