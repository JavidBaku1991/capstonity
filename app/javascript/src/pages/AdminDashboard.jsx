import React, { useState } from 'react'

const AdminDashboard = () => {
  // TODO: Fetch users and co-admins from API
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'co-admin' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
  ])

  const handleDeleteUser = (userId) => {
    // implement delete user logic
    console.log('Delete user:', userId)
  }

  const handlePromoteToCoAdmin = (userId) => {
    // mplement promote to co-admin logic
    console.log('Promote user to co-admin:', userId)
  }

  const handleDemoteFromCoAdmin = (userId) => {
    // mplement demote from co-admin logic
    console.log('Demote co-admin to user:', userId)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    {user.role === 'user' && (
                      <button
                        onClick={() => handlePromoteToCoAdmin(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Promote to Co-Admin
                      </button>
                    )}
                    {user.role === 'co-admin' && (
                      <button
                        onClick={() => handleDemoteFromCoAdmin(user.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Demote to User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard 