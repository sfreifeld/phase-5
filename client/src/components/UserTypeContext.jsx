import { createContext, useContext, useState } from 'react';

const UserTypeContext = createContext(null);

export const UserTypeProvider = ({ children }) => {
    const [userType, setUserType] = useState('');

    return (
        <UserTypeContext.Provider value={{ userType, setUserType }}>
            {children}
        </UserTypeContext.Provider>
    );
};

export const useUserType = () => useContext(UserTypeContext);