const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json()) // Allows us to read JSON request bodies

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia si tienes otro usuario
  password: '1234', // Agrega tu contraseña aquí
  database: 'student_sessions',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('1234' + '\0'),
  },
  ssl: { rejectUnauthorized: false }, // Para evitar errores SSL
})

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Connected to MySQL database!')
  }
})

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is running!')
})

// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000')
})

// Ruta para registrar un estudiante
app.post('/register', (req, res) => {
  const {
    firstName,
    paternalLastName,
    maternalLastName,
    studentID,
    telephone,
    birthDate,
    major,
    studentGroup,
    yearOfEnrollment,
  } = req.body

  const sql =
    'INSERT INTO students (firstName, paternalLastName, maternalLastName, studentID, telephone, birthDate, major, studentGroup, yearOfEnrollment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'

  db.query(
    sql,
    [
      firstName,
      paternalLastName,
      maternalLastName,
      studentID,
      telephone,
      birthDate,
      major,
      studentGroup,
      yearOfEnrollment,
    ],
    (err, result) => {
      if (err) {
        console.error('Error al registrar estudiante:', err)
        res.status(500).json({ message: 'Error al registrar el estudiante' })
      } else {
        res.status(200).json({ message: 'Estudiante registrado exitosamente!' })
      }
    }
  )
})

// Route to get all students with their latest skill and skill counts
app.get('/students', (req, res) => {
  const sql = `
    SELECT 
      students.*, 
      COUNT(sessions.id) AS totalSessions,
      MAX(sessions.skill) AS lastSkill,
      SUM(CASE WHEN sessions.skill = 'Use of English' THEN 1 ELSE 0 END) AS useOfEnglish,
      SUM(CASE WHEN sessions.skill = 'Vocabulary' THEN 1 ELSE 0 END) AS vocabulary,
      SUM(CASE WHEN sessions.skill = 'Verbs' THEN 1 ELSE 0 END) AS verbs,
      SUM(CASE WHEN sessions.skill = 'Reading' THEN 1 ELSE 0 END) AS reading,
      SUM(CASE WHEN sessions.skill = 'Listening' THEN 1 ELSE 0 END) AS listening,
      SUM(CASE WHEN sessions.skill = 'Writing' THEN 1 ELSE 0 END) AS writing,
      SUM(CASE WHEN sessions.skill = 'Speaking' THEN 1 ELSE 0 END) AS speaking
    FROM students
    LEFT JOIN sessions ON students.studentID = sessions.studentID
    GROUP BY students.studentID;
  `

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching students:', err)
      return res.status(500).json({ message: 'Error fetching students' })
    }
    res.json(result)
  })
})

