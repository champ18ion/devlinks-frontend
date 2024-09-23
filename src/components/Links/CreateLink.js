import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
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
  const [formData, setFormData] = useState({ title: '', url: '', description: '', category: '', isPublic: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Post the link data to the server
      await axios.post(`${process.env.REACT_APP_API_URL}/links`, formData);
  
      // Clear the form data after successful submission
      setFormData({ title: '', url: '', description: '', category: '' });
  
      // Show a success toast notification
      toast.success('Link created successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Redirect to the links page
      navigate('/links');
  
    } catch (error) {
      console.error('Error creating link:', error);
  
      // Show an error toast notification
      toast.error('Failed to create link. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <StyledInput type="url" name="url" placeholder="URL" onChange={handleChange} required />
      <StyledTextArea name="description" placeholder="Description" onChange={handleChange} required />
      <StyledInput type="text" name="category" placeholder="Category" onChange={handleChange} required />
      <div>
      <input type="checkbox" name="isPublic" onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} /> Public Link
      </div>
      <StyledButton type="submit">Create Link</StyledButton>
      <ToastContainer />
    </StyledForm>
  );
};

export default CreateLink;