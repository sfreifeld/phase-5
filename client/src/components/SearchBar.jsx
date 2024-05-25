import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"
import { Dropdown } from 'react-bootstrap';

//currently has no functionality
function SearchBar({ setSortType } ) {

  return (
    <div className="search container-fluid border-bottom">
      <div className="row height d-flex justify-content-start align-items-center">
        <div className="col-md-6">
          <div className="form d-flex flex-row">
            <input type="text" className="form-control form-input me-3" placeholder="Search by keyword"/>

            <Dropdown className='me-3'>
              <Dropdown.Toggle> Sort By </Dropdown.Toggle>
              <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortType('Posted Date')}>Posted Date</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortType('Project Length')}>Project Length</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='me-3'>
              <Dropdown.Toggle> Filter By </Dropdown.Toggle>
              <Dropdown.Menu>
                  <Dropdown.Item>
                    <input 
                      type="checkbox" 
                    /> Open
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <input 
                      type="checkbox" 
                    /> Closed
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <input 
                      type="checkbox" 
                    /> In Progress
                  </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

