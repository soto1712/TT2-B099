import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../config/axios'
import Swal from 'sweetalert2';
import Temp from '../common/Temporizador'
import { format } from 'date-fns'
import MathJax from 'react-mathjax'
var Latex = require('react-latex');
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function ResponderExamen({ token, idA }) {

    let ids = [];
    let reactivos2 = [];
    let aleatorio = false;

    const { id } = useParams();
    let identificadores = id.split(';')
    let idEx = identificadores[0];
    let idRegistro = identificadores[1];


    let respuestas = [];
    const [reactivosCalibrados, setReactivosCalibrados] = useState([]);
    const [tiempo, setTiempo] = useState(false)
    const [reactivos, setReactivos] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [examenes, setExamenes] = useState([]);
    const [datos, setDatos] = useState([]);
    const [generales, setGenerales] = useState({});
    const [hora, setHora] = useState('')
    const [registro, SetRegistro] = useState([])
    const { nombre, materia, tema, duracion, preguntasAleatorias, _id, fechaTerminacion } = generales
    const { estatus, calificación, duración, fechaInicio, fechaFin } = registro
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        try {

            async function obtenerDatosRegistro() {
                const respuesta = await axios.get(`api/respuestas/${idRegistro}`,
                    {
                        headers: { 'x-access-token': token }
                    })
                SetRegistro(respuesta.data.registros[0])
                setLoading(true);
            }

            async function obtenerDatos() {
                const respuesta = await axios.get(`api/examenes/alumno/${idEx}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setGenerales(respuesta.data)
                if (respuesta.data.preguntasAleatorias) {
                    aleatorio = true;
                }
                respuesta.data.reactivo.map(idreactivo => {
                    ids.push(idreactivo)
                })
                let seconds2 = respuesta.data.duracion * 60
                var hour = Math.floor(seconds2 / 3600);
                hour = (hour < 10) ? '0' + hour : hour;
                var minute = Math.floor((seconds2 / 60) % 60);
                minute = (minute < 10) ? '0' + minute : minute;
                var second = seconds2 % 60;
                second = (second < 10) ? '0' + second : second;
                let date = hour + ' horas ' + minute + ' minutos ' + second + ' segundos '
                setHora(date)
                obtenerReactivos()
            }
            async function obtenerReactivos() {
                const respuesta = await axios.get(`api/reactivos/alumno`,
                    {
                        headers: { 'x-access-token': token }
                    });
                reactivos2.push(respuesta.data)
                if (reactivos2) {
                    let dato = reactivos2[0].filter(u => ids.includes(u._id))
                    if (aleatorio) {
                        let random = dato.sort(function () { return Math.random() - 0.5 });
                        setDatos(random)
                    } else {
                        setDatos(dato)
                    }
                }
            }
            async function obtenerReactivosT() {
                const respuesta = await axios.get(`api/reactivos/AlumnoProfesor/${registro.idProfesor}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setReactivos(respuesta.data)
            }
            async function obtenerRegistros() {
                const respuesta = await axios.get(`api/respuestas/AlumnoProfesor/recuperar/${registro.idProfesor}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setRegistros(respuesta.data)
            }
            async function obtenerExamenes() {
                const respuesta = await axios.get(`api/examenes/obtener/alumno/${registro.idProfesor}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setExamenes(respuesta.data)
            }
            if (loading === true) {
                obtenerReactivosT();
                obtenerRegistros();
                obtenerExamenes()
            }
            obtenerDatos();
            obtenerDatosRegistro();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los examenes.',
                footer: error
            });
        }
    }, [token, loading]);

    const clic = async e => {
        respuestas = respuestas.filter(u => u.respuesta.pregunta !== e.target.name)
        respuestas.push({
            idExamen: idEx,
            idUsuario: idA,
            respuesta: {
                pregunta: e.target.name,
                respuest: e.target.value
            }
        })

    }

    async function calificar() {
        setLoading(false);
        let calificacion = 0;
        datos.map(dat => {
            respuestas.map(resp => {
                if (resp.respuesta.pregunta === dat._id) {
                    if (resp.respuesta.respuest === dat.opcionCorrecta._id) {
                        calificacion = parseFloat(calificacion) + parseFloat(dat.ponderacion);
                    } else {
                        calificacion = parseFloat(calificacion) + 0;
                    }
                }
            })
        })
        let data = {
            calificacion: Math.round(calificacion * 100) / 100,
            estatus: 'terminado',
            respuestas: respuestas,
            fechaFin,
            fechaInicio
        }
        return data
    }

    const calibrado = async () => {
        let resp = [];
        const respuesta = await axios.get(`api/respuestas/AlumnoProfesor/recuperar/${registro.idProfesor}`,
        {
            headers: { 'x-access-token': token }
        });
        if(respuesta){
            generales.reactivo.map(reactivo => {
                respuesta.data.map(registro => {
                    if (registro.idExamen === generales._id) {
                        if (registro.respuestas[0]) {
                            let approved = reactivos.filter(reactivo => reactivo._id === registro.respuestas[0].respuesta.pregunta);
                            if (approved[0].opcionCorrecta._id === registro.respuestas[0].respuesta.respuest) {
                                resp.push({
                                    reactivo: reactivo,
                                    Usuario: registro.idUsuario,
                                    Examen: registro.idExamen,
                                    Calificacion: registro.calificación,
                                    correcta: true
                                })
                            } else {
                                resp.push({
                                    reactivo: reactivo,
                                    Usuario: registro.idUsuario,
                                    Examen: registro.idExamen,
                                    Calificacion: registro.calificación,
                                    correcta: false
                                })
                            }
                        }
                    }
                })
            })
    
            let result = [];
            resp = resp.sort(((a, b) => b.Calificacion - a.Calificacion))
            result = resp.reduce((h, { Calificacion, Examen, Usuario, correcta, reactivo }) => {
                return Object.assign(h, { [reactivo]: (h[reactivo] || []).concat({ Calificacion, Examen, Usuario, correcta, reactivo }) })
            }, [])
    
            let dat = Object.keys(result).map((key) => result[key]);
            let NoCalibrado = [];
            let calibrado = [];
            let filtrado = [];
            let filtrado2 = []
            let reactivosCalib = [];
            dat.map(examen => {
                if (examen.length >= 4) {
                    let tCorrectoG = examen.filter(reactivo => reactivo.correcta === true);
                    let q1 = (Math.floor((1 * (examen.length + 1)) / 4));
                    let q3 = (Math.floor((3 * (examen.length + 1)) / 4));
                    let dataq1 = examen.slice(0, q1)
                    let dataq3 = examen.slice(q3, examen.length)
                    let tCorrectoPSG = dataq1.filter(reactivo => reactivo.correcta === true);
                    let tCorrectoPGI = dataq3.filter(reactivo => reactivo.correcta === true);
                    let GD = (tCorrectoG.length / examen.length) * 100
                    let PSG = (tCorrectoPSG.length / dataq1.length) * 100
                    let PGI = (tCorrectoPGI.length / dataq3.length) * 100
                    let PD = PSG - PGI
                    let ND = 0;
                    let RD = 0;
                    if (GD >= 0 && GD <= 76.92) {
                        ND = ((0.3 * GD) / 100);
                    } else {
                        ND = ((100 - GD) / 100);
                    }
                    if (PD === 0 && ND === 0) {
                        RD = 0
                    } else {
                        RD = (PD / 100) / ND
                    }
                    if (RD < 1) {
                        filtrado = reactivos.filter(reactivo => reactivo._id === examen[0].reactivo);
                        NoCalibrado.push(filtrado)
                    } else {
                        filtrado2 = reactivos.filter(reactivo => reactivo._id === examen[0].reactivo);
                        calibrado.push(filtrado2)
                    }
                }
            })
            reactivosCalib = {
                calibrado,
                NoCalibrado
            }
            setLoading(true);
            if ((resp.length > 0) && (calibrado.length > 0 || NoCalibrado.length > 0) && loading === true) {
                await axios.put(`api/reactivos/actualizar/datos`, reactivosCalib,
                    {
                        headers: { 'x-access-token': token }
                    });
            }
        }
    }

    const enviar = async e => {

       if(e){
         e.preventDefault(); 
       }
        
        const data = await calificar();
        try {
            const respuesta = await axios.put(`/api/respuestas/editar/${idRegistro}`, data,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.estado) {
               await calibrado();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.data.mensaje,
                    footer: respuesta.data.mensaje
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al registrar el examen.',
                footer: error
            });
        }
    };
    const iniciar = async e => {
        let terminacionPeriodo = new Date(fechaTerminacion);
        let inicioPeriodo = new Date(generales.fechaInicio);
        let horaActual = new Date(Date.now());
        if (horaActual < inicioPeriodo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `El periodo del examen inicia el ${format(inicioPeriodo, "MM/dd/yyyy h:mm a")}`,
                footer: 'Periodo de examen no iniciado'
            });
        } else if (horaActual > terminacionPeriodo) {
            var date = format(new Date(), "MM/dd/yyyy h:mm:s a");
            var date2 = format(Date.now() + duracion * 60000, "MM/dd/yyyy h:mm:s a");
            SetRegistro({ ...registro, estatus: 'terminado', fechaInicio: date, fechaFin: date2 })
            const respuesta = await axios.put(`/api/respuestas/editar/${idRegistro}`, registro,
                {
                    headers: { 'x-access-token': token }
                });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `El periodo del examen concluyo el  ${format(terminacionPeriodo, "MM/dd/yyyy h:mm a")}`,
                footer: 'Periodo de examen concluido'
            });
        } else {
            var date = format(new Date(), "MM/dd/yyyy h:mm:s a");
            var date2 = format(Date.now() + duracion * 60000, "MM/dd/yyyy h:mm:s a");
            SetRegistro({ ...registro, estatus: 'iniciado', fechaInicio: date, fechaFin: date2 })
            try {
                await axios.put(`/api/respuestas/${idRegistro}`, {
                    estatus: 'iniciado',
                    fechaInicio: date, fechaFin: date2
                },
                    {
                        headers: { 'x-access-token': token }
                    });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al iniciar el examen.',
                    footer: error
                });
            }
        }
    }


    return (

        <div className="container p-5">
            <h1 className="text-primary text-center my-4">{nombre}</h1>
            <div className="row justify-content-center">
                <div className="col-8 p-4 ">
                    <form id='formulario' onSubmit={enviar}>
                        <div className="row justify-content-center mb-4 mt-2">
                            <h4 className="col-md-5"><strong>Materia:</strong> {materia}</h4>
                            <h4 className="col-md-5 ml-4"><strong>Tema: </strong>{tema}</h4>
                        </div>
                        {(estatus === 'pendiente') &&
                            <div>

                                <div className="d-flex justify-content-end">
                                    <p className="text-black">Duración: {hora}</p>
                                </div>
                                <div className="d-flex justify-content-center p-4">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg my-4"
                                        onClick={(e) => iniciar(e)}
                                    >
                                        Iniciar
                                    </button>

                                </div>
                                <div className="d-flex justify-content-center">
                                    <p className="text-danger">Una vez iniciado el examen el tiempo comenzara a transcurrir.</p>
                                </div>
                            </div>
                        }
                        {(estatus === 'iniciado') &&
                            datos.map((dato, i) => {
                                let op = [];
                                let lista = [];
                                {
                                    op.push(dato.opcionCorrecta, dato.opcionIncorrecta1, dato.opcionIncorrecta2, dato.opcionIncorrecta3);
                                    let rand = Math.random() - 0.5;
                                    lista = op.sort(function () { return rand });
                                }
                                return <div key={dato._id}>
                                    {
                                        (estatus === 'iniciado') && i === 0 && duracion > 0 &&
                                        <div className="d-flex justify-content-end py-4">
                                            <h5>
                                                <strong>
                                                    <Temp time={duracion * 60}
                                                        fechaInicio={fechaInicio}
                                                        fechaFin={fechaFin}
                                                        onComplete={enviar}
                                                    />
                                                </strong>
                                            </h5>
                                        </div>
                                    }
                                    {(estatus === 'iniciado') &&

                                        <div>
                                            <p><strong>{dato.pregunta}</strong></p>
                                            <MathJax.Provider>
                                                <div >
                                                    <p><MathJax.Node formula={dato.formula.formula} /></p>
                                                </div>
                                            </MathJax.Provider>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" onClick={clic} type="radio" id={lista[0]} name={dato._id} value={lista[0]._id} />
                                                <p>{lista[0].texto}</p>
                                                <InlineMath>{lista[0].formula}</InlineMath>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" onClick={clic} type="radio" id={lista[1]} name={dato._id} value={lista[1]._id} />
                                                <p>{lista[1].texto}</p>
                                                <InlineMath>{lista[1].formula}</InlineMath>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" onClick={clic} type="radio" id={lista[2]} name={dato._id} value={lista[2]._id} />
                                                <p>{lista[2].texto}</p>
                                                <InlineMath>{lista[2].formula}</InlineMath>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" onClick={clic} type="radio" id={lista[3]} name={dato._id} value={lista[3]._id} />
                                                <p>{lista[3].texto}</p>
                                                <InlineMath>{lista[3].formula}</InlineMath>
                                            </div>
                                        </div>
                                    }
                                </div>
                            })
                        }
                        {(estatus === 'iniciado') &&
                            <div className="float-right col-md-6 my-4">
                                <hr></hr>
                                <button
                                    id="buttonSubmit"
                                    type="submit"
                                    className="btn btn-primary ms-3"
                                >
                                    Enviar
                                </button>
                            </div>
                        }
                        {
                            (estatus === 'terminado') &&
                            <div className="mt-5">
                                <h1>TU CALIFICACIÓN ES DE: {<strong>{calificación}</strong>}</h1>
                                <div className="p-4">
                                    <h5><strong>Fecha de inicio: </strong>{fechaInicio}</h5>
                                    <h5><strong>Fecha de termino: </strong>{fechaFin}</h5>
                                </div>
                            </div>
                        }
                        {
                            tiempo &&
                            document.getElementById('buttonSubmit').click()
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}