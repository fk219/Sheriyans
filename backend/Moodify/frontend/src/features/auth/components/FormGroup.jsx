import React from 'react'

const FormGroup = ({ label, placeholder, type = 'text' }) => {
  const id = label.toLowerCase()

  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} name={id} placeholder={placeholder} required />
    </div>
  )
}

export default FormGroup