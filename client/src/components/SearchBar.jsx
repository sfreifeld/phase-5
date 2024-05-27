import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"
import { Dropdown } from 'react-bootstrap';
import { useSession } from './SessionContext'

function SearchBar({ setSortType, setSearchQuery, setFilterType }) {
  const { userType } = useSession();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(inputValue);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSearchClick = () => {
    setSearchQuery(inputValue);
  }

  useEffect(() => {
    if (userType === 'dev') {
      setFilterType('open');
    }
  }, [userType]);

  return (
    <div className="search container-fluid border-bottom">
      <div className="row height d-flex justify-content-start align-items-center">
        <div className="col-md-6">
          <div className="form d-flex flex-row">
            <input
              type="text"
              className="form-control form-input"
              placeholder="Search by keyword"
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              value={inputValue}
            />
            <Button onClick={handleSearchClick} className="me-3 rounded negative-margin">Search</Button>

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
                <Dropdown.Item onClick={() => setFilterType('open')}>Open</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType('inProgress')}>In Progress</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType('closed')}>Closed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

