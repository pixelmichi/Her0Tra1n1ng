// ==========================================================================
// 1. BASE DE DATOS DE MISIONES DE S.H.I.E.L.D. (6 Proyectos Obligatorios)
// ==========================================================================
const ejerciciosFijosBase = [
    {
        id: "mision-hombros",
        nombre: "PROYECTO: PROPULSORES DE HOMBROS (Flexiones inclinadas)",
        permanente: false, completada: false, series: 3, reps: 8,
        descripcion: "Apoye las manos en una superficie elevada estable (como la mesa alta o el respaldo del sofá). Mantenga el cuerpo rígido como una tabla, apriete el abdomen y baje el pecho con los codos hacia atrás en diagonal (no abiertos en cruz). Empuje con fuerza para volver arriba."
    },
    {
        id: "mision-fondos",
        nombre: "PROYECTO: DESPLIEGUE EN FONDOS (Fondos en silla)",
        permanente: false, completada: false, series: 3, reps: 8,
        descripcion: "Apoye las manos en el borde de una silla muy estable, coloque los pies recogidos apoyados firmemente en el suelo con rodillas flexionadas a 90 grados. Descienda la cadera en vertical rozando el borde de la silla y vuelva a subir extendiendo los brazos usando la fuerza de sus tríceps."
    },
    {
        id: "mision-dominadas",
        nombre: "PROYECTO: TRACCIÓN OPERATIVA (Dominadas en mesa)",
        permanente: false, completada: false, series: 3, reps: 6,
        descripcion: "Colóquese tumbada debajo de una mesa resistente. Sujete fuertemente el borde exterior de la mesa con ambas manos, mantenga los talones apoyados y el cuerpo completamente rígido como un bloque. Tire con los brazos llevando el pecho hacia el borde de la mesa de forma controlada."
    },
    {
        id: "mision-granjero",
        nombre: "PROTOCOLO TÁCTICO: PASEO DEL GRANJERO (Mochilas cargadas)",
        permanente: false, completada: false, series: 3, reps: 60,
        descripcion: "Cargue dos mochilas o bolsas resistentes con libros o peso equilibrado. Sujete una con cada mano, mantenga los hombros hacia atrás, la espalda completamente recta y el abdomen muy firme. Camine de forma pausada y controlada durante 1 minuto continuo sin perder la postura ni soltar el peso."
    },
    {
        id: "mision-piernas",
        nombre: "PROYECTO: PROPULSIÓN POSTERIOR (Sentadillas a la caja)",
        permanente: false, completada: false, series: 3, reps: 10,
        descripcion: "Colóquese delante de una silla estable. Con los pies separados a la anchura de los hombros, baje la cadera como si fuera a sentarse, tocando ligeramente el asiento con el glúteo sin desplomarse. Vuelva a subir inmediatamente haciendo fuerza con las piernas sin impulsarse."
    },
    {
        id: "mision-core",
        nombre: "PROTOCOLO: ESCUDO KINETICO (Plancha abdominal)",
        permanente: false, completada: false, series: 3, reps: 20,
        descripcion: "Apoye los antebrazos y las rodillas en el suelo. Apriete el abdomen y los glúteos con fuerza para que su cuerpo forme una línea recta perfecta desde la cabeza a las rodillas. Respire de forma controlada aguantando los segundos fijados."
    }
];

const catalogoMisionesOpcionales = {
    "mision-frog": {
        id: "mision-frog",
        nombre: "PROYECTO INTERMEDIO: ENLACE DE EQUILIBRIO (Muñecas y Frog Stand)",
        permanente: false, completada: false, series: 3, reps: 15,
        descripcion: "Fase de preparación de muñecas y gravedad. Apoye las manos firmemente en una textura segura o esterilla en el suelo. Coloque las rodillas apoyadas por fuera de sus codos e inclínate hacia delante de forma lenta. Al principio busque solo sentir el peso en los brazos sin levantar los pies del suelo."
    }
};

const baseDeRetosJarvis = [
    "RETO TÁCTICO: Ejecuta 3 repeticiones en cámara súper lenta para poner a prueba tu control.",
    "RETO TÁCTICO: Mantén la posición más baja de tu sentadilla durante 3 segundos en cada repetición.",
    "RETO TÁCTICO: Descansa 15 segundos menos de lo habitual entre tus series de calistenia hoy.",
    "RETO TÁCTICO: Concéntrate al máximo en mantener el abdomen apretado en cada movimiento de fuerza.",
    "RETO TÁCTICO: Haz tu sesión de entrenamiento escuchando tu banda sonora motivadora favorita."
];

