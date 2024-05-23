import { useParams } from 'react-router-dom'
import { useSession } from '../components/SessionContext';
import { supabase } from "../supabaseClient"
import React, { useState, useEffect } from 'react';
import NavBarMain from '../components/NavBar';
import Table from 'react-bootstrap/Table';



//WIP
function Notification() {
    const {session, user, userType} = useSession();
    const { id } = useParams()
    const [ messageList, setMessageList ] = useState([])


    useEffect(() => {
        if (user) {
            supabase
                .from('messages')
                .select('*')
                .eq('recipient_id', user.id)
                .then(({ data: messageData, error: messageError }) => {
                    if (messageError) {
                        console.error('Error fetching messages:', messageError);
                        return;
                    }
                    else {
                        setMessageList(messageData.map(message => ({
                            ...message,
                            created_at: new Date(message.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })
                        })));
                    }
                });
        }
    }, [user]);








    return (
        <div className='vw-100 background'>
            <NavBarMain className="fixed-top"/>
            <div className='custom-card m-5'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th className="col-1">Date</th>
                    <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {messageList.map((message, index) => (
                        <tr key={index}>
                            <td>{message.created_at}</td>
                            <td>{message.message}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </div>
      );
    }

export default Notification;

