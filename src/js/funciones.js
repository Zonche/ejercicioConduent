const {ipcRenderer} = require('electron');

function leerArchivo(){
    ipcRenderer.send('leerArchivo','true');
}

ipcRenderer.on('ObtenerNombre',(event,data)=>{
    $('#txtPath').text = data;
});

ipcRenderer.on('ObtencionDatos',(event,data)=>{
    console.log(data);
});

