const {ipcRenderer} = require('electron');

function leerArchivo(){
    ipcRenderer.send('leerArchivo','true');
}

ipcRenderer.on('ObtenerNombre',(event,data)=>{
    console.log(data);
});

ipcRenderer.on('ObtencionDatos',(event,data)=>{
    console.log(data);
    procesoFillGrafica(data);
});

function procesoFillGrafica(data){
    var nombres = getNombres(datos);
    var calificaciones = getCalificaciones(datos);
    fillGrafica(nombres,calificaciones);
}

function serializacion(data){
    return JSON.parse(data.d);
}

function getCalificaciones(data){
    var calificaciones = new Array();
    for(var x=0;x < Object.keys(data).length;x++){
        calificaciones.push(data[x].Calificacion);
    }
    return calificaciones;
}
function getNombres(data){
    var nombres = new Array();
    for(var x=0;x < Object.keys(data).length;x++){
        var item = `${data[x].Nombres} ${data[x].ApellidoPaterno}`;
        nombres.push(item);
    }
    return nombres;
}

function fillGrafica(nombres,calificaciones){
    var canvas = document.getElementById('cvGrafica').getContext('2d');
    var grafica = new Chart(canvas,{
        type: 'bar',
        data: {
            labels: [nombres],
            datasets:[{
                label: 'Calificación',
                data: calificaciones,
                backgroundColor: '#ff0000',
                borderColor: '#ffffff',
                borderWidth:1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}