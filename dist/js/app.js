import { obtenerDoc,consulta} from "./fbmanifeswebpack.js";
import { forceLogout } from "./sesion.js";

// #1. CARGAR DATOS DE LA TARJETA =====================================
let cardId; //Id de la tarjeta del cliente
let onlyTrx = false;
let cardDisabled = false;
    // #1.1. Leer Id URL --------------
    let urlId = new URLSearchParams(location.search)
    if(urlId.size > 0){
        urlId.forEach((urlValue,urlKey)=>{
            if(urlKey == 'card'){
                cardId = urlValue
                getCardData()
            }
            else if(urlKey == 'trx_card'){
                document.querySelector('.btn-inicio').setAttribute('href',`../?card=${urlValue}`);
                onlyTrx = true;
                cardId = urlValue;
                getCardData()
            }            
        })
    }
    else if(urlId.size <= 0){
        alert('Error de sesion')
        forceLogout()
    }
// console.log(res);
//Fetching de datos de la Tarjeta
async function getCardData(){
    let resCardData = await obtenerDoc('cards',cardId);
    console.log(resCardData.data())
    resCardData.data() == undefined ?errorSesion() : '' ;

    resCardData.data().status == false ? cardDisabled = true : '' ;
    // console.log(resCardData.data())

    if(!cardDisabled){
        if(onlyTrx == false){
            if(resCardData.data()){
                erasePlaceHolder()
                insertCardDataDOM(resCardData.data());
            }
            else if(!resCardData.data()){
                noDataMgs()
            }          
        }
        else if(onlyTrx == true){
            loadAllTrx();
        }
    }
    else if(cardDisabled){
        console.log('tarjeta Desactivada');
        document.querySelector('.card-active-time').textContent = 'Tarjeta Desactivada';
        document.querySelector('.no-item-found').innerHTML = `
            <h3 class="fs-5 pt-3 text-light">Esta tarrjeta ha sida desactivada</h3>
            <p>Contacte con el administrador al +240 555 712 824 para mas informacion.</p>
            <p>Haz clic en el icono de whatsapp que esta mas abajo</p>
        `
        noDataMgs()
    }
    
}
//Borrar Los Place Holder
function erasePlaceHolder(){
    document.querySelectorAll('.inputstyle').forEach(e=>{
        e.classList.remove('d-none')
    });
}
//Insertar Datos de la tarjeta en el DOM
function insertCardDataDOM(data){
    // console.log(data)
    // console.log(data)
    let {totalSalde,cardType,cardNumber,cardHolderName,cardCcv,cardExpDate,activeTime} = data;

    document.querySelector('.card-active-time').textContent = activeTime;
    document.querySelector('#salde').value = `${totalSalde},0 XAF`;
    if(cardType == 'mc'){
        document.querySelector('.logo-card-mc').classList.remove('d-none');
        document.querySelector('.card-logo-load-efx').classList.add('d-none');
    }
    else if(cardType == 'visa'){
        document.querySelector('.logo-card-visa').classList.remove('d-none');
        document.querySelector('.card-logo-load-efx').classList.add('d-none');
    }
    console.log(cardHolderName)
    document.querySelector('#cardName').value = cardHolderName;
    document.querySelector('#cardNumber').value = cardNumber;
    document.querySelector('#salde').value = `${formatNumbWithPoint(totalSalde)}.0 XAF`;
    document.querySelector('#expiry').value = cardExpDate;
    document.querySelector('#cvv').value = cardCcv;

    loadAllTrx()
}

async function loadAllTrx() {
    let resGetAllTrx = await consulta({cardId:cardId},'transactions-history');
    let accordionComp = '';
    let trxNums = [] //Agrupar los numeros de transacciones sin ordenar
    let trxNumsOrder; //Agrupar los numeros de transacciones ordenados
    let trxDatas = []//Guardar los Datos de Trx

    resGetAllTrx.forEach(getTrx=>{
        // console.log(getTrx.data())
        trxNums.push(Number(getTrx.data().numbTx))//agregar numb trx
        trxDatas.push(getTrx.data())//agregar datos de trasaccion
    });

    //Ordenar los Numbs de trx
    trxNumsOrder = orderNumbs(trxNums);
    // console.log(trxNumsOrder)

    //Insertar los datos en order inverso
    if(trxNumsOrder.length > 0){
        // console.log('fase 1')
        for(let i = trxNumsOrder.length - 1;i>=0;i--){
            trxDatas.forEach(data=>{
                if(trxNumsOrder[i] == data.numbTx){
                    // console.log('fase 2')
                    accordionComp += getAccordionItem(data,i);
                }
            })
        }
    }    
    // console.log(accordionComp)
    if(trxNumsOrder.length > 10 && !onlyTrx){
        //Habilitar Btn "Mis Trasnsacciones"
        document.querySelector('#my-trx').setAttribute('href',`./trx/?trx_card=${cardId}`);
        document.querySelector('#my-trx').classList.remove('disabled','d-none');
    }
    document.querySelector('.container-acordion-items').innerHTML = accordionComp;
    
}

