const {app , BrowserWindow, dialog,ipcMain} = require('electron');
function createWindow(){
    let win = new BrowserWindow({
        width: 800, 
        height:600,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8'
          }
        });
    win.loadFile('index.html');
    win.on('closed', () => {
        win = null;
    });
}

ipcMain.on('leerArchivo',(event,arg)=>{
    if(arg == 'true'){
        dialog.showOpenDialog(function(fileNames){
            if(fileNames === undefined){
                console.log('No seleccionó un archivo');
            }else{
                var data = lecturaArchivo(fileNames[0]);
                event.sender.send('ObtenerNombre',fileNames[0]);
                event.sender.send('ObtencionDatos',data);
            }
        })
    }
});

function lecturaArchivo(fileName){
    var xlsx = require('xlsx');
    var archivo = xlsx.readFile(fileName);
    var encabezados = archivo.SheetNames;
    var dataJSON = xlsx.utils.sheet_to_json(archivo.Sheets[encabezados[0]]);
    return dataJSON;
}

app.on('ready',createWindow);