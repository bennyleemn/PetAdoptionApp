import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PROFILE } from '../utils/mutations';
import Auth from '../utils/auth';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box'; // Add this import for the Box component

// Define a default theme
const defaultTheme = createTheme();

const Signup = () => {
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '' });
  const [validated] = useState("false");
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_PROFILE);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({variables:{...userFormData}});
      console.log(data)

      Auth.login(data.addProfile.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <h4 className="card-header" style={{ fontSize: '1.5rem' }}>SIGNUP!</h4>

          <form noValidate validated={validated} onSubmit={handleFormSubmit}>
            {showAlert && <div>Something went wrong with your signup!</div>}

            <div>
              <TextField
                type='text'
                placeholder='Username'
                name='name'
                onChange={handleInputChange}
                value={userFormData.name}
                required
              />
            </div>

            <div>
              <TextField
                type='email'
                placeholder='Email'
                name='email'
                onChange={handleInputChange}
                value={userFormData.email}
                required
                style={{ marginTop: '1.5rem' }}
              />
            </div>

            <div>
              <TextField
                type='password'
                placeholder='********'
                name='password'
                onChange={handleInputChange}
                value={userFormData.password}
                required
                style={{ marginTop: '1.5rem' }}
              />
            </div>

            <Button
              variant="contained"
              size="large"
              className="btn btn-block btn-primary"
              style={{ cursor: 'pointer', backgroundColor: '#d4a373', color: 'white', marginTop: '2rem' }}
              type="submit" disabled={!(userFormData.name && userFormData.email && userFormData.password)}>
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
