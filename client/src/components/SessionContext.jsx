import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null)
    const [userType, setUserType] = useState('')

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
                checkRegistration(session.user.id)
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);



    function checkRegistration(userId) {
        // Query both users and organizations tables
        const userQuery = supabase
          .from('users')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle();
    
        const organizationQuery = supabase
          .from('organizations')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle();
    
          if (userExists) {
            setUser(userResult.data); // Set user to the user record
            setUserType('dev');
          } else if (organizationExists) {
            setUser(organizationResult.data); // Set user to the organization record
            setUserType('org');
          } else {
            setUser(null); // No user or organization found
          }
      };












    return (
        <SessionContext.Provider value={{session, user, userType}}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
