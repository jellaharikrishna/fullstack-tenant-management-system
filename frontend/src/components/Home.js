import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {Container, Table, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from './Navbar'
import TenantForm from './TenantForm';
import '../styles/Home.css'
import { toast } from 'react-toastify';

let url = 'https://fullstack-tenant-management-system.onrender.com/tenants'

const Home = () => {
  const [tenantData, setTenantData] = useState([])
  const navigate = useNavigate()

  const token = Cookies.get('jwtToken')

  useEffect(() => {
    const getTenantsData = async () => {
        if (!token) {
          return navigate('/login');
        }

        try {
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
    }
    getTenantsData()
  
  }, [token, navigate, tenantData])

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
    console.log(response)
    console.log(data)

    if (response.ok) {
      toast.success(data.msg)
      setTenantData(prevData => prevData.filter(tenant => tenant.id !== id));
    } else {
      toast.error(data.msg)
    }
    }
 }

  return (
    <div>
      <Navbar />
      <Container>
        <h1 className="home-heading">Tenant Details</h1>

        <Popup modal trigger={<Button variant="primary" className="mb-3">Add Tenant</Button>}>
          <TenantForm addTenant="addTenant" />
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
            {tenantData.map(eachTenant => (
              <tr key={eachTenant.id}>
                <td>{eachTenant.name}</td>
                <td>{eachTenant.mobilenumber}</td>
                <td>{eachTenant.monthlyrent}</td>
                <td>{eachTenant.location}</td>
                <td>{eachTenant.flatsize}</td>
                <td>
                <Popup modal trigger={<Button variant="info" className="me-2">View</Button>}>
                  <TenantForm tenantDetails={eachTenant} viewTenant="viewTenant" />
                </Popup>
                
                <Popup modal trigger={<Button variant="warning" className="me-2">Edit</Button>}>
                  <TenantForm tenantDetails={eachTenant} editTenant="editTenant"/>
                </Popup>
                
                  <Button
                    variant="danger"
                    onClick={() => deleteTenant(eachTenant.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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