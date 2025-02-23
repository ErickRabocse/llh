import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

const AdminDashboard = () => {
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Fetch students from the backend
  const fetchStudents = () => {
    axios
      .get('http://localhost:5000/students')
      .then((response) => {
        setStudents(response.data)
      })
      .catch((error) => {
        console.error('Error fetching students:', error)
      })
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Function to delete a student
  const handleDelete = async (studentID) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    )
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:5000/students/${studentID}`)
      alert('Student deleted successfully.')
      fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student.')
    }
  }

  // Function to open the edit modal
  const handleEditClick = (student) => {
    const editableFields = {
      studentID: student.studentID,
      firstName: student.firstName,
      paternalLastName: student.paternalLastName,
      maternalLastName: student.maternalLastName,
      major: student.major,
      studentGroup: student.studentGroup,
      yearOfEnrollment: student.yearOfEnrollment,
    }

    setSelectedStudent(editableFields)
    setOpen(true)
  }

  // Function to handle changes in the edit form
  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedStudent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Function to update student details
  const handleEditSubmit = async () => {
    if (!selectedStudent) return

    try {
      await axios.put(
        `http://localhost:5000/students/${selectedStudent.studentID}`,
        selectedStudent
      )
      alert('Student updated successfully.')
      setOpen(false)
      fetchStudents()
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Failed to update student.')
    }
  }

  // Function to filter students based on search
  const filteredStudents = students.filter((student) => {
    return searchQuery
      ? student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.paternalLastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.studentID.includes(searchQuery)
      : true
  })

  return (
    <Container>
      {/* Return Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Administrator Dashboard</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/')}
        >
          Return to Homepage
        </Button>
      </Box>

      {/* Search & Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by Name or Student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Student ID</strong>
              </TableCell>
              <TableCell>
                <strong>First Name</strong>
              </TableCell>
              <TableCell>
                <strong>Paternal Last Name</strong>
              </TableCell>
              <TableCell>
                <strong>Maternal Last Name</strong>
              </TableCell>
              <TableCell>
                <strong>Major</strong>
              </TableCell>
              <TableCell>
                <strong>Group</strong>
              </TableCell>
              <TableCell>
                <strong>Year of Enrollment</strong>
              </TableCell>
              <TableCell>
                <strong>Total Sessions</strong>
              </TableCell>
              <TableCell>
                <strong>Latest Skill</strong>
              </TableCell>
              <TableCell>
                <strong>Use of English</strong>
              </TableCell>
              <TableCell>
                <strong>Vocabulary</strong>
              </TableCell>
              <TableCell>
                <strong>Verbs</strong>
              </TableCell>
              <TableCell>
                <strong>Reading</strong>
              </TableCell>
              <TableCell>
                <strong>Listening</strong>
              </TableCell>
              <TableCell>
                <strong>Writing</strong>
              </TableCell>
              <TableCell>
                <strong>Speaking</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.studentID}>
                <TableCell>{student.studentID}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.paternalLastName}</TableCell>
                <TableCell>{student.maternalLastName}</TableCell>
                <TableCell>{student.major}</TableCell>
                <TableCell>{student.studentGroup}</TableCell>
                <TableCell>{student.yearOfEnrollment}</TableCell>
                <TableCell>{student.totalSessions || 0}</TableCell>
                <TableCell>{student.lastSkill || 'N/A'}</TableCell>
                <TableCell>{student.useOfEnglish || 0}</TableCell>
                <TableCell>{student.vocabulary || 0}</TableCell>
                <TableCell>{student.verbs || 0}</TableCell>
                <TableCell>{student.reading || 0}</TableCell>
                <TableCell>{student.listening || 0}</TableCell>
                <TableCell>{student.writing || 0}</TableCell>
                <TableCell>{student.speaking || 0}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEditClick(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDelete(student.studentID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Student Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          {selectedStudent &&
            Object.entries(selectedStudent).map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                name={key}
                label={key.replace(/([A-Z])/g, ' $1')}
                value={value}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDashboard
