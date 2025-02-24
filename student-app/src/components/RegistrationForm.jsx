import { useState } from 'react'
import axios from 'axios'
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Typography,
} from '@mui/material'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    studentID: '',
    telephone: '',
    birthDate: '',
    major: '',
    studentGroup: '',
    yearOfEnrollment: '',
  })

  // Define groups associated with each major
  const groupOptions = {
    Business: ['DN', 'INM', 'VTA'],
    'Information Technology': ['TI', 'DSM', 'EVN', 'RED'],
    Nanotechnology: ['NAN'],
    Administration: ['GCH'],
    Accounting: ['CTA'],
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value }

      // Reset studentGroup if major changes
      if (name === 'major') {
        updatedData.studentGroup = ''
      }

      return updatedData
    })
  }

  // Handle form submission with Axios
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Show confirmation alert before submitting
    const confirmSubmit = window.confirm(
      'Are you sure the information is correct?'
    )
    if (!confirmSubmit) return

    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        formData
      )
      alert(response.data.message)
      setFormData({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        studentID: '',
        telephone: '',
        birthDate: '',
        major: '',
        studentGroup: '',
        yearOfEnrollment: '',
      })
    } catch (error) {
      console.error('Error registering student:', error)
      alert('There was an error registering the student.')
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        New Student Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="Paternal Last Name"
          name="paternalLastName"
          value={formData.paternalLastName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="Maternal Last Name"
          name="maternalLastName"
          value={formData.maternalLastName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="Student ID"
          name="studentID"
          value={formData.studentID}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="Telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />

        {/* Major Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel>Major</InputLabel>
          <Select
            name="major"
            value={formData.major}
            onChange={handleChange}
            required
          >
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Information Technology">
              Information Technology
            </MenuItem>
            <MenuItem value="Nanotechnology">Nanotechnology</MenuItem>
            <MenuItem value="Administration">Administration</MenuItem>
            <MenuItem value="Accounting">Accounting</MenuItem>
          </Select>
        </FormControl>

        {/* Student Group Selection (Filtered based on Major) */}
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel>Student Group</InputLabel>
          <Select
            name="studentGroup"
            value={formData.studentGroup}
            onChange={handleChange}
            required
            disabled={!formData.major}
          >
            {formData.major &&
              groupOptions[formData.major].map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="Year of Enrollment"
          name="yearOfEnrollment"
          value={formData.yearOfEnrollment}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          autoComplete="off"
        />

        <Button variant="contained" color="primary" fullWidth type="submit">
          Register
        </Button>
      </form>
    </Container>
  )
}

export default RegistrationForm
