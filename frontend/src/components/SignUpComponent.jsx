import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {createContext, useContext} from 'react';
import LoginContext from '../context/LoginContext';
import Box from '@mui/material/Box';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { grey } from "@mui/material/colors";
import { useEventCallback } from "@mui/material";

const SignUpComponent = ({ language }) => {

    const [isValidToken, setIsValidToken] = useState(false)
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userNickInput, setUserNickInput] = useState('')
    // const [userNick, setUserNick] = useState("")
    const {logged, setLogged, userNick, setUserNick} = useContext(LoginContext)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    
    // useEffect(()=> {
    //     console.log("Idioma: ", language)
    //     setLanguageSet(language)
    //     i18n.changeLanguage(language)
    // }, [language])

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    const loginText = "Texto de Login"

    const handleUserPassword = (e) => {
        if (e.target.value.length < 5)
            setErrorMessage("Contraseña demasiado corta")
        else
            setUserPassword(e.target.value)
    }

    const handleUserNickInput = (e) => {
    if (e.target.value.length < 5)
        setErrorMessage("Nick demasiado corto")
    else
        setUserNickInput(e.target.value) 
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const buttonSelected = e.nativeEvent.submitter.name
        console.log("Pulsado: ", buttonSelected)
        if (buttonSelected === "login") {
            try {
                const user = {
                    username: userName,
                    password: userPassword
                }
                // fetch validate
                // const response = await fetch("http://localhost:5000/api/v1/playarena/login",
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/playarena/login`,
                    {
                        method: 'POST',
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.message === "usuario o contraseña no válidos") {
                    setErrorMessage("usuario o contraseña no válidos")
                    setIsValidToken(false)
                    return
                }
                setIsValidToken(true)
                navigate(`/profile/${data.token}`);
            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }

        } else {
            try {
                const user = {
                    username: userName,
                    password: userPassword,
                    nick: userNickInput
                }
                // fetch validate
                // const response = await fetch("http://localhost:5000/api/v1/playarena/signup",
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/playarena/signup`,
                    {
                        method: 'POST',
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "YA EXISTE") {
                    setErrorMessage("Usuario ya existente")
                    setIsValidToken(false)
                    return
                }
                setIsValidToken(true)
                setLogged(true)       
                setUserNick(userNickInput)
                navigate('/')

            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }
        }
    }
    
    const handleSignUp = (e) => {
        e.preventDefault()
        console.log(userName, userPassword)
    }

    return (
        <>
            {/* {isValidToken && isValidToken ? 
                <h2 style = {{ color: "white"}}>Página de perfil /Profilepage (logged)</h2>
                : <h2 style = {{ color: "white"}}>No logeado /Not logged in</h2>
                // <h2>{loginText.loginStatusMessage.logged}</h2>
                // : <h2>{loginText.loginStatusMessage.notLogged}</h2>
            } */}
            <Box component="form"
                onSubmit={(e)=> handleLogin(e)}
                sx={{
                width: { xs: '90%', sm: 320 },
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                border: "1px solid grey",
                borderRadius: '10px',
                boxShadow: '10px 10px 15px 5px grey',
                // boxShadow: 5,
                backgroundColor: "#339fff"
                }}
            >
                <div>
                    <Typography level="h4" component="h1" sx={{ color: "white"}}>
                        <b>Welcome!</b>
                        {/* <b>{loginText.loginWindow.headLine1}</b> */}
                    </Typography>
                    <Typography sx={{ color: "white" }} level="body-sm">Registration Form</Typography>
                </div>
                <FormControl>
                    <FormLabel sx={{ color: "white" }}>Nombre</FormLabel>
                    <Input
                        // html input attribute
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder="nombre usuario"
                        onChange={(e)=> setUserName(e.target.value)}
                        />
                </FormControl>
                <FormControl>
                    <FormLabel sx={{ color: "white" }}>Contraseña</FormLabel>
                    <Input
                        // html input attribute
                        name="userPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="(min. 5 caracteres)"
                        onChange={(e)=> handleUserPassword(e)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel sx={{ color: "white" }}>Nick</FormLabel>
                    <Input
                        // html input attribute
                        name="userNickInput"
                        type="text"
                        autoComplete="nickInput"
                        placeholder="(min. 5 caracteres)"
                        onChange={(e)=> handleUserNickInput(e)}
                    />
                </FormControl>

                {/* <Button type="submit" id="boton1" name="login" sx={{ mt: 1 }}>Login</Button> */}
                <Button type="submit" id="boton2" name="signup" sx={{ mt: 1 /* margin top */ }}>SignUP</Button>

                {errorMessage && 
                
                <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                {/* <Typography
                    endDecorator={<Link href="/sign-up">Sign up</Link>}
                    sx={{ fontSize: 'sm', alignSelf: 'center' }}
                    onClick={handleSignUp}
                    >
                    Don&apos;t have an account?
                </Typography> */}

            </Box>
        </>
    )
}

export default SignUpComponent