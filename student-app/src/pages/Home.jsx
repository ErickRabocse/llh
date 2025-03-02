import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import RegistrationForm from '../components/RegistrationForm'
import SessionForm from '../components/SessionForm'
// import backgroundImage from '../img/winter1.webp' // ✅ Import Image
import MorphingBackground from '../components/MorphingBackground'

const Home = () => {
  const [adminPassword, setAdminPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleAdminLogin = () => {
    if (adminPassword === 'llh25') {
      // Replace with actual authentication logic
      navigate('/admin')
    } else {
      setErrorMessage('Incorrect password. Please try again.')
    }
    setAdminPassword('') // Clears the input field
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        // background: 'linear-gradient(135deg, #A8E6CE 30%, #56AB91 70%)', // Lighter Green Gradient
        color: 'white', // Darker green for better contrast
        position: 'relative', // ✅ Needed for overlay effect
        overflow: 'hidden', // ✅ Prevents content overflow

        // Background Image
        // backgroundImage: `url(${backgroundImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
      }}
      // className="header finisher-header"
      // style={{width: "100%", height: "300px"}}
    >
      <MorphingBackground /> {/* ✅ Add background animation */}
      {/* Title and Welcome Message */}
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{
          fontFamily: 'Noto Sans',
          textAlign: 'center',
          mb: 1,
          fontSize: { xs: '2.5rem', md: '4rem' },
        }}
      >
        Language Learning Hub
      </Typography>
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', mb: 4, fontFamily: 'Noto Sans' }}
      >
        Welcome
      </Typography>
      <Grid container spacing={3} maxWidth="1200px">
        {/* New Registration Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)', // Soft white for contrast
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 2, fontFamily: 'Noto Sans' }}
            >
              New Registration
            </Typography>
            <RegistrationForm />
          </Paper>
        </Grid>

        {/* New Session Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 2, fontFamily: 'Noto Sans' }}
            >
              New Session
            </Typography>
            <SessionForm />
          </Paper>
        </Grid>

        {/* Administrator Access Section (Moved Below) */}
        <Grid item xs={12}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              mt: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 2, fontFamily: 'Noto Sans' }}
            >
              Administrator Access
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2, fontFamily: 'Noto Sans' }}>
                {errorMessage}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="Enter Admin Password"
              variant="outlined"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              autoComplete="off" // Prevents auto-fill
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAdminLogin}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Access
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
