import React, { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {Container, Table, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';

import Navbar from './Navbar'
import TenantForm from './TenantForm'

import '../styles/Home.css'
import "bootstrap/dist/css/bootstrap.min.css";


const Home = () => {
  const [tenantData, setTenantData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const tenantsPerPage  = 5;
  const navigate = useNavigate()

  const token = Cookies.get('jwtToken')
  let url = 'https://fullstack-tenant-management-system.onrender.com/tenants'
  
  // fetching tenants data
  const getTenantsData = useCallback(async () => {
    try {
      if (!token) {
        return navigate('/login');
      }

      const options = {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        setTenantData(data)
      } else {
        toast.error(data.msg)
      }  
    } catch (error) {
      toast.error(error)
    }
}, [token, navigate, url])

  useEffect(() => {
    getTenantsData()
  }, [getTenantsData])

  // deleted specific tenant by id
 const deleteTenant = async id => {
    if (window.confirm("Are you sure you want to delete the tenant ?")) {
    const options = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const response = await fetch(`${url}/${id}`, options)
    const data = await response.json()

    if (response.ok) {
      toast.success(data.msg)
      setTenantData(prevData => prevData.filter(tenant => tenant.id !== id));
    } else {
      toast.error(data.msg)
    }
    }
 }

 // fecthing tenant data on updating, deleting tenant list
 const fetchData = () => {
   getTenantsData()
 }

 // Pagination Logic
 const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = tenantData.slice(indexOfFirstTenant, indexOfLastTenant);
  const totalPages = Math.ceil(tenantData.length / tenantsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Navbar />
      <Container>
        <h1 className="home-heading">Tenant Details</h1>

        <Popup modal trigger={<Button variant="primary" className="mb-3">Add Tenant</Button>}>
          <TenantForm addTenant="addTenant" fetchData={fetchData} />
        </Popup>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Monthly Rent</th>
              <th>Location</th>
              <th>Flat Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTenants.length !== 0 && 
            currentTenants.map(eachTenant => (
              <tr key={eachTenant.id}>
                <td>{eachTenant.name}</td>
                <td>{eachTenant.mobilenumber}</td>
                <td>{eachTenant.monthlyrent}</td>
                <td>{eachTenant.location}</td>
                <td>{eachTenant.flatsize}</td>
                <td>
                <Popup modal trigger={<Button variant="info" className="me-2 mb-2">View</Button>}>
                  <TenantForm tenantDetails={eachTenant} viewTenant="viewTenant" fetchData={fetchData} />
                </Popup>
                
                <Popup modal trigger={<Button variant="warning" className="me-2 mb-2">Edit</Button>}>
                  <TenantForm tenantDetails={eachTenant} editTenant="editTenant" fetchData={fetchData}/>
                </Popup>
                
                  <Button variant="danger" className="me-2 mb-2" onClick={() => deleteTenant(eachTenant.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {currentTenants.length !== 0 &&
        <div className="pagination-container">
          <Pagination>
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item 
                key={i + 1} 
                active={i + 1 === currentPage} 
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
        }
      </Container>
      {tenantData.length === 0 &&
         <div className='home-emptylist-container'>
          <h1>Your tenant details list is empty...</h1>
         </div>
        }
    </div>
  )
}

export default Home