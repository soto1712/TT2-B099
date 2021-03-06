import React, { useState } from 'react' //importamos react
import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";//importamos react-router-dom para enrutar
import { Link as RouterLink } from 'react-router-dom';//importamos react-router-dom para enrutar
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MuiListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FacebookIcon from '@material-ui/icons/Facebook';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Avatar from '@material-ui/core/Avatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import usedef from '../../img/usedef.png';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Description from '@material-ui/icons/Description';



const drawerWidth = 215; // ancho del cajón
// se usa Material Ui
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
    },
    // muestra la barra de prototipo 
    appBar: {
        // personalizamos la transición, 
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    //Personalizamos los botones de nuestro appBarr
    menuButton: {
        marginRight: theme.spacing(2),
        color: 'white',
    },//ocultamos elemento
    hide: {
        display: 'none',
    },// Este cajon de navegación, barra lateral que permitira el acceso a otras funcionalidades
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        }
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#132B40',
    },
    // Configuración del Header(encabezado)
    drawerHeader: {
        //Display flex nos ayuda a colocar esta sección como celdas para hacerla mas adaptable
        display: 'flex',
        alignItems: 'center',
        //nos permite hacer una adaptación automatica en el toolbar
        ...theme.mixins.toolbar,
        //alineamos los elementos en la parte de abajo
        justifyContent: 'flex-end',
    },
    toolbar: theme.mixins.toolbar,
     //personalizamos la transición de la etiqueta 
    content: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    }, //personalizamos la transición de la etiqueta 
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    //Reacomodamos los elementos una ves termine la transición de nuestra barra
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: '1px',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        marginLeft: '1px',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        align: 'center',
    },
    large2: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    color: {
        color: 'white',
        textDecoration: 'none',
    },
    iconcolor: {
        color: '#51B3EB',
    },
    facebook: {
        color: '#1D79F2',
    },
    youtube: {
        color: '#F20505',
    },
}));

const ListItem = withStyles({
    root: {
        "&$selected": {
            backgroundColor: "#0F528C",
        },
        "&$selected:hover": {
            backgroundColor: "#0F528C",
        },
        "&:hover": {
            backgroundColor: "132B40",
        }
    },
    selected: {}
})(MuiListItem);
 //se declara la función alumno la cual tendra tipo, nombre y foto, con use History recabamos la información, y con useStyles y useThemes personalizamos
export default function MenuAlumno({ tipo, nombre, Foto }) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    // para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('sesion');
        history.push(`/`);
    }
    //Acción que se debera hacer cuando demos un click abajo
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar className="bg-primary">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => setOpen(true)}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <NavLink className="navbar-brand font-weight-bold" to="/">
                            <h1 className="text-white">Su Logo</h1>
                        </NavLink>
                        <ListItem className="justify-content-end">
                            <form className="form-inline my-2 my-lg-0">
                                <button className="btn btn-secondary my-2 my-sm-0" onClick={cerrarSesion}>Cerrar sesión </button>
                            </form>
                        </ListItem>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={() => { setOpen(false) }}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon className={classes.color} /> : <ChevronRightIcon className={classes.color} />}
                        </IconButton>
                    </div>
                    <Divider />
                    <RouterLink to="/EditarPerfil">
                        <List component="nav" className="align-items-center">
                            <ListItem className="justify-content-center">
                                <Avatar alt="Remy Sharp" src={!Foto ? usedef : Foto} className={classes.large} />
                            </ListItem>
                        </List>
                    </RouterLink>
                    <Divider />
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader" className="text-secondary">
                                <p className="text-center">{nombre}  / {tipo}</p>
                            </ListSubheader>
                        }
                        className="text-secondary"
                    ></List>
                    <List>
                        <RouterLink to="/">
                            <ListItem button
                                selected={selectedIndex === 0}
                                onClick={(event) => handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <DashboardIcon className={classes.iconcolor} />
                                </ListItemIcon>
                                <ListItemText primary="DashBoard" className={classes.color}> </ListItemText>
                            </ListItem>
                        </RouterLink>
                        <RouterLink to="/examenes">
                            <ListItem button
                                selected={selectedIndex === 1}
                                onClick={(event) => handleListItemClick(event, 1)}
                            >
                                <ListItemIcon>
                                    <Description className={classes.iconcolor} />
                                </ListItemIcon>
                                <ListItemText primary="Examenes" className={classes.color}> </ListItemText>
                            </ListItem>
                        </RouterLink>
                    </List>
                    <Divider />
                    <div className="myfooter">
                        <List >
                            <ListItem>
                                <ListItemText className="text-center text-secondary" >
                                    
                                </ListItemText>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                </main>
            </div>
        </>
    )
}