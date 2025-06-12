import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, ArrowLeft, Pencil, Trash2, Info } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-white flex items-center gap-1 hover:text-orange-400 transition"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src="/logo.png" alt="Part Group Logo" className="h-6 w-auto" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-4">User Management</h1>

      {/* Add User Button */}
      <div className="flex justify-center mb-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Input placeholder="Search users..." className="pr-10" />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-zinc-800">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Active</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-zinc-800 transition">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role?.name || "-"}</td>
                <td className="p-2 border">{user.is_active ? "Active" : "Inactive"}</td>
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <Button size="icon" variant="ghost"><Info className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
