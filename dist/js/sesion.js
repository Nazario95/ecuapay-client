import {getAuth, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { app } from "./fbmanifeswebpack.js";

const auth = getAuth(app);
const INACTIVITY_TIMEOUT = 3600000; // 1 hora en milisegundos
const LAST_ACTIVITY_KEY = 'activity';

// -------------------------------
// 1. Función para Logout Seguro
// -------------------------------
export async function forceLogout() {
    try {
        // A. Cerrar sesión en Firebase
        await signOut(auth);
        
        // B. Limpieza profunda
        localStorage.clear()
        sessionStorage.clear();
        
        // C. Redirigir con mensaje
        location.href = '../../';
        
    } catch (error) {
        console.error("Error en logout:", error);
        // Fallback: Limpieza básica
        localStorage.clear();
        location.href = '../../';
    }
}

// -------------------------------
// 2. Verificador de Inactividad
// -------------------------------
function checkInactivity() {
   // console.log('Hola de nuevo')
   const lastActivityTime = localStorage.getItem(LAST_ACTIVITY_KEY);
   const currentTime = new Date().getTime();

   if (lastActivityTime && (currentTime - parseInt(lastActivityTime)) > INACTIVITY_TIMEOUT) {
       // Sesión expirada (más de 1 hora sin actividad)
       alert('Tu sesión ha expirado por inactividad. Por favor, vuelve a iniciar sesión.');
       forceLogout()
   }
}

// -------------------------------
// 3. Listener de Estado de Firebase (Nuevo)
// -------------------------------
function setupAuthListener() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // El usuario no está autenticado en Firebase
            forceLogout()
        }
    });
}

// -------------------------------
// 4. Eventos de Actividad
// -------------------------------
const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
function setupActivityListeners() {
    activityEvents.forEach(event => {
        window.addEventListener(event, () => {
            localStorage.setItem(LAST_ACTIVITY_KEY, Date.now());
        }, { passive: true });
    });
}

// -------------------------------
// Inicialización
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // A. Configura listeners de actividad
    setupActivityListeners();
    
    // B. Inicia listener de Firebase
    setupAuthListener();
    
    // C. Verificación periódica de inactividad
    setInterval(checkInactivity, 60000); // Cada minuto
    
    // D. Verificar al cargar
    if (!localStorage.getItem(LAST_ACTIVITY_KEY)) {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now());
    }
});
