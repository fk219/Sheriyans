import React from 'react'

const FormGroup = ({ label, placeholder, type = 'text', value, onChange }) => {
  const id = label.toLowerCase()

  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <input 
        value={value} 
        onChange={onChange} 
        type={type} 
        id={id} 
        name={id} 
        placeholder={placeholder} required />
    </div>
  )
}

export default FormGroup