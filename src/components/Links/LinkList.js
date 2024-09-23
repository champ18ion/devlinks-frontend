import React, { useEffect, useState, useContext, useCallback, memo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

// Styled components (same as before)
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

const LinkListItemContainer = styled.li`
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

const VoteButton = styled.button`
  background-color: ${props => props.$upvoted ? '#28a745' : '#007bff'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: ${props => props.$upvoted ? '#218838' : '#0056b3'};
  }
`;

// Memoized LinkListItem to prevent unnecessary re-renders
const LinkListItem = memo(({ link, upvoted, onUpvote, onDownvote }) => {
  console.log(`Rendering LinkListItem with ID: ${link.id}`);
  
  return (
    <LinkListItemContainer key={link.id}>
      <LinkTitle>{link.title}</LinkTitle>
      <p>{link.description}</p>
      <LinkButton href={link.url} target="_blank" rel="noopener noreferrer">
        Visit
      </LinkButton>
      {upvoted ? (
        <VoteButton $upvoted onClick={() => onDownvote(link.id)}>
          Downvote
        </VoteButton>
      ) : (
        <VoteButton onClick={() => onUpvote(link.id)}>
          Upvote
        </VoteButton>
      )}
    </LinkListItemContainer>
  );
});

const LinkList = () => {
  const [links, setLinks] = useState([]);
  const [upvotedLinks, setUpvotedLinks] = useState([]);
  const { token } = useContext(AuthContext);

  // Fetch all links
  useEffect(() => {
    const fetchLinks = async () => {
      if (!token) return; // Exit if token is not available

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/links`);
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks(); // Fetch links when the component mounts or when the token changes
  }, [token]);

  // Fetch upvoted links once when component mounts
  useEffect(() => {
    const fetchUpvotedLinks = async () => {
      if (!token) return;

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/links/upvote-status`);
        setUpvotedLinks(response.data);
      } catch (error) {
        console.error('Error fetching upvoted links:', error);
      }
    };

    fetchUpvotedLinks();
  }, [token]);

  // Optimistically handle upvoting
  const upvoteLink = useCallback(async (linkId) => {
    // Optimistic UI Update
    setUpvotedLinks((prevUpvotedLinks) => [...prevUpvotedLinks, linkId]);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/links/${linkId}/upvote`);
      console.log('Link upvoted successfully');
    } catch (error) {
      console.error('Error upvoting link:', error);
      // Revert UI update if request fails
      setUpvotedLinks((prevUpvotedLinks) => prevUpvotedLinks.filter(id => id !== linkId));
    }
  }, []);

  // Optimistically handle downvoting
  const downvoteLink = useCallback(async (linkId) => {
    // Optimistic UI Update
    setUpvotedLinks((prevUpvotedLinks) => prevUpvotedLinks.filter(id => id !== linkId));

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/links/${linkId}/downvote`);
      console.log('Link downvoted successfully');
    } catch (error) {
      console.error('Error downvoting link:', error);
      // Revert UI update if request fails
      setUpvotedLinks((prevUpvotedLinks) => [...prevUpvotedLinks, linkId]);
    }
  }, []);

  return (
    <LinkListContainer>
      <LinkListTitle>Your Links</LinkListTitle>
      <LinkListUl>
        {links.map(link => (
          <LinkListItem
            key={link.id}
            link={link}
            upvoted={upvotedLinks.includes(link.id)}
            onUpvote={upvoteLink}
            onDownvote={downvoteLink}
          />
        ))}
      </LinkListUl>
    </LinkListContainer>
  );
};

export default LinkList;
