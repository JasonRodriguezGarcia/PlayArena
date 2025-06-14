import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// codigo para el grid
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
// codigo para el form
import TextField from '@mui/material/TextField';
// codigo para la form final de prueba
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

// codigo para el Floating Action Button
import Fab from '@mui/material/Fab';

const id = "68388263680b993ece24c2d7"

const Test2 = () => {

    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    const [lugarRecogida, setLugarRecogida] = useState('')
    const [lugarDestino, setLugarDestino] = useState('')
    const [estado, setEstado] = useState('Reservado')
    const [costo, setCosto] = useState(0)
    const [cuenta, setCuenta] = useState(0)
    const [gastos, setGastos] = useState(0)

    const getOperaciones = async () => {
        try {
            const response = await fetch (`http://localhost:5000/api/v1/taxis/viaje/${id}/query?operacion=cuenta`)
            if (!response.ok) {
                throw new Error ("Error en consulta de operacion")
            }
            const datos = await response.json()
            console.log("Operacion: ", datos)
            setCuenta(datos.resultado)

            // setGastos(datos.resultado)
        }
        catch(error) {
            console.log("Error retrieving operacion: ", error)
        }
    }
    useEffect (() => {

        getOperaciones()
    }, [user])

    useEffect (()=> {
        const getUser = async ()=> {
            try {
                const response = await fetch (`http://localhost:5000/api/v1/taxis/${id}`)
                if (!response.ok) {
                    throw new Error ("Error en consulta de users")
                }
                const datos = await response.json()
                console.log("User: ", datos)
                // console.log("user: ", datos[0])
                // setUsers(datos)
                setUser(datos)
                setErrorMessage("")
            }
            catch(error) {
                console.log("Error retrieving users: ", error)
            }
        }

        getUser()
    }, [])

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        console.log("handleFormSubmit")
        try {
            const viaje = {
                lugar_recogida: lugarRecogida,
                lugar_destino: lugarDestino,
                fecha_hora: new Date(),
                estado: estado, 
                costo: costo
            }
            console.log(viaje)
            const response = await fetch (`http://localhost:5000/api/v1/taxis/viaje/${id}`,
                {
                    method: 'POST',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(viaje)
                }
            )
            if (!response.ok) {
                throw new Error ("Error en guardado viaje")
            }
            const datoResponse = await response.json()
            console.log("Imprimo datoResponse al añadir: ", datoResponse)
            viaje.id_viaje = datoResponse.id_viaje
            setUser(prevUser => ({
                prevUser, viajes: [...prevUser.viajes, viaje] // añadimos viaje a prevUser.viajes via spread
            }))
            setErrorMessage("")
            setLugarRecogida('')
            setLugarDestino('')
            setEstado('Reservado')
            setCosto(0)

            getOperaciones()

        }
        catch(error) {
            console.log("Error retrieving users: ", error)
        }
    }

    const handleDelete = async (idViaje) => {
        // e.preventDefault()
        console.log("handleDelete: ", idViaje)
        try {   
            const viaje = {
                id_viaje: idViaje,
            }
            console.log(viaje)
            const response = await fetch (`http://localhost:5000/api/v1/taxis/viaje/${id}`,
                {
                    method: 'DELETE',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(viaje)
                }
            )
            if (!response.ok) {
                throw new Error ("Error en borrando viaje")
            }
            const datoResponse = await response.json()
            console.log("Imprimo response al borrar: ", datoResponse)
            setUser(prevUser => ({
                prevUser, viajes: [...prevUser.viajes.filter(viaje => 
                    viaje.id_viaje != idViaje
                )] // añadimos viaje a prevUser.viajes via spread
            }))
        }
        catch(error) {
            console.log("Error deleting viaje: ", error)
        }
    }

