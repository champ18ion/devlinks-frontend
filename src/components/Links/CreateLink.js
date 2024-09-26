import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for floating background elements
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const neonGlow = keyframes`
  0% {
    text-shadow: 0 0 10px #00e6e6, 0 0 20px #00e6e6, 0 0 30px #00e6e6, 0 0 40px #00e6e6, 0 0 50px #00e6e6;
  }
  100% {
    text-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff, 0 0 60px #00ffff;
  }
`;

const PageWrapper = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #000;
  overflow: hidden;
`;

// Animated particles floating in the background
const FloatingParticle = styled.div`
  position: absolute;
  top: ${(props) => props.top || '50%'};
  left: ${(props) => props.left || '50%'};
  width: ${(props) => props.size || '30px'};
  height: ${(props) => props.size || '30px'};
  background-color: ${(props) => props.color || '#00e6e6'};
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  opacity: 0.6;
  z-index: 1;
  filter: blur(5px);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 50vw;
  padding: 40px;
  // background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: 1.5s ease-in-out infinite alternate ${float};
  // box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  z-index: 10;

  &:hover {
    transform: rotateY(10deg) rotateX(5deg);
    transition: all 0.3s ease-in-out;
  }
`;

const StyledInput = styled.input`
  margin-bottom: 20px;
  padding: 15px;
  background-color: transparent;
  border: 2px solid rgba(0, 255, 255, 0.6);
  border-radius: 10px;
  font-size: 18px;
  color: #00e6e6;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  outline: none;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    animation: ${neonGlow} 1.5s ease-in-out infinite;
  }
`;

const StyledTextArea = styled.textarea`
  margin-bottom: 20px;
  padding: 15px;
  background-color: transparent;
  border: 2px solid rgba(0, 255, 255, 0.6);
  border-radius: 10px;
  font-size: 18px;
  color: #00e6e6;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  outline: none;
  transition: all 0.3s ease;
  resize: vertical;
  z-index: 10;

  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    animation: ${neonGlow} 1.5s ease-in-out infinite;
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;

  .switch {
    position: relative;
    width: 60px;
    height: 30px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: 0.4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #00ffcc;
  }

  input:checked + .slider:before {
    transform: translateX(30px);
  }
`;

const StyledButton = styled.button`
  padding: 15px;
  background-color: #00e6e6;
  color: black;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00ffff;
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
  }

  &:active {
    transform: scale(0.98);
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
    <PageWrapper>
      <FloatingParticle top="20%" left="30%" size="40px" color="#ff007f" />
      <FloatingParticle top="80%" left="70%" size="50px" color="#00ff6f" />
      <FloatingParticle top="50%" left="90%" size="30px" color="#ff9900" />
      
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <StyledInput type="url" name="url" placeholder="URL" onChange={handleChange} required />
        <StyledTextArea name="description" placeholder="Description" onChange={handleChange} required />
        <StyledInput type="text" name="category" placeholder="Category" onChange={handleChange} required />
        <ToggleSwitch>
        <label className="switch">
            <input
              type="checkbox"
              name="isPublic"
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
          <span style={{ color: '#fff' }}>Public Link</span>
        </ToggleSwitch>
        <StyledButton type="submit">Create Link</StyledButton>
        <ToastContainer />
      </StyledForm>
    </PageWrapper>
  );
};

export default CreateLink;
