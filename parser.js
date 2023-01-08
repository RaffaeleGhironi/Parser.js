/*
parser.js v1.0
Raffaele Ghironi 2020
http://raffaeleghironi.it

Inserire sul file config.json i dati relativi ai due inverter da interrogare
- Id del bus 485
- Serial Number
- IP del Datalogger
- Path della pagina del datalogger con i dati da leggere
*/
'use strict';
const fs = require('fs');
const http = require('http');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

console.log ("\n----------------------- START -------------\n");
console.log ("parser.js v1.0 ...");
console.log ( "Leggo il file config...");


let data;
try {
    data = fs.readFileSync('config.json');
} catch (err) {
    console.log("Errore nella lettura del file di confiurazione");
    return
}
let config = JSON.parse(data);

let sn_1=config.serialnumber_1;
let sn_2=config.serialnumber_2;
let id_1=config.id1;
let id_2=config.id2;
let ip =config.ip;
let path=config.path;

console.log ( "OK ...");


let req = http.get("http://"+ip+path+"", function(res) {
    let data = '';
    res.on('data', function(stream) {
        data += stream;
    });
    res.on('end', function(){
        parser.parseString(data, function(error, result) {
            if(error === null) { 

                let string=JSON.stringify(result);

                let postart_ser1=string.search(sn_1);
                let postart_ser2=string.search(sn_2);

                let inverter1_string=string.substr(postart_ser1,postart_ser2);
                let inverter2_string=string.substr(postart_ser2,);
               
                console.log("\n----------- STATI -------------\n");
                let stato =leggi_stato(string,id_1);
                console.log('Stato Inverter id '+ id_1 + " = "+ stato);
                stato =leggi_stato(string,id_2);
                console.log('Stato Inverter id '+ id_2 + " = "+ stato);
                console.log('*****');
                console.log('ID '+id_1 +' ---> Serial number = '+sn_1);
                console.log('ID '+id_2 +' ---> Serial number = '+sn_2);
                
                console.log("\n----------- DATI -------------\n");
                let testo='';
                let dato_1 ='';
                let dato_2 ='';
                let dato_t ='';
                let css='';

                let date_ob = new Date();
                console.log('Data e ora \(del pc\) = '+date_ob.toLocaleString()+'\n');

                testo='m103_1_W';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'W',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'W',0);
                
                dato_t=Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'W',0);

                console.log('*****');

                testo='m64061_1_DayWH';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'Wh',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'Wh',0);

                dato_t=Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'Wh',0);
                
                console.log('*****');

                testo='m64061_1_WeekWH';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'Wh',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'Wh',0);


                dato_t= Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'Wh',0);
                
                console.log('*****');

                testo='m64061_1_MonthWH';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'Wh',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'Wh',0);

                dato_t=Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'Wh',0);
                
                console.log('*****');

                testo='m64061_1_YearWH';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'Wh',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'Wh',0);

                dato_t=Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'Wh',0);
                
                console.log('*****');


                testo='m103_1_WH';
                dato_1 = leggi_dato(testo,inverter1_string);
                console.log('ID '+id_1 +' ---> '+ testo + ' = ' + dato_1);
                creacss(testo,id_1,convertidato(dato_1),'Wh',0);
                dato_2 = leggi_dato(testo,inverter2_string);
                console.log('ID '+id_2 +' ---> '+ testo + ' = ' + dato_2);
                creacss(testo,id_2,convertidato(dato_2),'Wh',0);

                dato_t=Number(dato_1)+Number(dato_2);
                creacss(testo,'t',convertidato(dato_t),'Wh',1);
                
                

                function leggi_dato(testo,inverter){
                    let postart=inverter.search(testo);
                    let value_start=postart+14+testo.length;                 
                    let string=inverter.substr(value_start);
                    let value_stop=string.indexOf('}');
                    let value= inverter.substr(value_start,value_stop);
                    
                    return value;
                }

                function leggi_stato(inverter,id){
                    let testo='ser.3.device.'+id+'.status';
                    let postart=inverter.search(testo);
                    let value_start=postart+11+testo.length;                 
                    let string=inverter.substr(value_start);
                    let value_stop=string.indexOf('\"');
                    let value= inverter.substr(value_start,value_stop);
                    
                    return value;
                }

                function creacss(testo,id,dato,um,ultimo){

                    css= css +'\n\.'+testo+'_'+id+' span \{display\: none\;\} \n\.'+testo+'_'+id+'\:after \{content: \''+dato+um+'\'\;\}';
                    
                    if (ultimo=1) {
                        try {
                            fs.writeFileSync('./css/dati.css', css, { mode: 0o755 });
                        } catch(err) {
                            console.error(err);
                        }
                        
                    }
                }

                function convertidato(dato){
                    dato =Number(dato);
                    dato = dato.toString(); 

                    if(dato.length>6){
                        dato = dato.split('',dato.length).reverse().join('').replace(/([0-9]{6})/g,'$1.');  
                        dato = dato.split('',dato.length).reverse().join(''); 
                        dato = dato+ ' M'; 
                        
                    } else if (dato.length>3) {
                        dato = dato.split('',dato.length).reverse().join('').replace(/([0-9]{3})/g,'$1.');  
                        dato = dato.split('',dato.length).reverse().join(''); 
                        if (dato[0]=='.') {
                            dato = dato.replace(/^.{1}/g, '');
                        } 
                        dato = dato+ ' K';
                    }

                    return dato;  
                }
            }
            else {
                console.log(error);
            }

            console.log("\n----------- FINE -------------\n");
        });
    });
});

