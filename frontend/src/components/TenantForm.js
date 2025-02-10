import React, { useState } from 'react'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify';

import '../styles/TenantForm.css'

const locationsList = ['Hyderabad', 'Bangalore', 'Chennai', 'Pune', 'Mumbai', 'Delhi', 'Kolkata']
const flatsizeList = ['1 BHK', '2 BHK', '3 BHK', '4 BHK',]

const TenantForm = ({tenantDetails, addTenant, viewTenant, editTenant}) => {
    const [tenantData, setTenantData] = useState({
        name: tenantDetails ? tenantDetails.name : '',
        mobilenumber: tenantDetails ? tenantDetails.mobilenumber : '',
        monthlyrent: tenantDetails ? tenantDetails.monthlyrent : '',
        flatsize: tenantDetails ? tenantDetails.flatsize : flatsizeList[0],
        location: tenantDetails ? tenantDetails.location : locationsList[0],
    })
    const [showForm, setShowForm] = useState(true)

    const handlerchange = e => {
        setTenantData({...tenantData, [e.target.name]: e.target.value})
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        const token = Cookies.get('jwtToken')

        let url = tenantDetails ? 
        `https://fullstack-tenant-management-system.onrender.com/tenants/${tenantDetails.id}`
        : 'https://fullstack-tenant-management-system.onrender.com/tenants'

        const options = {
            method:  tenantDetails ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(tenantData)
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok) {
            setShowForm(false)
            toast.success(data.msg)
        } else {
            toast.error(data.msg)
        }
    }

  return (
    <>
    {((showForm && editTenant === "editTenant") || (showForm && addTenant === 'addTenant')) &&
        <form onSubmit={handlerSubmit} className='tenantform-form'>
           <h1 className='tenantform-form-heading'>{tenantDetails ? 'Edit Tenant' : 'Add Tenant'}</h1>
            <div className='tenantform-input-card'>
                <label className='tenantform-input-label' htmlFor='name'>Name</label>
                <input onChange={handlerchange} className='tenantform-input' id='name' value={tenantData.name} type='text' name='name' placeholder='Enter tenant name' required />
            </div>
            <div className='tenantform-input-card'>
                <label className='tenantform-input-label' htmlFor='mobilenumber'>Mobile Number</label>
                <input onChange={handlerchange} className='tenantform-input' id='mobilenumber' value={tenantData.mobilenumber} type='number' name='mobilenumber' placeholder='Enter tenant mobile number' required/>
            </div>
            <div className='tenantform-input-card'>
                <label className='tenantform-input-label' htmlFor='monthlyrent'>Monthly Rent</label>
                <input onChange={handlerchange} className='tenantform-input' id='monthlyrent' value={tenantData.monthlyrent} type='number' name='monthlyrent' placeholder='Enter monthly rent' required/>
            </div>
            <div className='tenantform-input-card'>
                <label className='tenantform-input-label' htmlFor='location'>Location</label>
                <select onChange={handlerchange} className='tenantform-input' id='location' value={tenantData.location} type='text' name='location' placeholder='Enter location' required>
                    {locationsList.map(eachLocation => 
                    <option key={eachLocation}>{eachLocation}</option>
                )}
                </select>
            </div>
            <div className='tenantform-input-card'>
                <label className='tenantform-input-label' htmlFor='flatsize'>Flat Size</label>
                <select onChange={handlerchange} className='tenantform-input' id='flatsize' value={tenantData.flatsize} type='text' name='flatsize' placeholder='Enter flatsize' required>
                    {flatsizeList.map(eachFlatsize => 
                    <option key={eachFlatsize}>{eachFlatsize}</option>
                )}
                </select>
            </div>
            <button className='tenantform-form-btn' type='submit'>{tenantDetails ? 'Update' : 'Save'}</button>
        </form>
    }
    {viewTenant === "viewTenant" && 
    <div className='tenant-info-card'>
        <h1 className='tenant-info-heading'>Tenant Info</h1>
        <p className='tenant-info-para'> <strong>Tenant Id:</strong> {tenantDetails.id}</p>
        <p className='tenant-info-para'> <strong>Tenant Name:</strong> {tenantDetails.name}</p>
        <p className='tenant-info-para'> <strong>Tenant Mobile Number:</strong> {tenantDetails.mobilenumber}</p>
        <p className='tenant-info-para'> <strong>Monthly Rent:</strong> {tenantDetails.monthlyrent}</p>
        <p className='tenant-info-para'> <strong>Location:</strong> {tenantDetails.location}</p>
        <p className='tenant-info-para'> <strong>Flat Size:</strong> {tenantDetails.flatsize}</p>
    </div>
    }
    </>
  )
}

export default TenantForm
