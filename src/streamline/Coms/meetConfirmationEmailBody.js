import { formatMMDDYYYYToLongDate } from "@models/cleanData";

export function aMeetConfirmationEmailBody(swimmers, parent, meet) {
    const date = formatMMDDYYYYToLongDate(meet.startDate);
    const fecha = formatMMDDYYYYToLongDate(meet.startDate, 'es-ES');
    return `
        <div style="border: 4px solid #2a2;
                border-radius: 1em; 
                padding: 2em; 
                background-color: #f9f9f9;
                max-width: 30em;
                font-family: Arial, sans-serif;
                font-size: 1.2em;">
        <p>Hi ${parent.nombre}, </p>

        <div style="font-weight: bold; color: #2a2;">
        <p> The meet sign-up procedure has changed. Please use the green links in this email indicate your swimmers' availability
            for the A Meet. Note: This is not connected to Swimtopia. Please continue to use Swimtopia to sign up to volunteer at the meet.
            All communications about swimmer availability will be through this new system. </p>
        </div>
        <p>We are excited to prepare for the A Meet on ${date}.</p>
        <p> Please arrive by <strong> ${meet.arrivalTime} </strong> to be ready for warm-ups.</p>

        <p> <strong> Location: </strong> <br>
            <a href="${meet.mapLink}"
            style="color: #0a0; text-decoration: none;">
            ${meet.pool} <br>
            ${meet.address}
            </a>
        </p>
        
        <p> Please click the button(s) below to confirm attendance or absence for each swimmer. It is very important
            that you let us know if you won't be coming so coaches can give another swimmer the opportunity to partcipate.</p>
        <p> The coaches will select swimmers and events and send out a line up by Thursday morning. </p>

        <p style="text-align: center; margin: 20px 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meet)).join('')}
        </p>
        <p>Thank you,<br>
        Patrick</p>
        <p>🐊🐊🐊 Go Gators! 🐊🐊🐊 </p>

        <hr style="border: 1px solid #2a2; margin: 2em 0;">

        <p>Hola ${parent.nombre},</p>

        
        <div style="font-weight: bold; color: #2a2;">
        <p> El procedimiento de inscripción para la competición ha cambiado. Utilice los enlaces verdes de este correo electrónico para indicar 
            la disponibilidad de sus nadadores para la competición A. Nota: Esto no está relacionado con Swimtopia. 
            Continúe usando Swimtopia para inscribirse como voluntario en la competición.
            Todas las comunicaciones sobre la disponibilidad de los nadadores se realizarán a través de este nuevo sistema.</p>
        </div>

        <p>Estamos emocionados prepara para la A Meet el ${fecha}.</p>
        <p> Por favor, llegue a las <strong>${meet.arrivalTime}</strong> para estar listo para los calentamientos.</p>

        <p> <strong> Ubicación: </strong> <br>
        <a href="${meet.mapLink}"
        style="color: #0a0; text-decoration: none;">
        ${meet.pool} <br>
        ${meet.address}
        </a>
        </p>

        <p>
        Por favor, haga clic en el botón o botones a continuación para confirmar la asistencia o ausencia de cada nadador. 
        Es muy importante que nos avise si no asistirá para que los entrenadores puedan dar la oportunidad de participar a otro nadador.
        </p>
        <p>
        Los entrenadores seleccionarán a los nadadores y las pruebas, y enviarán la lista de participantes el jueves por la mañana.
        </p>

        <p style="text-align: center; margin: 20px 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meet, true)).join('')}
        </p>
        <p>Gracias,<br>
        Patrick</p>
        <p>🐊🐊🐊 ¡Vamos Gators! 🐊🐊🐊 </p>
        </div>
        `;
}