let levelUpDeHoy = null;

// ==========================================================================
// 2. INICIALIZACIÓN, MARCADORES Y CONTROL DE PANTALLAS
// ==========================================================================
window.addEventListener('load', () => {
    if (!localStorage.getItem('shield_misiones')) {
        localStorage.setItem('shield_misiones', JSON.stringify(ejerciciosFijosBase));
    }
    if (!localStorage.getItem('shield_dias_activo_streak')) {
        localStorage.setItem('shield_dias_activo_streak', '0'); 
    }
    if (!localStorage.getItem('shield_pasos_hoy')) {
        localStorage.setItem('shield_pasos_hoy', '0');
    }
    if (!localStorage.getItem('shield_ultima_fecha_consolidada')) {
        localStorage.setItem('shield_ultima_fecha_consolidada', '');
    }

    actualizarMarcadorVisualDias();
    actualizarPasosVisuales(); 
    cargarMisionesDeBaseDatos();
    controlarMisionesAleatoriasDiarias();
});

function actualizarMarcadorVisualDias() {
    const elementoNumero = document.getElementById('active-streak-number');
    const diasGuardados = localStorage.getItem('shield_dias_activo_streak') || '0';
    if (elementoNumero) {
        elementoNumero.textContent = diasGuardados;
    }
}

function actualizarPasosVisuales() {
    const elementoRosa = document.getElementById('pink-steps-number');
    const pasosGuardados = localStorage.getItem('shield_pasos_hoy') || '0';
    if (elementoRosa) {
        elementoRosa.textContent = pasosGuardados;
    }
}

function sincronizarPasosPulseraManual() {
    const entrada = prompt("CONEXIÓN PULSERA: Introduzca el conteo de pasos actual detectado por su pulsera de actividad:", localStorage.getItem('shield_pasos_hoy'));
    if (entrada !== null) {
        const pasosNum = parseInt(entrada) || 0;
        if (pasosNum >= 0) {
            localStorage.setItem('shield_pasos_hoy', pasosNum.toString());
            actualizarPasosVisuales();
        }
    }
}

function cambiarPantalla(idPantallaDestino, botonPulsado) {
    const pantallas = document.querySelectorAll('.app-screen');
    pantallas.forEach(p => p.classList.remove('active'));
    const destino = document.getElementById(idPantallaDestino);
    if (destino) destino.classList.add('active');
    const botones = document.querySelectorAll('.nav-slot');
    botones.forEach(b => b.classList.remove('active'));
    botonPulsado.classList.add('active');
}

function abrirConfigMisiones() { const m = document.getElementById('mission-modal-overlay'); if (m) m.classList.add('open'); }
function cerrarConfigMisiones() { const m = document.getElementById('mission-modal-overlay'); if (m) m.classList.remove('open'); }
function cerrarDetallesMision() { const m = document.getElementById('details-modal-overlay'); if (m) m.classList.remove('open'); }

// ==========================================================================
// 3. GESTIÓN DEL CATÁLOGO (AÑADIR / QUITAR FROG STAND)
// ==========================================================================
function toggleMisionCatalogo(idMisionCatalogo) {
    let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    const existe = misiones.some(m => m.id === idMisionCatalogo);

    if (existe) {
        misiones = misiones.filter(m => m.id !== idMisionCatalogo);
        const tarjeta = document.getElementById(idMisionCatalogo);
        if (tarjeta) tarjeta.remove();
    } else {
        const nuevaMision = { ...catalogoMisionesOpcionales[idMisionCatalogo] };
        misiones.push(nuevaMision);
    }
    localStorage.setItem('shield_misiones', JSON.stringify(misiones));
    actualizarBotonesCatalogoVisual();
    cargarMisionesDeBaseDatos();
}

function actualizarBotonesCatalogoVisual() {
    let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    const btn = document.getElementById("btn-catalog-frog");
    if (btn) {
        if (misiones.some(m => m.id === "mision-frog")) {
            btn.textContent = "RETIRAR"; btn.style.borderColor = "#ff3333"; btn.style.color = "#ff3333";
        } else {
            btn.textContent = "DESPLEGAR"; btn.style.borderColor = "#333"; btn.style.color = "#666";
        }
    }
}

