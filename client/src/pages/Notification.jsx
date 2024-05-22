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





    return (
        <div className='vw-100 background'>
            <NavBarMain className="fixed-top"/>
            <div className='custom-card m-5'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
            </div>
        </div>
      );
    }

export default Notification;

