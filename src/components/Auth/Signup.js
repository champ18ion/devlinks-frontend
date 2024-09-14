import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <StyledInput type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <StyledInput type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <StyledButton type="submit">Sign Up</StyledButton>
    </StyledForm>
  );
};

export default Signup;