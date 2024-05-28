import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


//way to make session, user, and userType global variables
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState('');
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // Added loading state

    const updateSession = (newSessionData) => {
      setSession(prevSession => ({ ...prevSession, ...newSessionData }));
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          if (session) {
            supabase
            .from('profiles')
            .select('*')
            .eq('uuid', session.user.id)
            .then(({ data, error }) => {
              if (error) {
                console.error('Error fetching profile:', error);
              } else {
                setProfile(data);
                checkRegistration(data[0].id); // Also corrected to use data.id directly
              }
            });
          }
        });
    
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (session) {
            supabase
            .from('profiles')
            .select('*')
            .eq('uuid', session.user.id)
            .then(({ data, error }) => {
              if (error) {
                console.error('Error fetching profile:', error);
              } else {
                setProfile(data);
                checkRegistration(data[0].id); // Also corrected to use data.id directly
              }
            });
          }
        });
    
        return () => subscription.unsubscribe();
      }, []); // Ensures the useEffect hook is properly closed

      const checkRegistration = (userId) => {
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

        
        
            Promise.all([userQuery, organizationQuery]).then(results => {
            const [userResult, organizationResult] = results;
            
            if (userResult.data) {
                setUser(userResult.data); // Set user to the user record
                setUserType('dev');
            } else if (organizationResult.data) {
                setUser(organizationResult.data); // Set user to the organization record
                setUserType('org');
            } else {
                setUser(null); // No user or organization found
                setUserType('');
            }
            setIsLoading(false);  // Set loading to false after determining user type
        });
    }

    return (
        <SessionContext.Provider value={{ session, user, userType, isLoading, updateSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

