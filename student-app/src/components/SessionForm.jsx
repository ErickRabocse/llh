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
  Box,
  Alert,
} from '@mui/material'

const SessionForm = () => {
  const [studentID, setStudentID] = useState('')
  const [skill, setSkill] = useState('')
  const [sessionInfo, setSessionInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = async () => {
    if (!studentID || !skill) {
      setErrorMessage('Please enter a Student ID and select a skill.')
      setTimeout(() => setErrorMessage(''), 4000)
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/log-session', {
        studentID,
        skill,
      })

      if (response.status === 200) {
        setErrorMessage('')

        console.log('🔹 Raw loginTime from server:', response.data.loginTime)
        console.log('🔹 Raw returnTime from server:', response.data.returnTime)

        // Extract timestamps
        const rawLoginTime = response.data.loginTime
        const rawReturnTime = response.data.returnTime

        const loginTime = rawLoginTime // Use time as sent by server
        const returnTime = rawReturnTime // Use time as sent by server

        const formatTime = (timeString) => {
          return timeString // ✅ Just return the time, since it's already formatted
        }

        setSessionInfo({
          studentName: response.data.studentName,
          loginTime: formatTime(loginTime),
          returnTime: formatTime(returnTime),
          skill: response.data.skill,
        })

        setStudentID('')

        // ✅ Both messages will disappear together after 4 seconds
        setTimeout(() => {
          setSessionInfo(null)
          setErrorMessage('')
        }, 4000)
      }
    } catch (error) {
      console.error('❌ Session Log Error:', error)

      if (error.response?.status === 403) {
        setErrorMessage(error.response.data.message)

        // ✅ Restore user session details even when they need to wait
        setSessionInfo({
          studentName: error.response.data.studentName,
          loginTime: error.response.data.loginTime,
          returnTime: error.response.data.returnTime,
          skill: skill,
        })

        // ✅ Both messages will disappear together after 4 seconds
        setTimeout(() => {
          setSessionInfo(null)
          setErrorMessage('')
        }, 4000)
      } else {
        setErrorMessage(
          error.response?.data.message || 'Error logging session.'
        )
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Log a Study Session
      </Typography>

      {/* Skill Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Choose the skill you&apos;ll work on</InputLabel>
        <Select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          required
        >
          <MenuItem value="Use of English">Use of English</MenuItem>
          <MenuItem value="Vocabulary">Vocabulary</MenuItem>
          <MenuItem value="Verbs">Verbs</MenuItem>
          <MenuItem value="Reading">Reading</MenuItem>
          <MenuItem value="Listening">Listening</MenuItem>
          <MenuItem value="Writing">Writing</MenuItem>
          <MenuItem value="Speaking">Speaking</MenuItem>
        </Select>
      </FormControl>

      {/* Student ID Input */}
      <TextField
        fullWidth
        label="Enter Student ID"
        value={studentID}
        onChange={(e) => setStudentID(e.target.value)}
        required
        sx={{ mb: 2 }}
        autoComplete="off"
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSearch}
      >
        Log a Session
      </Button>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {sessionInfo && (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="h6">
            Hello {sessionInfo.studentName.split(' ')[0]}!
          </Typography>
          <Typography>
            <strong>Session Start Time:</strong> {sessionInfo.loginTime}
          </Typography>
          <Typography>
            <strong>Return Time:</strong> {sessionInfo.returnTime}
          </Typography>
          <Typography>
            <strong>Skill:</strong> {sessionInfo.skill}
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default SessionForm
