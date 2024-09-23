import React, { useEffect, useState, useContext, useCallback } from 'react';
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

const UpvoteCount = styled.span`
  font-size: 16px;
  margin-left: 10px;
  color: #666;
`;

// Memoized LinkListItem to prevent unnecessary re-renders
const LinkListItem = ({ link, onUpvote, onDownvote }) => {
  const { id, title, description, url, upvotes, userUpvoted } = link;
  
  return (
    <LinkListItemContainer key={id}>
      <LinkTitle>{title}</LinkTitle>
      <p>{description}</p>
      <LinkButton href={url} target="_blank" rel="noopener noreferrer">
        Visit
      </LinkButton>
      {userUpvoted ? (
        <VoteButton $upvoted onClick={() => onDownvote(id)}>
          Downvote
        </VoteButton>
      ) : (
        <VoteButton onClick={() => onUpvote(id)}>
          Upvote
        </VoteButton>
      )}
      <UpvoteCount>{upvotes} Upvotes</UpvoteCount> {/* Display upvote count */}
    </LinkListItemContainer>
  );
};

const PublicFeed = () => {
  const [links, setLinks] = useState([]);
  const { token } = useContext(AuthContext);
  const [filter, setFilter] = useState('latest');

  // Fetch all public links with upvote counts
  useEffect(() => {
    const fetchPublicLinks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/links/public?filter=${filter}`);
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching public links:', error);
      }
    };

    fetchPublicLinks(); // Fetch links when the component mounts
  }, [token, filter]);

  // Optimistically handle upvoting
  const upvoteLink = useCallback(async (linkId) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId
          ? { ...link, upvotes: link.upvotes + 1, userUpvoted: true }
          : link
      )
    );

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/links/${linkId}/upvote`);
    } catch (error) {
      console.error('Error upvoting link:', error);
      // Revert if the request fails
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === linkId
            ? { ...link, upvotes: link.upvotes - 1, userUpvoted: false }
            : link
        )
      );
    }
  }, []);

  // Optimistically handle downvoting
  const downvoteLink = useCallback(async (linkId) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId
          ? { ...link, upvotes: link.upvotes - 1, userUpvoted: false }
          : link
      )
    );

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/links/${linkId}/downvote`);
    } catch (error) {
      console.error('Error downvoting link:', error);
      // Revert if the request fails
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === linkId
            ? { ...link, upvotes: link.upvotes + 1, userUpvoted: true }
            : link
        )
      );
    }
  }, []);

  const filters = ['latest', 'popular', 'trending'];

  return (
    <>
    {filters.map(filterType => (
      <button key={filterType} onClick={() => setFilter(filterType)}>{filterType}</button>
    ))}  
    <LinkListContainer>
      <LinkListTitle>Public Links</LinkListTitle>
      <LinkListUl>
        {links.map(link => (
          <LinkListItem
            key={link.id}
            link={link}
            onUpvote={upvoteLink}
            onDownvote={downvoteLink}
          />
        ))}
      </LinkListUl>
    </LinkListContainer>
    </>
  );
};

export default PublicFeed;
