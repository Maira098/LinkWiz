/**
 * Example: How to use API services in your components
 * 
 * This file demonstrates common patterns for API integration
 */

import { useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import skillService from '../services/skillService';

export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response);
      // Redirect to dashboard or store user data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export function UserListExample() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsers(response.users || response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export function SkillManagementExample() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await skillService.getAllSkills();
      setSkills(response.skills || response);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const newSkill = await skillService.createSkill({
        name: newSkillName,
        category: 'General',
      });
      setSkills([...skills, newSkill.skill || newSkill]);
      setNewSkillName('');
    } catch (err) {
      console.error('Failed to create skill:', err);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      setSkills(skills.filter((skill) => skill._id !== skillId));
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div>
      <h2>Skills Management</h2>
      <form onSubmit={handleAddSkill}>
        <input
          type="text"
          placeholder="New skill name"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Add Skill
        </button>
      </form>

      <h3>Available Skills</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill._id}>
              {skill.name}
              <button onClick={() => handleDeleteSkill(skill._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
