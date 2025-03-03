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
import backgroundImage from '../img/cartographer.png' // ✅ Import Image
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
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 2, md: 3 },
        color: 'white',
        position: 'relative',
        overflowX: 'hidden', // ✅ Prevents horizontal scrolling
        width: { xs: '85vw', sm: '95vw', md: '100vw' }, // ✅ Reduce width by 15% on mobile
        maxWidth: { xs: '85%', sm: '90%', md: '100%' }, // ✅ Adjust max width dynamically
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
      }}
    >
      <MorphingBackground />{' '}
      {/* ✅ Keeps the animation while allowing scrolling */}
      {/* Title and Welcome Message */}
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{
          fontFamily: 'Noto Sans',
          textAlign: 'center',
          mb: 1,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' }, // ✅ Scale text properly
        }}
      >
        Language Learning Hub
      </Typography>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // ✅ Dynamic size
          fontFamily: 'Noto Sans',
        }}
      >
        Welcome
      </Typography>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        maxWidth={{ xs: 'sm', md: '1200px' }}
      >
        {' '}
        {/* // ✅ Reduced maxWidth from "1200px" to "sm" */}
        {/* New Registration Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={5}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              width: '100%', // ✅ Ensures it scales properly
              maxWidth: { xs: '90%', sm: '400px', md: '450px' }, // ✅ Match other containers
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
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              width: '100%',
              maxWidth: { xs: '90%', sm: '400px', md: '450px' }, // ✅ Make all widths equal
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
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              width: '100%',
              maxWidth: { xs: '90%', sm: '400px', md: '450px' }, // ✅ Make all widths equal
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
              onClick={handleAdminLogin}
              sx={{
                py: 1,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: '#6ba6ff',
                color: 'white',
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
