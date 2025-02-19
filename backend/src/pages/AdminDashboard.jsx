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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

const AdminDashboard = () => {
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMajor, setSelectedMajor] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate() // Hook to navigate between pages

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
    setSelectedStudent({ ...student, newStudentID: student.studentID })
    setOpen(true)
  }

  // Function to update student details
  const handleEditSubmit = async () => {
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

  // Function to filter students based on search and selected filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchQuery
      ? student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.paternalLastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.studentID.includes(searchQuery)
      : true

    const matchesMajor = selectedMajor ? student.major === selectedMajor : true
    const matchesGroup = selectedGroup
      ? student.studentGroup === selectedGroup
      : true

    return matchesSearch && matchesMajor && matchesGroup
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

        <FormControl fullWidth>
          <InputLabel>Filter by Major</InputLabel>
          <Select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Information Technology">
              Information Technology
            </MenuItem>
            <MenuItem value="Nanotechnology">Nanotechnology</MenuItem>
            <MenuItem value="Administration">Administration</MenuItem>
            <MenuItem value="Accounting">Accounting</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Filter by Group</InputLabel>
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="DN">DN</MenuItem>
            <MenuItem value="INM">INM</MenuItem>
            <MenuItem value="VTA">VTA</MenuItem>
            <MenuItem value="CTA">CTA</MenuItem>
            <MenuItem value="GCH">GCH</MenuItem>
            <MenuItem value="NAN">NAN</MenuItem>
            <MenuItem value="TI">TI</MenuItem>
            <MenuItem value="DSM">DSM</MenuItem>
            <MenuItem value="EVN">EVN</MenuItem>
            <MenuItem value="RED">RED</MenuItem>
          </Select>
        </FormControl>
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
                <strong>Major</strong>
              </TableCell>
              <TableCell>
                <strong>Group</strong>
              </TableCell>
              <TableCell>
                <strong>Total Sessions</strong>
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
                <TableCell>{student.major}</TableCell>
                <TableCell>{student.studentGroup}</TableCell>
                <TableCell>{student.totalSessions || 0}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditClick(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
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
          {selectedStudent && (
            <>
              <TextField
                fullWidth
                label="Student ID"
                value={selectedStudent.newStudentID}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    newStudentID: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="First Name"
                value={selectedStudent.firstName}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    firstName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Paternal Last Name"
                value={selectedStudent.paternalLastName}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    paternalLastName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Major"
                value={selectedStudent.major}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    major: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
            </>
          )}
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
