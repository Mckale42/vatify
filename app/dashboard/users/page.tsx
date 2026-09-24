import { redirect } from "next/navigation"
import { getUser, getAllUsersWithRoles } from "@/app/actions/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserCheck } from "lucide-react"

export default async function UsersPage() {
  const user = await getUser()

  // Strict RBAC enforcement: Only admin role allowed
  if (user?.role !== "admin") {
    redirect("/dashboard")
  }

  const usersList = await getAllUsersWithRoles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User & RBAC Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enforcing Role-Based Access Control (Admin, Accountant, Business Owner)
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 text-emerald-700 bg-emerald-50 border-emerald-200">
          <ShieldCheck className="h-4 w-4" />
          <span>RBAC Active</span>
        </Badge>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">System Accounts & Assigned Roles</CardTitle>
          <CardDescription>
            Database-backed role assignments stored in Supabase <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">user_roles</code> table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Identifier / Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersList.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-slate-800 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-slate-400" />
                    <span>{u.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                      className={u.role === "admin" ? "bg-slate-900 text-white" : "bg-blue-50 text-blue-700 border-blue-200"}
                    >
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(u.created_at).toLocaleDateString("en-ZA")}
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