// Route to log a new session with skill selection
app.post('/log-session', (req, res) => {
  const { studentID, skill } = req.body

  // Verify if the student exists
  const checkStudentSql =
    'SELECT firstName, paternalLastName, maternalLastName FROM students WHERE studentID = ?'
  db.query(checkStudentSql, [studentID], (err, result) => {
    if (err) {
      console.error('Error verifying student:', err)
      return res.status(500).json({ message: 'Internal server error' })
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Student does not exist' })
    }

    const student = result[0]
    const studentFullName = `${student.firstName} ${student.paternalLastName} ${
      student.maternalLastName || ''
    }`.trim()

    // Check the last recorded session
    const lastSessionSql =
      'SELECT sessionTime FROM sessions WHERE studentID = ? ORDER BY sessionTime DESC LIMIT 1'
    db.query(lastSessionSql, [studentID], (err, sessionResult) => {
      if (err) {
        console.error('Error verifying last session:', err)
        return res.status(500).json({ message: 'Internal server error' })
      }

      const currentTime = new Date()

      if (sessionResult.length > 0) {
        const lastSessionTime = new Date(sessionResult[0].sessionTime)
        const differenceInMinutes =
          (currentTime - lastSessionTime) / (1000 * 60) // Convert ms to minutes

        if (differenceInMinutes < 60) {
          return res.status(403).json({
            message: `You must wait ${Math.ceil(
              60 - differenceInMinutes
            )} minutes before starting a new session.`,
            studentName: studentFullName,
            loginTime: lastSessionTime.toLocaleTimeString(),
            returnTime: new Date(
              lastSessionTime.getTime() + 60 * 60 * 1000
            ).toLocaleTimeString(),
          })
        }
      }

      // Check if the student has practiced this skill before
      const checkSkillSql = `
        SELECT id, skill_count FROM sessions 
        WHERE studentID = ? AND skill = ? 
        ORDER BY sessionTime DESC LIMIT 1;
      `

      db.query(checkSkillSql, [studentID, skill], (err, skillResult) => {
        if (err) {
          console.error('Error checking skill history:', err)
          return res
            .status(500)
            .json({ message: 'Error checking skill history' })
        }

        if (skillResult.length > 0) {
          // If the student has already practiced this skill, update skill_count
          const updateSkillCountSql = `
            UPDATE sessions SET skill_count = skill_count + 1 
            WHERE id = ?;
          `

          db.query(updateSkillCountSql, [skillResult[0].id], (err) => {
            if (err) {
              console.error('Error updating skill count:', err)
              return res
                .status(500)
                .json({ message: 'Error updating skill count' })
            }

            // ✅ Update total_sessions in the students table
            const updateTotalSessionsSql = `
              UPDATE students SET total_sessions = total_sessions + 1 
              WHERE studentID = ?;
            `
            db.query(updateTotalSessionsSql, [studentID], (err) => {
              if (err) {
                console.error('Error updating total sessions:', err)
                return res.status(500).json({
                  message: 'Error updating total sessions',
                })
              }

              res.status(200).json({
                message: `Session logged, and skill "${skill}" count updated`,
                studentName: studentFullName,
                loginTime: new Date().toLocaleTimeString(),
                returnTime: new Date(
                  currentTime.getTime() + 60 * 60 * 1000
                ).toLocaleTimeString(),
                skill: skill,
                skillCount: skillResult[0].skill_count + 1,
              })
            })
          })
        } else {
          // If this is the first time practicing this skill, insert a new row
          const insertSessionSql =
            'INSERT INTO sessions (studentID, skill, skill_count) VALUES (?, ?, 1)'
          db.query(insertSessionSql, [studentID, skill], (err) => {
            if (err) {
              console.error('Error logging session:', err)
              return res.status(500).json({ message: 'Error logging session' })
            }

            // ✅ Update total_sessions in the students table
            const updateTotalSessionsSql = `
              UPDATE students SET total_sessions = total_sessions + 1 
              WHERE studentID = ?;
            `
            db.query(updateTotalSessionsSql, [studentID], (err) => {
              if (err) {
                console.error('Error updating total sessions:', err)
                return res.status(500).json({
                  message: 'Error updating total sessions',
                })
              }

              res.status(200).json({
                message: 'Session successfully logged',
                studentName: studentFullName,
                loginTime: new Date().toLocaleTimeString(),
                returnTime: new Date(
                  currentTime.getTime() + 60 * 60 * 1000
                ).toLocaleTimeString(),
                skill: skill,
                skillCount: 1,
              })
            })
          })
        }
      })
    })
  })
})

// Route to delete a student
app.delete('/students/:studentID', (req, res) => {
  const { studentID } = req.params

  const sql = 'DELETE FROM students WHERE studentID = ?'
  db.query(sql, [studentID], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err)
      return res.status(500).json({ message: 'Error deleting student' })
    }
    res.json({ message: 'Student deleted successfully' })
  })
})

// Route to update student information
app.put('/students/:studentID', (req, res) => {
  const { studentID } = req.params
  const {
    firstName,
    paternalLastName,
    maternalLastName,
    major,
    studentGroup,
    yearOfEnrollment,
  } = req.body

  const sql = `
      UPDATE students 
      SET firstName = ?, 
          paternalLastName = ?, 
          maternalLastName = ?, 
          major = ?, 
          studentGroup = ?, 
          yearOfEnrollment = ?
      WHERE studentID = ?
  `

  db.query(
    sql,
    [
      firstName,
      paternalLastName,
      maternalLastName,
      major,
      studentGroup,
      yearOfEnrollment,
      studentID,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating student:', err)
        return res.status(500).json({ message: 'Error updating student' })
      }
      res.json({ message: 'Student updated successfully' })
    }
  )
})