export function bMeetConfirmationEmailBody(swimmers, parent, meet) {
    const date = formatMMDDYYYYToLongDate(meet.startDate);
    const fecha = formatMMDDYYYYToLongDate(meet.startDate, 'es-ES');
    return `
        <div style="border: 4px solid #2a2;
                border-radius: 1em; 
                padding: 2em; 
                background-color: #f9f9f9;
                max-width: 30em;
                font-family: Arial, sans-serif;
                font-size: 1.2em;">
        <p>Hi ${parent.nombre}, </p>

        <div style="font-weight: bold; color: #2a2;">
        <p> The meet sign-up procedure has changed. Please use the green links in this email to sign up for Wednesday's B Meet. </p>
        </div>
        <p>We are excited to have your family join us for the upcoming B Meet on ${date}.</p>
        <p> Please arrive by <strong> ${meet.arrivalTime} </strong> to be ready for warm-ups.</p>
        <p> <strong> Location: </strong> <br>
            <a href="${meet.mapLink}"
            style="color: #0a0; text-decoration: none;">
            ${meet.pool} <br>
            ${meet.address}
            </a>
        </p>
        
        <p> Please click the button(s) below to confirm attendance or absence for each swimmer. </p>
        <p>If you can attend, we ask you to choose up to 3 strokes.
        We cannot guarantee that your swimmer will be able to swim without this confirmation.</p>
        <p>If you cannot attend, please confirm your absence so the coaches can plan accordingly.</p>

        <p style="text-align: center; margin: 20px 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meet)).join('')}
        </p>
        <p>Thank you,<br>
        Patrick</p>
        <p>🐊🐊🐊 Go Gators! 🐊🐊🐊 </p>

        <hr style="border: 1px solid #2a2; margin: 2em 0;">

        <p>Hola ${parent.nombre},</p>

        
        <div style="font-weight: bold; color: #2a2;">
        <p> El procedimiento de inscripción para la competencia ha cambiado. Por favor, use los enlaces verdes en este correo electrónico para inscribirse en el B Meet del miércoles.</p>
        </div>

        <p>Estamos emocionados de que su familia se una a nosotros en el próximo B Meet el ${fecha}.</p>
        <p> Por favor, llegue a las <strong>${meet.arrivalTime}</strong> para estar listo para los calentamientos.</p>
        <p> <strong> Ubicación: </strong> <br>
        <a href="${meet.mapLink}"
        style="color: #0a0; text-decoration: none;">
        ${meet.pool} <br>
        ${meet.address}
        </a>
        </p>

        <p> Por favor, haga clic en el botón(es) de abajo para confirmar la asistencia o ausencia de cada nadador. </p>
        <p>Si puede asistir, le pedimos que elija hasta 3 estilos. 
        Sin esta confirmación, no podemos asegurar que su nadador pueda nadar.</p>
        <p>Si no puede asistir, confirme su ausencia para que los entrenadores puedan organizar todo.</p>

        <p style="text-align: center; margin: 20px 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meet, true)).join('')}
        </p>
        <p>Gracias,<br>
        Patrick</p>
        <p>🐊🐊🐊 ¡Vamos Gators! 🐊🐊🐊 </p>
        </div>
        `;
}

function swimmerConfirmationButton(swimmer, meet, spanish = false) {
    let label = spanish ? 
        `Haga clic para confirmar la asistencia / ausencia para ${swimmer.preferredName}` :
        `Click here to confirm attendance / absence for ${swimmer.preferredName}`;
    const mcId = swimmer.getMeetConfirmation(meet.objectId).objectId;
    const link = `https://swim-app.vercel.app/coms?i=${mcId}`;
    return `
        <a href="${link}" 
           style="
                width: 100%;
               display: inline-block;
               padding: 12px 24px;
               margin-top: 20px;
               font-size: 16px;
               font-weight: bold;
               color: #ffffff; /* White text */
               background-color: #2a2; /* Big green button #2a2 */
               border-radius: 8px;
               text-decoration: none;
               text-align: center;
               transition: background-color 0.3s ease; /* Smooth hover transition */
               -webkit-text-size-adjust: none; /* For email clients */
               mso-hide: all; /* For Outlook */
               box-sizing: border-box;
           "
           onmouseover="this.style.backgroundColor='#4f4';" /* Hover color #48f */
           onmouseout="this.style.backgroundColor='#0a0';" /* Original color */
        >
           ${label}
        </a>
    `;
}