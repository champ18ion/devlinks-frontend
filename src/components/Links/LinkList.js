import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

const LinkListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const LinkListTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const LinkListUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const LinkListItem = styled.li`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LinkTitle = styled.h3`
  font-size: 18px;
  color: #007bff;
  margin-bottom: 10px;
`;

const LinkDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const LinkButton = styled.a`
  display: inline-block;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const LinkList = () => {
  const [links, setLinks] = useState([]);
  const { token } = useContext(AuthContext); // Get the token from context

  useEffect(() => {
    const fetchLinks = async () => {
      if (!token) return; // Exit if token is not available

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/links`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching links:', error);
        // Handle error (e.g., show a message to the user)
      }
    };

    fetchLinks(); // Fetch links when the component mounts or when the token changes
  }, [token]); // Re-run effect if token changes

  return (
    <LinkListContainer>
      <LinkListTitle>Your Links</LinkListTitle>
      <LinkListUl>
        {links.map(link => (
          <LinkListItem key={link.id}>
            <LinkTitle>{link.title}</LinkTitle>
            <p>{link.description}</p>
            <LinkButton href={link.url} target="_blank" rel="noopener noreferrer">Visit</LinkButton>
          </LinkListItem>
        ))}
      </LinkListUl>
    </LinkListContainer>
  );
};
  
export default LinkList;