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

const UpvoteCount = styled.span`
  font-size: 16px;
  margin-left: 10px;
  color: #fff;
  animation: ${props => (props.$animate ? css`${popUp} 0.3s ease` : 'none')}; /* Pop-up animation */
`;

// Styled components (same as before)
const LinkListContainer = styled.div`
  max-width: 90vw;
  margin: 0 auto;
  margin-top:10vh;
  padding: 20px;
`;

const LinkListTitle = styled.h2`
  position: fixed;
  font-size: 6rem;
  color: rgba(255, 255, 255, 0.2);
  font-family: 'Raleway', sans-serif;
  letter-spacing: 10px;
  margin-top: 40px;
  text-transform: uppercase;
  font-weight: bold;
  overflow: hidden;
  margin-left: 20px;

  &:before {
    content: "YOUR TEXT HERE ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: rgba(0, 0, 0, 0.05);
    font-size: 10rem;
    letter-spacing: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: -1;
    opacity: 0.1;
    transform: rotate(-45deg);
  }
    
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  padding: 12px 20px;
  width: 95%;
  background-color: rgba(255, 255, 255, 0.05); /* Transparent with glass effect */
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: #333; /* Elegant dark color for text */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px); /* Subtle blur for elegance */
  
  /* Text placeholder styling */
  &::placeholder {
    color: rgba(251, 251, 251, 0.4); /* Light gray for placeholders */
  }

  /* Smooth hover and focus states */
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;


const FilterSelect = styled.select`
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  color: #333;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-image: linear-gradient(135deg, transparent 50%, #ccc 50%);
  background-position: calc(100% - 20px) center;
  background-size: 10px 10px;
  background-repeat: no-repeat;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  /* Minimalist dropdown options */
  option {
    color: #333;
    background-color: #fff;
    padding: 10px;
    font-size: 14px;
    font-weight: normal;
  }
`;


const LinkListUl = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2em;
`;



// Parallax title effect on hover
const TitleParallax = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
`;

const LinkListItemContainer = styled.li`
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  padding-bottom: 60px; /* Padding to ensure space for the full-width button */
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  overflow: hidden;
  transform-style: preserve-3d;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  /* Background parallax text for the link title */
  &:before {
    content: '${props => props.title}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.5);
    font-size: 100px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.05);
    white-space: nowrap;
    z-index: 0;
    transition: transform 0.5s ease;
  }

  &:hover:before {
    transform: translate(-50%, -50%) scale(0.8);
    color: rgba(255, 255, 255, 0.5);
  }

   &.flipped {
    transform: rotateY(180deg); /* 3D flip effect */
  }
`;

const getCategoryColor = (category) => {
  switch (category) {
    case 'frontend':
      return '#007bff'; // Blue for frontend
    case 'backend':
      return '#28a745'; // Green for backend
    case 'ai':
      return '#ffc107'; // Yellow for AI
    case 'database':
      return '#17a2b8'; // Cyan for Database
    default:
      return '#6c757d'; // Default gray for unknown categories
  }
};


const CategoryBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => getCategoryColor(props.category)};
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  z-index: 10;
  transition: transform 0.3s ease, background-color 0.3s ease;

  /* Hover effect to make the badge pop */
  ${LinkListItemContainer}:hover & {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const LinkTitle = styled.h3`
  font-size: 18px;
  color: #007bff;
  margin-bottom: 10px;
  position: relative;
  z-index: 1; /* Ensure it's above the parallax title */
  transition: color 0.3s ease;

  /* On hover, the title color shifts for emphasis */
  ${LinkListItemContainer}:hover & {
    color: #0056b3;
  }
`;
const LinkDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8); /* Softer, more elegant color */
  margin-bottom: 15px;
  line-height: 1.6;
  position: relative;
  z-index: 1; /* Above parallax background */
  transition: color 0.3s ease, transform 0.3s ease; /* Smooth transition for hover and flipping */
  
  /* Change color on hover for subtle interactivity */
  &:hover {
    color: rgba(255, 255, 255, 1);
  }

  /* Mirroring the text horizontally */
  transform: scaleX(-1); /* Inverts the text horizontally */
  text-align: center;
`;