// FUNCIONES ================================================
    function formatNumbWithPoint(numero, locale = 'es-ES') {
        // console.log(numero)
        // Intentamos convertir la entrada a un número
        const num = Number(numero);
    
        // Verificamos si la conversión resultó en un número válido
        if (isNaN(num)) {
        console.warn(`"${numero}" no es un número válido y no puede ser formateado.`);
        return ''; // Retorna una cadena vacía para entradas no válidas
        }
        // 'es-ES' usa el punto como separador de miles y la coma como separador decimal.
        // 'en-US' usa la coma como separador de miles y el punto como separador decimal.
        // Puedes cambiar el 'locale' según tus necesidades.
        try {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 0, // Asegura que no haya decimales si el número es entero
            maximumFractionDigits: 20 // Permite mostrar decimales si existen
        }).format(num);
        } catch (error) {
        console.error(`Error al formatear el número con el locale "${locale}":`, error);
        return num.toString(); // En caso de error, retorna el número como cadena sin formato
        }
    }
    function getAccordionItem(itemData,i){
        let {timeTransaction,statusPayment,storeName,totalPaid,numbTx,idTX} = itemData;
        let accordion = `
            <div class="accordion-item">
                            <h2 class="accordion-header" id="heading-${i}">                    
                                <button class="accordion-button text-light bg-color" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="true" aria-controls="collapseOne">                      

                                    <!-- sin transaction -->
                                    <div class="d-none">
                                        <h3 class="fs-5 pt-3 text-light">No has realizado ningun pago todavia</h3>
                                        <p>
                                            <small>
                                                Todos los pagos que realices con tu tarjeta, o con cualquier metodo de pago alternativo al que asocies tu tarjeta, apareceran aqui
                                            </small>
                                        </p>
                                    </div>

                                    <!-- Header-Titulo de previsializacion -->
                                    <div class="">  
                                        <span>Trx Nº: ${numbTx}</span>                                      
                                        <span class="text-${statusPayment=="1"?"success":"danger"} ms-2 p-1">${statusPayment=="1"?"Completado":"Pendiente"}</span> 
                                    </div>

                                </button>
                            </h2>

                            <!-- datos inyectables de la db -->
                            <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" data-bs-parent="#accordionExample">
                
                                <div class="accordion-body">

                                    <!-- id transaction -->
                                    <small class="text-warning">Id de Transaccion</small>
                                    <p class="text-light">
                                    ${idTX}
                                    </p>

                                    <span class="text-warning">${timeTransaction.split('T')[0]} | ${timeTransaction.split('T')[1]} </span>

                                    <div class="d-flex justify-content-around gap-5 mt-3">
                                        <p>${storeName} - Pago ${statusPayment=="1"?"Completado":"Pendiente"} </p>
                                        <p class="text-danger fw-bold">- ${formatNumbWithPoint(totalPaid)} XAF </p>
                                    </div> 

                                    <!-- Note: -->
                                    <small class="text-warning">Nota:</small><br>
                                    <p class="text-light">
                                        <!-- good -->
                                        ${statusPayment==1?` Su pago de -${formatNumbWithPoint(totalPaid)} XAF se ha realizado correctamente en la plataforma ${storeName}.`:''}
                                       
                                    </p>
                                    <p class="text-danger">
                                        <!-- pending -->
                                        ${statusPayment==2?'Debido a retrasos bancarios temporales, su saldo podria tardar unos minutos, o a veces horas, en actualizarse. Vuelva pronto.':''}
                                    </p>
                                </div>
                            </div>
                </div>
        `;

        return accordion;
    }

//Ordenar Numeros de Trx
function orderNumbs(arr) {
    const arrayCopia = [...arr];
    return arrayCopia.sort((a, b) => a-b);
}

function noDataMgs(){
    document.querySelector('.card-logo-load-efx').classList.add('d-none');
    document.querySelector('.no-item-found').classList.remove('d-none');
}