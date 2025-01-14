import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import axios from "axios";
const ProductList = () => {
    const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:8081/api/auth/users", {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")  // Or wherever you store the JWT
            }
          });
          setUsers(response.data);
        } catch (err) {
          setError("An error occurred while fetching users");
        }
      };
      
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default ProductList;