return (
    <>
    <Box sx={{width: "90vw", marginX: "20px"}}>
        <Typography variant="h4" component="div" sx={{margin: "10px 0",  color: "blue"}}>
            Bienvenid@ a SS Taxis, 
            <b> {user.nombre && user.nombre}</b>
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "white"}}>
                        <Typography variant="h5" component="div" sx={{margin: "10px 0",  color: "blue"}}>
                            Historial de Viajes con SS Taxis
                        </Typography>
                        <Typography variant="h5" component="div" sx={{margin: "10px 0",  color: "blue"}}>
                            Viajes {cuenta}-
                            Gastos {gastos}
                        </Typography>

                        {user.viajes && user.viajes.map((viaje, index) => (
                            <Card key={index} sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",
                                textAlign: "left", minWidth: 275, backgroundColor: "lightgray" }}>
                                <CardContent>
                                    <Typography sx={{ color: 'text.primary', fontSize: 20, mb: 0}}>
                                        {viaje.lugar_recogida} ➡️ {viaje.lugar_destino}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
                                        Estado: <i>{viaje.estado}</i> | Costo: <b>{viaje.costo}</b>
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
                                        {/* Fecha: {viaje.fecha_hora} */}
                                        Fecha: {new Date(viaje.fecha_hora).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </Typography>
                                </CardContent>
                                <CardContent sx={{display: "flex", alignItems: "center", gap: "10px"}}>
                                    {/* <Typography sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
                                    ✏️
                                    </Typography> */}
                                    {/* <Typography sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}
                                        onClick={(e)=> handleDelete()}
                                    >
                                    🗑️
                                    </Typography> */}
                                    <Button variant="text" size="small" color="primary" sx={{width: "10%"}}>
                                        ✏️
                                    </Button>
                                    <Button onClick={()=>handleDelete(viaje.id_viaje)} variant="text" size="small" color="primary" sx={{width: "10%"}}>
                                        🗑️
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Grid>
                <Grid size={10}>

                    <Box component="form" onSubmit={handleFormSubmit}
                                sx={{
                                // width: 300,
                                // height: 300,
                                borderRadius: 1,
                                display: "flex",
                                // justifyContent: "center",
                                // alignContent: "baseline",
                                flexDirection: "column",
                                m: 0,
                                // gap: 1,
                                p: 2
                                }}
                    >
                        <Typography variant="h5" component="div" 
                            sx={{margin: "0 0 1 0",  color: "blue"}}
                        >
                            Pedir taxi
                        </Typography>
                        <Typography variant="subtitle1" 
                            sx={{textAlign: "left", mb: 0}}
                        >
                            Lugar de recogida:
                        </Typography>
                        <TextField id="lugarRecogida" value={lugarRecogida} ariant="outlined" placeholder="Ej: Calle principal"
                            onChange={(e)=> setLugarRecogida(e.target.value)}
                        />
                        <Typography variant="subtitle1" textAlign="left" >
                            Lugar de destino:
                        </Typography>
                        <TextField id="lugarDestino" value={lugarDestino} variant="outlined" placeholder="Ej: Parque Central"
                            onChange={(e)=> setLugarDestino(e.target.value)}
                        />
                        <Typography variant="subtitle1" textAlign="left" >
                            Estado del viaje:
                        </Typography>
                        <TextField id="estado" value={estado} variant="outlined"
                            onChange={(e)=> setEstado(e.target.value)}
                        />
                        <Typography variant="subtitle1" textAlign="left" >
                            Costo €:
                        </Typography>
                        <TextField id="cost0" value={costo} variant="outlined" placeholder="Ej: 15.50"
                            onChange={(e)=> setCosto(e.target.value)}
                        />
                        {/* <Button type="submit" variant="contained" color="primary" sx={{width: "10%"}}>
                            Guardar
                        </Button> */}
                        <Fab type="submit" variant="extended" size="medium" color="primary" 
                            sx={{width: "15%", position: "fixed", left: "50%", transform: "translateX(-50%)" , bottom: "0", mb: 2}}
                        >
                            Reservar Taxi
                        </Fab>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
    </>
  );
}

export default Test2
// export default function BasicCard() {
    {/* <Card sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",
        textAlign: "left", minWidth: 275, backgroundColor: "lightgray" }}>
        <CardContent>
            <Typography gutterbottom sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
            Calle Principal ➡️ Parque Central
            </Typography>
            <Typography gutterbottom sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
            Estado: <i>completado</i> | Costo: <b>€15.00</b>
            </Typography>
            <Typography gutterbottom sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
            Fecha: 20/05/2025, 16:00:00
            </Typography>
        </CardContent>
        <CardContent sx={{display: "flex", alignItems: "center", gap: "10px"}}>
            <Typography gutterbottom sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
            ✏️
            </Typography>
            <Typography gutterbottom sx={{ color: 'text.secondary', fontSize: 20, mb: 0 }}>
            🗑️
            </Typography>
        </CardContent>
    </Card> */}