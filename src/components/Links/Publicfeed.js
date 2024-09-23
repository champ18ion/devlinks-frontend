import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styled, { css, keyframes } from 'styled-components';

// Styled components (same as before)
const popUp = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

const LinkListItemContainer = styled.li`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const VoteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 1.5rem;
  color: ${props => (props.$upvoted ? '#ff4500' : '#888')}; /* Conditional styling */
  transition: color 0.3s ease, transform 0.2s;

  &:hover {
    color: #ff4500; /* Upvoted or downvoted hover color */
    transform: scale(1.2); /* Slight scale-up on hover */
  }

  /* Add different icon colors for downvote and upvote */
  i {
    transition: color 0.3s ease;
  }
`;

const UpvoteCount = styled.span`
  font-size: 16px;
  margin-left: 10px;
  color: #fff;
  animation: ${props => (props.$animate ? css`${popUp} 0.3s ease` : 'none')}; /* Pop-up animation */
`;

const LinkButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05); /* Slight scale-up on hover */
  }
`;

const LinkTitle = styled.h3`
  font-size: 1.2rem;
  color: #007bff;
  font-family: 'Raleway', sans-serif;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
`;

const LinkContent = styled.div`
  flex: 1;
`;

const LinkListContainer = styled.div`
  max-width: 90vw;
  margin: 100px auto;
  padding: 20px;
`;

const LinkListTitle = styled.h2`
  position: fixed;
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.2);
  font-family: 'Raleway', sans-serif;
  letter-spacing: 10px;
  text-transform: uppercase;
  font-weight: bold;
  margin-left: 20px;
`;

const LinkListUl = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2em;
`;

const FilterBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2em;
  gap: 2em;
`;

const FilterButton = styled.button`
  background-color: #546765;
  border: none;
  font-size: 20px;
  color: #f5f5f5;
  padding: 5px 15px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f1d489;
    color: #333;
  }
`;

// LinkListItem component with memoization to prevent unnecessary re-renders
const LinkListItem = React.memo(({ link, onUpvote, onDownvote }) => {
  const { id, title, description, url, upvotes, userUpvoted } = link;

  console.log(`Rendering LinkListItem with ID: ${id}`);

  return (
    <LinkListItemContainer key={id}>
      <VoteContainer>
        <VoteButton $upvoted={userUpvoted} onClick={() => (userUpvoted ? onDownvote(id) : onUpvote(id))}>
          {userUpvoted ? (
            <i className="fas fa-arrow-down"></i> // Downvote icon
          ) : (
            <i className="fas fa-arrow-up"></i> // Upvote icon
          )}
        </VoteButton>
        <UpvoteCount $animate={userUpvoted}>{upvotes}</UpvoteCount>
      </VoteContainer>

      <LinkContent>
        <LinkTitle>{title}</LinkTitle>
        <p>{description}</p>
        <LinkButton href={url} target="_blank" rel="noopener noreferrer">
          Visit
        </LinkButton>
      </LinkContent>
    </LinkListItemContainer>
  );
});

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
  console.log(links)

  return (
    <>
      <FilterBox>
        {filters.map(filterType => (
          <FilterButton key={filterType} onClick={() => setFilter(filterType)}>{filterType}</FilterButton>
        ))}
      </FilterBox>
      <LinkListTitle>Public Links</LinkListTitle>
      <LinkListContainer>
        <LinkListUl>
          {links.map(link => (
            <LinkListItem
              key={link.id} // Correct usage of key here
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