const LinkIconButton = styled.a`
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: #00f2ff;
  color: white;
  padding: 12px;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 5px 20px rgba(0, 242, 255, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #00d4ff;
    transform: translateY(-4px);
  }

  i {
    font-size: 1.5rem;
  }
`;



const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  position: relative;
  z-index: 1;
  padding-bottom: 60px; /* Space for the button */
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px; /* Position the toggle button on the left */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 3;
  display: none; /* Hidden by default */

  /* Only show button on hover */
  ${LinkListItemContainer}:hover & {
    display: block;
  }

  &:hover {
    background-color: #0056b3;
    transform: scale(1.2);
  }

  i {
    font-size: 1.2rem;
  }
`;


const VoteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.$upvoted ? '#ff4500' : '#888')};
  transition: color 0.3s ease, transform 0.3s ease;

  /* On hover, the vote button grows and changes color */
  &:hover {
    color: #ff4500; /* Change color on hover */
    transform: scale(1.3); /* Enlarge icon */
  }

  /* Icon animation */
  i {
    transition: transform 0.2s ease;
    transform: ${props => (props.$upvoted ? 'scale(1.2)' : 'scale(1)')}; /* Scale up if upvoted */
  }
`;
// LinkListItem component with memoization to prevent unnecessary re-renders
const LinkListItem = React.memo(({ link, onUpvote, onDownvote }) => {
  const { id, title, description, url, upvotes, userUpvoted } = link;
  const [flipped, setFlipped] = useState(false)

  console.log(`Rendering LinkListItem with ID: ${id}`);

  return (
    <>
      {!flipped ? (<>
        <LinkListItemContainer key={link.id} title={title} className={flipped ? 'flipped' : ''}>
          <CategoryBadge category={link.category}>{link.category}</CategoryBadge>
          <LinkTitle>{title}</LinkTitle>
          <LinkDescription>{" "}</LinkDescription>
          <VoteContainer>
          <VoteButton $upvoted={userUpvoted} onClick={() => (userUpvoted ? onDownvote(id) : onUpvote(id))}>
            {userUpvoted ? (
              <i className="fas fa-thumbs-up"></i> // Downvote icon
            ) : (
              <i className="far fa-thumbs-up"></i> // Upvote icon
            )}
          </VoteButton>
          <UpvoteCount $animate={userUpvoted}>{upvotes}</UpvoteCount>
          </VoteContainer>
          <LinkIconButton href={url} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-external-link-alt"></i>
          </LinkIconButton>
          <ToggleButton onClick={() => setFlipped(!flipped)}>
            <i className="fas fa-info-circle"></i>
          </ToggleButton>
        </LinkListItemContainer>

      </>) : (<>
        <LinkListItemContainer key={id} title={" "} className={flipped ? 'flipped' : ''}>
          <CategoryBadge category={link.category}>{" "}</CategoryBadge>
          <LinkTitle>{" "}</LinkTitle>
          <LinkDescription>{description}</LinkDescription>
          <VoteContainer>
          <VoteButton $upvoted={userUpvoted} onClick={() => (userUpvoted ? onDownvote(id) : onUpvote(id))}>
            {" "}
          </VoteButton>
          </VoteContainer>
          <LinkIconButton href={url} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-external-link-alt"></i>
          </LinkIconButton>
          <ToggleButton onClick={() => setFlipped(!flipped)}>
            <i className="fas fa-info-circle"></i>
          </ToggleButton>
        </LinkListItemContainer>
      </>)}
      {/* <LinkListItemContainer key={id}>
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
      </LinkListItemContainer> */}
    </>
  );
});

const PublicFeed = () => {
  const [links, setLinks] = useState([]);
  const { token } = useContext(AuthContext);
  const [filter, setFilter] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState(''); // Holds selected filter

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

  // Handle filtered and searched links
  const filteredAndSearchedLinks = links.filter((link) => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || link.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(links.map(link => link.category))];

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
        {/* Search Input */}
        <div>
          <SearchInput
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Dropdown */}
          <FilterSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {/* Map through unique categories */}
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
        </div>
        <LinkListUl>
          {filteredAndSearchedLinks.map(link => (
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
