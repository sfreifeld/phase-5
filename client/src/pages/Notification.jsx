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
                        })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Sorting here
                    }
                });
        }
    }, [user]);

    const handleReadChange = async (messageId, currentIndex) => {
        const newMessageList = [...messageList];
        newMessageList[currentIndex].read = true;
        setMessageList(newMessageList);

        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', messageId);

        if (error) {
            console.error('Error updating message:', error);
        }
    };

    return (
        <div className='vw-100 background'>
            <NavBarMain className="fixed-top"/>
            <div className='custom-card m-5'>
                {messageList.length == 0 ? (
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="col-1">Date</th>
                            <th className="col-1">Read</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="3">You don't have any notifications yet.</td>
                        </tr>
                    </tbody>
                </Table>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="col-1">Date</th>
                                <th className="col-1">Read</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messageList.map((message, index) => (
                                <tr key={index}>
                                    <td>{message.created_at}</td>
                                    <td className='text-center'>
                                        <input type="checkbox" checked={message.read} onChange={() => handleReadChange(message.id, index)} disabled={message.read} />
                                    </td>
                                    <td style={{ fontWeight: message.read ? 'normal' : 'bold' }}>{message.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
      );
    }

export default Notification;