// ==========================================================================
// 4. CONTROL DE VISUALIZACIÓN DE MISIONES AUTOMÁTICO (DÍA SÍ, DÍA NO)
// ==========================================================================
function cargarMisionesDeBaseDatos() {
    const zone = document.querySelector('.scroll-mission-zone');
    const botoneraFija = document.getElementById('misiones-botonera-fija');
    
    if (!zone || !botoneraFija) return;
    
    zone.innerHTML = "";         
    botoneraFija.innerHTML = ""; 
    
    const marcaTiempoGuardada = localStorage.getItem('shield_ultima_fecha_consolidada');
    let estadoJornada = "ENTRENAR"; 

    if (marcaTiempoGuardada) {
        const momentoEnvio = new Date(parseInt(marcaTiempoGuardada));
        const ahora = new Date();

        const mañanaInicio = new Date(momentoEnvio);
        mañanaInicio.setDate(momentoEnvio.getDate() + 1);
        mañanaInicio.setHours(0, 0, 0, 0);

        const pasadoMañanaDesbloqueo = new Date(momentoEnvio);
        pasadoMañanaDesbloqueo.setDate(momentoEnvio.getDate() + 2);
        pasadoMañanaDesbloqueo.setHours(0, 0, 0, 0);

        if (ahora.toDateString() === momentoEnvio.toDateString()) {
            estadoJornada = "COMPLETADO"; 
        } else if (ahora >= mañanaInicio && ahora < pasadoMañanaDesbloqueo) {
            estadoJornada = "DESCANSO"; 
        }
    }

    if (estadoJornada === "COMPLETADO") {
        botoneraFija.innerHTML = `<p style="font-family: sans-serif !important; font-size: 0.85rem; color: #00ff66; text-shadow: 0 0 8px rgba(0, 255, 102, 0.4); text-align: center; font-weight: bold; margin-bottom: 25px; width: 100%;">INFORME DIARIO COMPLETADO</p>`;
        return;
    }

    if (estadoJornada === "ENTRENAR") {
        let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
        misiones.forEach(mision => {
            const nuevaTarjeta = document.createElement('div');
            nuevaTarjeta.id = mision.id;
            nuevaTarjeta.className = `mission-card scroll-blue ${mision.completada ? 'checked-active' : ''}`;
            nuevaTarjeta.onclick = (e) => { 
                if (!e.target.classList.contains('custom-checkbox')) abrirDetallesMision(mision.id); 
            };

            const textoReps = mision.series ? ` - ${mision.series}x${mision.reps}` : '';
            nuevaTarjeta.innerHTML = `
                <div class="mission-info">
                    <span class="mission-tag">PROYECTO ACTIVO${textoReps}</span>
                    <p class="mission-text">${mision.nombre}</p>
                </div>
                <button class="custom-checkbox" onclick="toggleCheckDinámica('${mision.id}')"></button>
            `;
            zone.appendChild(nuevaTarjeta);
        });

        const btnEnviar = document.createElement('button');
        btnEnviar.className = "action-btn deploy-btn";
        btnEnviar.setAttribute("onclick", "confirmarYEnviarResultadosSHIELD()");
        btnEnviar.style.width = "100%";
        btnEnviar.style.padding = "14px";
        btnEnviar.style.fontSize = "0.8rem";
        btnEnviar.style.letterSpacing = "2px";
        btnEnviar.textContent = "ENVIAR INFORME DE MISIÓN";
        
        botoneraFija.appendChild(btnEnviar);
    } else {
        const tarjetaDescanso = document.createElement('div');
        tarjetaDescanso.className = "mission-card";
        tarjetaDescanso.style.borderColor = "#225588";
        tarjetaDescanso.style.background = "linear-gradient(135deg, #0a0a0a 0%, #111a24 100%)";
        tarjetaDescanso.style.padding = "20px";
        tarjetaDescanso.style.cursor = "default";
        tarjetaDescanso.style.width = "100%";
        tarjetaDescanso.style.boxSizing = "border-box";
        
        tarjetaDescanso.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <span style="font-size: 0.7rem; color: #2288ff; letter-spacing: 2px; font-weight: bold;">PROTOCOLO DE ASIMILACIÓN KINÉTICA</span>
                <p style="font-size: 0.95rem; color: #ffffff; margin: 0; font-weight: bold; text-transform: uppercase;">FASE OPERATIVA: DESCANSO OBLIGATORIO</p>
                <div class="tactical-divider" style="margin: 5px 0 8px 0; background-color: #225588;"></div>
                <p style="font-family: sans-serif !important; font-size: 0.8rem; color: #aaaaaa; line-height: 1.4; margin: 0;">
                    Directriz de la agencia: Sus microfibras musculares requieren un ciclo completo de 24 horas para absorber la sobrecarga estructural de calistenia y evitar fallos mecánicos.
                    <br><br>
                    Las misiones de fuerza permanecen bloqueadas bajo llave por orden de JARVIS. Su única directriz autorizada para hoy es el gasto calórico encubierto registrado en su pulsera. Descanse, Agente.
                </p>
            </div>
        `;
        zone.appendChild(tarjetaDescanso);
    }
}

// ==========================================================================
// 5. SISTEMA DE DETALLES TÉCNICOS (FICHA INDIVIDUAL)
// ==========================================================================
function abrirDetallesMision(idMision) {
    let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    const mision = misiones.find(m => m.id === idMision);
    
    if (mision) {
        document.getElementById('details-mission-name').textContent = mision.nombre;
        if (mision.series && mision.series > 0) {
            const unidad = idMision === "mision-core" || idMision === "mision-frog" ? "SEGUNDOS" : "REPETICIONES";
            document.getElementById('details-mission-reps').textContent = `${mision.series} SERIES x ${mision.reps} ${unidad}`;
        } else {
            document.getElementById('details-mission-reps').textContent = "FASE OPERATIVA RECREATIVA";
        }
        document.getElementById('details-mission-desc').textContent = mision.descripcion || "Sin especificaciones tácticas adicionales.";

        const btnBaja = document.getElementById('delete-mission-btn');
        const esBaseObligatoria = ["mision-hombros", "mision-fondos", "mision-dominadas", "mision-granjero", "mision-piernas", "mision-core"].includes(idMision);

        if (esBaseObligatoria) { 
            btnBaja.style.display = "none"; 
        } else { 
            btnBaja.style.display = "block"; 
            btnBaja.onclick = () => { toggleMisionCatalogo(idMision); cerrarDetallesMision(); }; 
        }
        
        document.getElementById('details-modal-overlay').classList.add('open');
    }
}

// ==========================================================================
// 6. CONTROLADORES DE CHECKS Y EVALUACIÓN MATEMÁTICA DE JORNADA
// ==========================================================================
function toggleCheckDinámica(idMision) {
    const tarjeta = document.getElementById(idMision);
    if (!tarjeta) return;
    
    const estaMarcada = tarjeta.classList.toggle('checked-active');
    
    let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    misiones = misiones.map(m => { 
        if (m.id === idMision) m.completada = estaMarcada; 
        return m; 
    });
    localStorage.setItem('shield_misiones', JSON.stringify(misiones));
}

function confirmarYEnviarResultadosSHIELD() {
    const pasosActuales = parseInt(localStorage.getItem('shield_pasos_hoy')) || 0;
    const pasosOk = pasosActuales >= 8000;
    
    const misionesGuardadas = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    const ejerciciosObligatorios = misionesGuardadas.filter(m => 
        ["mision-hombros", "mision-fondos", "mision-dominadas", "mision-granjero", "mision-piernas", "mision-core"].includes(m.id)
    );
    
    const calisteniaOk = ejerciciosObligatorios.every(m => m.completada === true);

    if (!pasosOk || !calisteniaOk) {
        alert("ACCESO DENEGADO: Informes incompletos. Asegúrese de registrar un mínimo de 8000 pasos en su pulsera (rueda rosa) y marcar sus 6 proyectos base obligatorios de calistenia para validar la jornada.");
        return;
    }

    let rachaActual = parseInt(localStorage.getItem('shield_dias_activo_streak')) || 0;
    rachaActual += 1;
    
    localStorage.setItem('shield_dias_activo_streak', rachaActual.toString());
    localStorage.setItem('shield_ultima_fecha_consolidada', new Date().getTime().toString());
    localStorage.setItem('shield_pasos_hoy', '0');
    
    actualizarPasosVisuales();
    actualizarMarcadorVisualDias();
    
    alert("TRANSMISIÓN CONSOLIDADA: Datos de la pulsera e informe de fuerza sincronizados con la central. +1 Día en Activo registrado, Agente.");
    
    const botoneraFija = document.getElementById('misiones-botonera-fija');
    if (botoneraFija) {
        botoneraFija.innerHTML = `<p style="font-family: sans-serif !important; font-size: 0.85rem; color: #00ff66; text-shadow: 0 0 8px rgba(0, 255, 102, 0.4); text-align: center; font-weight: bold; margin-bottom: 25px;">INFORME DIARIO COMPLETADO</p>`;
    }

    cargarMisionesDeBaseDatos();
}

function controlarMisionesAleatoriasDiarias() {
    const fecha = new Date();
    const diaSemana = fecha.getDay();
    const esDiaDeEntreno = (diaSemana === 1 || diaSemana === 3 || diaSemana === 5);
    
    if (esDiaDeEntreno) {
        let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
        const misionesAzules = misiones.filter(m => ["mision-hombros", "mision-fondos", "mision-dominadas", "mision-granjero", "mision-piernas", "mision-core", "mision-frog"].includes(m.id));
        
        let conteoEntrenos = parseInt(localStorage.getItem('shield_entrenos_completados')) || 0;
        
        if (conteoEntrenos >= 3 && misionesAzules.length > 0) {
            const indiceM = fecha.getDate() % misionesAzules.length;
            const misionAEvonlucionar = misionesAzules[indiceM];
            const unidad = ["mision-core", "mision-frog"].includes(misionAEvonlucionar.id) ? "segundos" : "repetición";
            
            levelUpDeHoy = {
                misionId: misionAEvonlucionar.id,
                incremento: ["mision-core", "mision-frog"].includes(misionAEvonlucionar.id) ? 5 : 1
            };

            const tMagentaLevelUp = document.createElement('div');
            tMagentaLevelUp.className = "mission-card random-magenta";
            tMagentaLevelUp.id = "mision-level-up";
            tMagentaLevelUp.innerHTML = `
                <div class="mission-info">
                    <span class="mission-tag" style="color: #ff00aa;">[EVENTO: MEJORA DE REQUISITOS (LEVEL UP)]</span>
                    <p class="mission-text">Suma +${levelUpDeHoy.incremento} ${unidad} a cada serie en: ${misionAEvonlucionar.nombre}</p>
                </div>
                <button class="custom-checkbox" onclick="toggleCheckLevelUp()"></button>
            `;
            const zone = document.querySelector('.scroll-mission-zone');
            if (zone) zone.insertBefore(tMagentaLevelUp, zone.firstChild);
        }

        const indiceR = (fecha.getDate() + fecha.getMonth()) % baseDeRetosJarvis.length;
        const tMagentaReto = document.createElement('div');
        tMagentaReto.className = "mission-card random-magenta";
        tMagentaReto.id = "mision-reto-tactico-diario";
        tMagentaReto.innerHTML = `
            <div class="mission-info">
                <span class="mission-tag" style="color: #ff00aa;">[EVENTO DIARIO: RETO VARIADO]</span>
                <p class="mission-text">${baseDeRetosJarvis[indiceR]}</p>
            </div>
            <button class="custom-checkbox" onclick="this.parentNode.classList.toggle('checked-active')"></button>
        `;
        const zone = document.querySelector('.scroll-mission-zone');
        if (zone) zone.appendChild(tMagentaReto);
    }
}

function toggleCheckLevelUp() {
    const tarjeta = document.getElementById('mision-level-up');
    if (!tarjeta) return;
    const estaMarcada = tarjeta.classList.toggle('checked-active');
    
    let misiones = JSON.parse(localStorage.getItem('shield_misiones')) || [];
    misiones = misiones.map(mision => {
        if (mision.id === levelUpDeHoy.misionId) {
            mision.reps += estaMarcada ? levelUpDeHoy.incremento : -levelUpDeHoy.incremento;
        }
        return mision;
    });
    localStorage.setItem('shield_misiones', JSON.stringify(misiones));
    cargarMisionesDeBaseDatos();
}

// ==========================================================================
// 7. CONEXIÓN REAL CON EL CEREBRO DE J.A.R.V.I.S. (Supabase Edge Function)
// ==========================================================================
const SHIELD_JARVIS_API_KEY = "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";
let jarvisYaHaSaludadoHoy = false;

function inyectarBloqueChat(emisor, texto, claseEstilo) {
    const contenedorFeed = document.getElementById('chat-messages-container');
    if (!contenedorFeed) return;

    if (!contenedorFeed.querySelector('.chat-date-separator')) {
        const divisor = document.createElement('div');
        divisor.className = "chat-date-separator";
        divisor.innerHTML = `<span>HOY</span>`;
        contenedorFeed.appendChild(divisor);
    }

    const nuevoBloque = document.createElement('div');
    nuevoBloque.className = `chat-block ${claseEstilo}`;
    nuevoBloque.innerHTML = `<span class="chat-sender">${emisor}:</span><p class="chat-text">${texto}</p>`;
    contenedorFeed.appendChild(nuevoBloque);
    
    contenedorFeed.scrollTop = contenedorFeed.scrollHeight;

    if (claseEstilo !== 'jarvis-msg' || texto.indexOf("Procesando directriz...") === -1) {
        let historial = JSON.parse(localStorage.getItem('shield_historial_chat')) || [];
        const ahora = new Date().toISOString();
        historial.push({ emisor, texto, claseEstilo, timestamp: ahora });
        localStorage.setItem('shield_historial_chat', JSON.stringify(historial));
    }
}

function inyectarAtajoJarvis(textoAtajo) {
    const inputElemento = document.getElementById('jarvis-user-input');
    if (inputElemento) {
        inputElemento.value = textoAtajo;
        enviarMensajeAAgencia();
    }
}

async function enviarMensajeAAgencia() {
    const inputElemento = document.getElementById('jarvis-user-input');
    const mensajeTexto = inputElemento.value.trim();
    
    if (mensajeTexto === "") return;

    inyectarBloqueChat('AGENTE', mensajeTexto, 'user-msg');
    inputElemento.value = "";

    const contenedorFeed = document.getElementById('chat-messages-container');
    const bloqueCarga = document.createElement('div');
    bloqueCarga.className = 'chat-block jarvis-msg';
    bloqueCarga.id = 'jarvis-loading-block';
    bloqueCarga.innerHTML = `<span class="chat-sender">J.A.R.V.I.S.:</span><p class="chat-text" style="color: #666;">Procesando directriz...</p>`;
    contenedorFeed.appendChild(bloqueCarga);
    contenedorFeed.scrollTop = contenedorFeed.scrollHeight;

    try {
        const rangoGuardado = localStorage.getItem('shield_rango_identidad') || 'AGENTE';
        let tratamiento = "Agente.";
        if (rangoGuardado === "SEÑORITA") tratamiento = "Señorita.";
        if (rangoGuardado === "SEÑOR") tratamiento = "Señor.";

        const horaActual = new Date().getHours();
        let saludoHorario = `Buenos días, ${tratamiento}`;
        if (horaActual >= 14 && horaActual < 21) saludoHorario = `Buenas tardes, ${tratamiento}`;
        if (horaActual >= 21 || horaActual < 6) saludoHorario = `Buenas noches, ${tratamiento}`;

        let instruccionSaludadores = jarvisYaHaSaludadoHoy 
            ? "Está PROHIBIDO incluir saludos de bienvenida. Ve directo al grano." 
            : `Es OBLIGATORIO que empieces saludando exactamente así: "${saludoHorario}".`;

        const directrizSistema = `Eres J.A.R.V.I.S. Trata a la usuaria de usted como ${rangoGuardado}. Corto, conciso, máximo 3 líneas con saltos físicos. ${instruccionSaludadores}`;

        const urlAPI = "https://ngsgddbvhoakaoznffoa.supabase.co/functions/v1/jarvis-brain";
        
        const respuestaWeb = await fetch(urlAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensajeTexto, directrizSistema })
        });

        const datosRespuesta = await respuestaWeb.json();
        bloqueCarga.remove();

        if (datosRespuesta.choices && datosRespuesta.choices && datosRespuesta.choices.message) {
            const respuestaIA = datosRespuesta.choices.message.content.trim();
            inyectarBloqueChat('J.A.R.V.I.S.', respuestaIA, 'jarvis-msg');
            jarvisYaHaSaludadoHoy = true;
        }
    } catch (error) {
        if (bloqueCarga) bloqueCarga.remove();
        inyectarBloqueChat('J.A.R.V.I.S.', "Error de red en el enlace cuántico.", 'jarvis-msg');
    }
}

function obtenerEtiquetaFechaWhatsApp(fechaStr) {
    const msgFecha = new Date(fechaStr);
    const hoy = new Date();
    if (msgFecha.toDateString() === hoy.toDateString()) return "HOY";
    return msgFecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

function reconstruirChatEstiloWhatsApp() {
    const contenedorFeed = document.getElementById('chat-messages-container');
    if (!contenedorFeed) return;
    contenedorFeed.innerHTML = ""; 

    const historial = JSON.parse(localStorage.getItem('shield_historial_chat')) || [];
    let ultimaFechaPintada = "";

    historial.forEach(msg => {
        const etiquetaDia = obtenerEtiquetaFechaWhatsApp(msg.timestamp);
        if (etiquetaDia !== ultimaFechaPintada) {
            const divisor = document.createElement('div');
            divisor.className = "chat-date-separator";
            divisor.innerHTML = `<span>${etiquetaDia}</span>`;
            contenedorFeed.appendChild(divisor);
            ultimaFechaPintada = etiquetaDia;
        }
        const nuevoBloque = document.createElement('div');
        nuevoBloque.className = `chat-block ${msg.claseEstilo}`;
        nuevoBloque.innerHTML = `<span class="chat-sender">${msg.emisor}:</span><p class="chat-text">${msg.texto}</p>`;
        contenedorFeed.appendChild(nuevoBloque);
    });
    contenedorFeed.scrollTop = contenedorFeed.scrollHeight;
}

// ==========================================================================
// 8. CONTROLADOR DE LA CINEMÁTICA DE INTRODUCCIÓN (MECÁNICA DE ONBOARDING)
// ==========================================================================
window.addEventListener('load', () => {
    if (localStorage.getItem('shield_rango_identidad')) {
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) overlay.remove(); 
        return;
    }

    setTimeout(() => {
        ejecutarFaseTutorialLetraALetra(1);
    }, 1000); 
});

const dialogosOnboardingJarvis = {
    1: "Buenos días. Soy J.A.R.V.I.S., su asistente de inteligencia artificial integrado en este datapad táctico de S.H.I.E.L.D.\n\nIniciando diagnóstico de la interfaz gráfica... Detectando módulos de actividad semanal en la base de datos central.",
    2: "Calibración completada.\n\nLe recuerdo que en la sección izquierda dispone de su Núcleo de Energía para registrar las jornadas en activo. El panel de la derecha contiene sus misiones de fuerza y órbita balística.",
    3: "Para finalizar el enlace cuántico y archivar sus informes oficiales en la base de datos de Industrias Stark, necesito calibrar mis registros de voz operacionales.\n\n¿Bajo qué credencial de identidad desea que me dirija a usted durante los despliegues tácticos?"
};

function ejecutarFaseTutorialLetraALetra(fase) {
    const cajaTexto = document.getElementById('onboarding-text-box');
    const zonaBotones = document.getElementById('onboarding-buttons-zone');
    const cabeceraTitulo = document.getElementById('onboarding-header');
    
    if (!cajaTexto || !zonaBotones) return;

    zonaBotones.style.display = "none";
    zonaBotones.innerHTML = "";
    
    if (cabeceraTitulo) {
        cabeceraTitulo.textContent = fase === 3 ? "SELECCIÓN DE CREDENCIALES" : "TRANSMISIÓN J.A.R.V.I.S.";
    }

    let textoCompleto = dialogosOnboardingJarvis[fase];
    let contadorLetras = 0;
    cajaTexto.textContent = ""; 

    const temporizadorLetras = setInterval(() => {
        cajaTexto.textContent += textoCompleto.charAt(contadorLetras);
        contadorLetras++;

        if (contadorLetras >= textoCompleto.length) {
            clearInterval(temporizadorLetras);
            desplegarControlesDeFase(fase, zonaBotones);
        }
    }, 15); 
}

function desplegarControlesDeFase(fase, contenedorBotones) {
    contenedorBotones.style.display = "flex";

    if (fase === 1 || fase === 2) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.className = "action-btn deploy-btn";
        btnSiguiente.style.width = "100%";
        btnSiguiente.textContent = fase === 1 ? "ANALIZAR INTERFAZ" : "ENTENDIDO";
        btnSiguiente.onclick = () => {
            ejecutarFaseTutorialLetraALetra(fase + 1);
        };
        contenedorBotones.appendChild(btnSiguiente);
    } 
    else if (fase === 3) {
        const rangosDisponibles = ["SEÑORITA", "SEÑOR", "AGENTE"];
        
        rangosDisponibles.forEach(rango => {
            const btnRango = document.createElement('button');
            btnRango.className = "identity-select-btn";
            btnRango.textContent = rango;
            btnRango.onclick = () => {
                localStorage.setItem('shield_rango_identidad', rango);
                const overlayElemento = document.getElementById('onboarding-overlay');
                if (overlayElemento) {
                    overlayElemento.classList.add('hidden');
                    setTimeout(() => {
                        overlayElemento.remove();
                        alert("Enlace cuántico establecido. Bienvenida a la terminal, " + rango + ".");
                    }, 500);
                }
            };
            contenedorBotones.appendChild(btnRango);
        });
    }
}

// ==========================================================================
// 9. SISTEMA DE CLASIFICACIÓN DE COMBATE: RÁNKING DE LOS VENGADORES
// ==========================================================================
const escalafonVengadoresStark = [
    { diasRequeridos: 0, nombre: "STEVE ROGERS (PRE-SUERO)", clave: "Nivel Inicial" },
    { diasRequeridos: 3, nombre: "AGENTE DE CAMPO (Infiltración)", clave: "Rango S.H.I.E.L.D." },
    { diasRequeridos: 7, nombre: "BLACK WIDOW (Combate táctico)", clave: "Nivel Vengador" },
    { diasRequeridos: 14, nombre: "TONY STARK (Fase de Armadura)", clave: "Núcleo Activo" },
    { diasRequeridos: 21, nombre: "CAPITÁN AMÉRICA (Súper Soldado)", clave: "Líder de Campo" },
    { diasRequeridos: 30, nombre: "THOR ODINSON (Fuerza del Trueno)", clave: "Estatus Dios" }
];

function abrirRankingVengadores() {
    const modal = document.getElementById('vengadores-modal-overlay');
    const contenedorLista = document.getElementById('vengadores-list-container');
    
    if (!modal || !contenedorLista) return;
    
    const rachaActual = parseInt(localStorage.getItem('shield_dias_activo_streak')) || 0;
    contenedorLista.innerHTML = ""; 

    escalafonVengadoresStark.forEach(rango => {
        const esRangoActual = rachaActual >= rango.diasRequeridos;
        const filaHtml = document.createElement('div');
        
        filaHtml.style.display = "flex";
        filaHtml.style.justify = "space-between";
        filaHtml.style.alignItems = "center";
        filaHtml.style.padding = "8px 4px";
        filaHtml.style.borderBottom = "1px solid #222";
        filaHtml.style.color = esRangoActual ? "#ffcc00" : "#444";
        
        filaHtml.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 0.8rem; font-weight: bold;">${esRangoActual ? '⭐' : '🔒'} ${rango.nombre}</span>
                <span style="font-size: 0.65rem; color: ${esRangoActual ? '#ffcc00' : '#555'};">${rango.clave}</span>
            </div>
            <span style="font-size: 0.75rem; font-weight: bold;">${rango.diasRequeridos} DÍAS</span>
        `;
        contenedorLista.appendChild(filaHtml);
    });

    modal.classList.add('open');
}

function cerrarRankingVengadores() {
    const modal = document.getElementById('vengadores-modal-overlay');
    if (modal) modal.classList.remove('open');
}

// Vinculaciones obligatorias al objeto global window para asegurar la ejecución HTML
window.cambiarPantalla = cambiarPantalla;
window.toggleCheckDinámica = toggleCheckDinámica;
window.confirmarYEnviarResultadosSHIELD = confirmarYEnviarResultadosSHIELD;
window.sincronizarPasosPulseraManual = sincronizarPasosPulseraManual;
window.abrirConfigMisiones = abrirConfigMisiones;
window.cerrarConfigMisiones = cerrarConfigMisiones;
window.cerrarDetallesMision = cerrarDetallesMision;
window.toggleMisionCatalogo = toggleMisionCatalogo;
window.abrirRankingVengadores = abrirRankingVengadores;
window.cerrarRankingVengadores = cerrarRankingVengadores;
window.inyectarAtajoJarvis = inyectarAtajoJarvis;
window.enviarMensajeAAgencia = enviarMensajeAAgencia;
