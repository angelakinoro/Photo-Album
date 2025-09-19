// src/pages/Users.tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-3 border rounded-md">
            <p><strong>{user.name}</strong> ({user.username})</p>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;