import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (user) {
      // If user is logged in, redirect away from signin and signup pages
      const restrictedPaths = ['/signin', '/signup'];
      if (restrictedPaths.includes(window.location.pathname)) {
        navigate('/');
      }
    } else {
      // If user is not logged in, redirect to signin page for protected routes
    //   const protectedPaths = ['/create-link', '/links'];
    //   if (protectedPaths.includes(window.location.pathname)) {
    //     navigate('/signin');
    //   }
    //   if(window.location.pathname === '/'){
    //     navigate('/signin');
    //   }
    navigate('/signin');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <StyledNav>
      <StyledUl>
        <StyledNavItem><StyledLink to="/">Home</StyledLink></StyledNavItem>
        {user ? (
          <>
            <StyledNavItem><StyledLink to="/create-link">Create Link</StyledLink></StyledNavItem>
            <StyledNavItem><StyledLink to="/links">My Links</StyledLink></StyledNavItem>
            <StyledNavItem><StyledButton onClick={handleLogout}>Logout</StyledButton></StyledNavItem>
          </>
        ) : (
          <>
            <StyledNavItem><StyledLink to="/signin">Sign In</StyledLink></StyledNavItem>
            <StyledNavItem><StyledLink to="/signup">Sign Up</StyledLink></StyledNavItem>
          </>
        )}
      </StyledUl>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  background-color: #333;
  padding: 1rem;
`;

const StyledUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
`;

const StyledNavItem = styled.li`
  margin: 0 10px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    color: #ddd;
  }
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    color: #ddd;
  }
`;


export default Navbar;