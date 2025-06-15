import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {getFirestore,collection,getDocs,updateDoc, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const y_ = {
  apiKey: "AIzaSyA93zj_wLvpSH_6cKRff0P2XRmya8_uoh4",
  authDomain: "ecuapay-c9de7.firebaseapp.com",
  projectId: "ecuapay-c9de7",
  storageBucket: "ecuapay-c9de7.firebasestorage.app",
  messagingSenderId: "168812396551",
  appId: "1:168812396551:web:100d6cfa9c425eff802aa2",
  measurementId: "G-1Z287M5NJY"
};
// y_=> firebaseConfig
//xc => app
//bb => auth

const xc = initializeApp(y_);
const bb = getAuth(xc);
const db = getFirestore(xc)

//1. Cargar los Inputs en el DOM =================================
loadPage();
function loadPage(){
    document.querySelector('#code-html').innerHTML = `
        <h3>
            BIENVENIDO A <span class="lk-home">ECUAPAY.COM</span>, LA MEJOR PASARELA DE PAGO EN LINEA DE GUINEA ECUATORIAL
        </h3>
        <div>   
            <p>Acceda a su cuanta</p>    
            <div class="container">
                <div class="flex-container">               
                    <div class="form">                
                        <input class="input a" placeholder="Usuario" required="" type="text">
                            <span class="input-border"></span>               
                        </div>
                        <div class="form">                
                            <input class="input b" placeholder="Contraseña" required="" type="password">
                            <span class="input-border"></span>             
                        </div>
                    </div>                 
                </div> 

            <div class"err_oi"></div> 

            <div>
                <input type="button" value="Acceder" id="gt">
                <img class="d-none" src="./dist/svg/load.svg">
            </div>
        </div>
    `
}    
           
setTimeout(()=>{                   
    document.querySelector("#gt").addEventListener("click",()=>{
        let a = document.querySelector(".a").value //a=> usr
        let b = document.querySelector(".b").value // b=> psw        
        //Sanear Credenciales 
        vc(a,b)?ccm(a,b):''//sub_()// funcion de login ofuscada
    });                
    },2000
);

//2. SANEAR LOS INPUTS
    // #1. SANER INPUTS----------------
    //Sanear el input - Validacuion de Credenciales
    function vc(a, b) {
        let chke = false;//check usuario esta correcto
        let chkp = false; // ckeck psw esta correcto

        let isValid = true; // Variable para rastrear el estado general de la validación

        // --- Validación del Correo Electrónico (a) ---
        // a.1) Que no esté vacío el input
        if (a === null || a.trim() === '') {
            erroLogin('Error (Email): El campo de correo electrónico no puede estar vacío.');
            isValid = false;
        } 
        
        else if(a){
            // a.2) Que contenga caracteres inválidos o que no esté vacío (ya cubierto por .trim() y regex)
            // a.3) Que contenga arroba y tenga un formato básico de correo (regex)
            // a.4) Que tenga una extensión de correo válido (dominios comunes)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const dominiosValidos = ['gmail.com', 'icloud.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'outlook.es']; // Añade más si es necesario

            if (!emailRegex.test(a)) {
                erroLogin("Error (Email): El formato del correo electrónico no es válido (ej. usuario@dominio.com).");
                isValid = false;
            } 
            else {
                const dominio = a.substring(a.lastIndexOf('@') + 1).toLowerCase();
                if (!dominiosValidos.includes(dominio)) {
                    erroLogin(`Error (Email): El dominio '${dominio}' no es uno de los dominios de correo válidos.`);
                    isValid = false;
                }
                else{
                    chke = true;
                }
            }
        }

        // --- Validación de la Contraseña (b) ---
        
        // b.1) Que no esté vacío el input
        if(chke){
            if (b === null || b.trim() === '') {
                erroLogin("Error (Contraseña): El campo de contraseña no puede estar vacío.");
                isValid = false;
            } 
            else if(b){

                // b.2) Que tenga al menos 8 caracteres
                // b.3) Que cumpla los requisitos mínimos de seguridad:
                //  - Primera letra mayúscula
                //  - Que contenga número
                const tieneMayusculaInicial = /^[A-Z]/.test(b); // Empieza con mayúscula
                const tieneNumero = /[0-9]/.test(b); // Contiene al menos un dígito

                if (b.length < 8) {
                    erroLogin("Error (Contraseña): La contraseña debe tener al menos 8 caracteres.");
                    isValid = false;
                }
            else if (!tieneMayusculaInicial) {
                    erroLogin("Error (Contraseña): La contraseña debe comenzar con una letra mayúscula.");
                    isValid = false;
                }
                else if (!tieneNumero) {
                erroLogin("Error (Contraseña): La contraseña debe contener al menos un número.");
                    isValid = false;
                }
                else{
                    chkp = true;
                }           
            }
        }
        // --- Resultado Final ---
        if (isValid && chke && chkp) {
            // console.log('Todo bien')
            // console.log(isValid,chke,chkp)
            return true;
        } 
    }

//3. INCIAR LA SESION: Comprobar Credenciales =====================
    //funcion login ofuscada
    async function ccm(e,k){ //ccm=> funcion de login ;e => email ; k=>password        
        try {   
            // 3.1. Verificar Credenciales
                printMsgDom('info','Comprobando Credenciales...')
                const userCredential = await signInWithEmailAndPassword(bb, e, k);
                // console.log(userCredential)
                const user = userCredential.user;
                // console.log("Sesión de Firebase iniciada. UID:",  user.uid);
                // console.log("Email:", user.email);

            //3.2. Obtener Id del documento del cliente segun el correo
                let resGetEmail;
                try {
                    resGetEmail = await getDocs(query(collection(db,'clients',),  where('email', "==", user.email)));
                } 
                catch (error) {printMsgDom('err',error)}
                // console.log(resGetEmail);

                let idDocClient;
                resGetEmail.forEach(dataGetEmail =>{
                    // console.log(dataGetEmail.data());
                    let {email} = dataGetEmail.data();

                    if(email == user.email){
                        idDocClient = dataGetEmail.id;
                    }
                })

            //3.3. Verificar si exsite un registro del uid
                let chckUidFromServer;                
                try {
                    chckUidFromServer = await getDoc(doc(db,'clients',idDocClient));
                    let {uid} = chckUidFromServer.data();
                //3.3.1.No Existe registro de UID en el servidor, guardar informacion de nuevo dispositivo
                    if(!uid){
                        printMsgDom('info','Nuevo dispositivo detectado..')
                         try {
                            await updateDoc(doc(db,'clients',chckUidFromServer.id),{uid:user.uid});
                            //Crear Nuevo Finger Print
                            // let resCreateNeHash = await creatNewHash(chckUidFromServer.id);
                            // !resCreateNeHash ? console.log('continuamos'):console.log(resCreateNeHash)
                         } catch (error){printMsgDom('err',error)} 
                    }
                //3.3.2. Existe registro de UID en el servidor, verificar hash legitimo
                    else if(uid){
                        printMsgDom('info','Dispositivo ya verificado, chequeando acceso seguro...')
                        // let figerPrint = localStorage.getItem('figerPrint');
                        // let res =  await chkUidOrFinger('finger',chckUidFromServer.id,figerPrint);
                        // console.log(res)
                        sesionInfo(chckUidFromServer.id) 
                    }                    
                } 
                catch (error) {printMsgDom('err',error)}            
              
        } catch (error) {
            printMsgDom('err',error.code) 
        }
    }

//3. INICIAR SESION: Comprobar Datos unicos de sesion en dispositivo
// async function chkhash(uid,email){
//         printMsgDom('info','Verificando hash en el servidor...');

//         //0. Verificar Hash en Local
//         // if(localStorage.getItem(`device_fp_${uid}`)){

//         //     // El dispositivo ya esta registrado
//         // }
//         //a) Obtener Datos Unicos del dispositvo

//         //b) Hashear los Datos

//         //c) Guardar Hash en local

//         // d) Guardar Hash en remoto

       
//         // console.log(deviceHash, deviceData);
        
//         // console.log(currentFingerprintHash[1])
//         //4. Guardar el Hash en Local
//         // localStorage.setItem(`device_fp_${user.uid}`, currentFingerprintHash[0]);
//         // localStorage.setItem(`device_fp_${user.uid}`, deviceHash);
        
//         //5. Guardar en remoto
//         //5.1. Buscar doc que coincida con el correo introducido
//         printMsgDom('info','Comporbando Has remoto')
//         let idClientDoc;
//         let getIdUsrDoc = await getDocs(query(collection(db,'clients'),  where('email', "==", `${e}`))); 
        
//         if (getIdUsrDoc.empty){alert("Cliente no encontrado")}
//         else{
//             // const clientDoc = querySnapshot.docs[0];
//             // const clientId = clientDoc.id;
//                 getIdUsrDoc.forEach(usrData => {
//                 // console.log(usrData.id);
//                 // console.log(usrData.data());
               
//                 idClientDoc = usrData.id;                    
//             });
//         }
        
//         // getIdUsrDoc.forEach(usrData => {
//             console.log(idClientDoc);
//             console.log(user.uid);
//             console.log(deviceHash);
//             console.log(deviceData);
//         //     // console.log(usrData.data());
//         //     idClientDoc = usrData.id;                    
//         // })
//         //5.2. agregar el user.uid en el documento del cliente segun su correo
//         printMsgDom('info','Agregando ID de Cliente a su archivo remoto')
//         await updateDoc(doc(db,'clients',idClientDoc),{uid:user.uid});
//         // await setDoc(doc(db,`clients/${idClientDoc}/devices`, currentFingerprintHash[0]), currentFingerprintHash[1])
//         // await setDoc(doc(db, `clients/${idClientDoc}/devices`, deviceHash), deviceData)
//         // await setDoc(doc(db, `clients/${idClientDoc}/`,'devices'), deviceData);
//         printMsgDom('info','Agrenado Finger Print')
//         await setDoc(doc(db, 'clients', idClientDoc, 'devices', deviceHash), {
//             fingerprint: deviceData,
//             createdAt: new Date().toISOString(),
//             // otros campos...
//           })
//           printMsgDom('info','Sesion segura inicializada. Bienvenido Nazario');
//           setTimeout(()=>{location.href='../card'},2000);
//         //5.3. Agregar una subcoleccion de "devices"
//         //5.4. Agregar los fingerPrint, segun el numero de dispositivos al que accede:
//             //5.4.1.nombre del doc "fingerPrintHash"
//             //5.4.2: datos del doc: {todo lo obtenido en la funcion "registerDeviceFingerprint" 
//         //6. Redireccionar a la página protegida
//         // window.location.href = '/dashboard.html';

// }

//Guardar Hash de nuevo dispositivo en servidor
// async function creatNewHash(docUserId){
//     let anyError = false;

//     console.log(docUserId)
//     printMsgDom('info','Creando nuevo hash de sesion...');
// // 1. Obtener hash creado en localStorage
//     const fingerprint = localStorage.getItem('figerPrint');
  
// // 2. Combinar Hash con info basica del dispositivo
//     const deviceInfo = {
//         fingerprint: fingerprint,
//         browser: client.getBrowser(),
//         os: client.getOS(),
//         screen: `${window.screen.width}x${window.screen.height}`,
//         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
//     };
//     //   console.log(deviceInfo)
//     printMsgDom('info',`huella unica: ${fingerprint}`);
// //3. Guardar info en el servidor
//     try {        
//          let res = await getDoc(doc(db,'clients',docUserId));
//          console.log(res)
//          console.log(res.data())
         
//     //3.1.1.No existe dispositivo registrado antes
//          if(!res.data().devices){
//             await updateDoc(doc(db,'clients',docUserId),{devices:[deviceInfo]});
//          }
//     //3.1.2.agregar nuevo disposito a la lista existente
//          else{
//             let devices = res.data().devices;
//             let newDavice = true;
//             devices.forEach(device =>{
//                 if(device.fingerprint == fingerprint){
//                     newDavice = false;                    
//                 }
//             });

//             if(newDavice){
//                 printMsgDom('info','Guardando nuevo dispostivo en el Servidor');
//                 try {
//                     devices.push(deviceInfo);
//                     printMsgDom('info',`${JSON.stringify(devices)}`);
//                     await updateDoc(doc(db,'clients',docUserId),{devices:devices});
//                 } catch (error) {
//                     console.log(error);
//                     anyError = error;   
//                 }
//             }
//             else if(!newDavice){printMsgDom('info','Dispositivo existente en servidor');}            
//          }
//          // 
//     } catch (error) {
//         console.log(error)
//         anyError = error;        
//     }

//     return anyError;
// }
// FUNCIONES ================================================================

//1. Verificar uid o finger Print Number en el servidor
// async function chkUidOrFinger(chk,idDoc,dataToCompare){
//     let res = false
//     if(chk == 'uid'){
//         try {
//             let getRes = await getDoc(doc(db,'clients',idDoc))
//             if(getRes.data().uid == dataToCompare){res=true}
//         } catch (error){console.log(error);}
//     }
//     if(chk == 'finger'){
//         try {
//             let getRes = await getDoc(doc(db,'clients',idDoc))
//             if(getRes.data().devices){
//                 const devices = getRes.data().devices;
//                 devices.forEach(device => {
//                     device.fingerprint == dataToCompare ? res = true : ''
//                 })
//             }
//         } catch (error){console.log(error);}
//     }
//     return res
// }

//2. Mostrar acciones que estan realizando para iniciar la sesion
    function printMsgDom(type,msg){
        if(type=='info'){
            document.querySelector('.errors').textContent = msg
        }
        if(type=='err'){
            if(msg=='auth/invalid-credential'){
                document.querySelector('.errors').textContent = 'Correo o Contraseña invalidos'
            }
            if(msg=='auth/user-disabled'){
                document.querySelector('.errors').textContent = 'Cuenta desabilitada, contacte al administrador'
            }
            else{
                document.querySelector('.errors').textContent = msg
            }
        }
    }
//3. Mostrar Alert de datos errones en el input
    function erroLogin(msg){
        alert(msg)
    }

//4. Crea informacion de sesion
   async function sesionInfo(id){
        // Obtener ID de la Tarjeta del cliente
        try {
            let res = await getDocs(query(collection(db,'cards'),  where('clientId', "==", id)));
            res.forEach(card=>{
                localStorage.clear()
                localStorage.setItem('card',card.id);
                localStorage.getItem('card') ? location.href = '../../?login=true':printMsgDom('err','Error al iniciar sesion, contacte con el administrador'); 
            });
        } catch (error) {return error}         
    }