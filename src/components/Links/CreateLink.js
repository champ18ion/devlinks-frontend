import React, { useState } from 'react';
import axios from 'axios';
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

const StyledTextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
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

const CreateLink = () => {
  const [formData, setFormData] = useState({ title: '', url: '', description: '', category: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/links`, formData);
    // Optionally, handle success (e.g., redirect or show a message)
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <StyledInput type="url" name="url" placeholder="URL" onChange={handleChange} required />
      <StyledTextArea name="description" placeholder="Description" onChange={handleChange} required />
      <StyledInput type="text" name="category" placeholder="Category" onChange={handleChange} required />
      <StyledButton type="submit">Create Link</StyledButton>
    </StyledForm>
  );
};

export default CreateLink;