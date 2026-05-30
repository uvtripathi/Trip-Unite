import React, { createContext, useRef ,useState } from 'react';

// Create a UserContext to share the user ID across the application
export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  // Store user ID using useRef
  const userIdRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
 

  return (
    <UserContext.Provider value={{userIdRef,userId,setUserId,currentTrip,setCurrentTrip}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

