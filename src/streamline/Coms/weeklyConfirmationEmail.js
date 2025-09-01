import { formatMMDDYYYYToLongDate } from '@models/cleanData';
import { meetsToConfirmStore, MY_TEAM } from '@src/stores';
import { get } from 'svelte/store';

export function weeklyConfirmationEmail(swmrs = null, prnt = null) {
    const meets = get(meetsToConfirmStore);
    const meetTiles = meets.map(meet => meetInfoTile(meet)).join('<br>');
    const meetTilesEs = meets.map(meet => infoDeCompetencia(meet)).join('<br>');

    const myTeam = get(MY_TEAM);
    const defaultSwimmers = [myTeam.swimmers[0]];
    const defaultParent = defaultSwimmers[0].parents[0];

    const swimmers = swmrs || defaultSwimmers;
    const parent = prnt || defaultParent;

    return `
    <div style="max-width: 40em">

        <p>Hi ${parent.nombre}, </p>

        <p>The Glenmont Gators have 2 meets this week, a B Meet on Wednesday and an Divisionals on Saturday. </p>
        <p> We can only take 2 swimmers per event to Divisionals; about 40 swimmers have qualified.
        B Champs at Long Branch will be the final meet for most of our team. If your swimmer
        is swimming 2 or more events at Divisionals, we request that they not participate
        in B Champs to give other swimmers a chance to shine.</p>
        <p>It is important for the coaches to know who is and is not
        attending for all meets, so please review the meet details and confirm your swimmers' availability
        or absence.</p>

        <div style="font-weight:bold; color: #f00; font-size: 1.2em">
            <a href="https://glenmont-gators.swimtopia.com/swim_meets"
                target="_blank" rel="noopener noreferrer"
                style="color: #f00">
                We need parents to help at B Champs! Please click here to sign up.
            </a>
        </div>
        <div style="text-align: center; margin: 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meets)).join('')}
        </div>
        <br>
        <div style="font-weight: bold; color: #2a2; font-size: 1.2em;">
            Deadline: Tuesday, July 15 by 4:00 PM
        </div>

        <p>Meet Details:</p>

        <div style="margin:auto">
            ${meetTiles}
        </div>
        <p>Thank you,<br>
        Patrick</p>
        <p>🐊🐊🐊 Go Gators! 🐊🐊🐊 </p>
        
        <hr style="border: 1px solid #2a2; margin: 2em 0;">

        <p>Hola ${parent.nombre},</p>

        <p> Los Glenmont Gators tienen dos competencias esta semana: una competencia B el miércoles 
        y Divisionals el sábado.</p>

        <p>Solo podemos llevar a dos nadadores por evento a las Divisionales; 
        unos 40 nadadores ya se han calificado. La competencia B en Long Branch será la última competencia para la mayoría 
        de nuestro equipo. Si su nadador está nadando 2 o más eventos en las Divisionales, 
        le solicitamos que no participe en los Campeonatos B para darles a otros nadadores 
        la oportunidad de destacar.</p>

        <p>Es importante que los entrenadores sepan quién asistirá y quién no a todas las competencias, 
        así que revisen los detalles de la competencia y confirmen la disponibilidad o ausencia de 
        sus nadadores.</p>
        
        <div style="font-weight:bold; color: #f00; font-size: 1.2em">
            <a href="https://glenmont-gators.swimtopia.com/swim_meets"
                target="_blank" rel="noopener noreferrer"
                style="color: #f00">
                ¡Necesitamos padres que ayuden en los B Champs! Haz clic aquí para inscribir.
            </a>
        </div>

        <div style="text-align: center; margin: 0;">
            ${swimmers.map(swimmer => swimmerConfirmationButton(swimmer, meets, true)).join('')}
        </div>
        <br>

        <div style="font-weight: bold; color: #2a2; font-size: 1.2em;">
            Fecha límite: Martes, 15 de julio a las 4:00 PM
        </div>

        <p>Detalles de las competencias:</p>

        <div style="margin:auto">
            ${meetTilesEs}
        </div>

        <p>Gracias,<br>
        Patrick</p>
        <p>🐊🐊🐊 ¡Vamos Gators! 🐊🐊🐊 </p>
        </div>`;
}

function swimmerConfirmationButton(swimmer, meets, spanish = false) {
    let label = spanish ? 
        `Haga clic para confirmar la asistencia / ausencia para ${swimmer.preferredName}` :
        `Click here to confirm attendance / absence for ${swimmer.preferredName}`;
    const mcIds = swimmer.getMeetConfirmations(meets).map(meetCon => meetCon.objectId);
    const link = 'https://swim-app.vercel.app/coms?i=' + mcIds.join(',');
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

function meetInfoTile(meet, styles={tileColor: '#04f'}) {
    return `
        <div style="border: 2px solid ${styles.tileColor}; border-radius: 0.3em; padding: 0;
        background-color: #f9f9f9; max-width: 25em; font-family: Arial, sans-serif; font-size: 1em;
        margin: 0 auto">

            <div style="font-weight: bold; background-color: ${styles.tileColor};
                color: #fff; font-size: 1em; padding: 0.5em; text-align: center;">
                ${meet.name}
            </div>

            <div style="font-weight: normal; color: #000; font-size: 1em; padding: 1em;">
                <div style='margin-bottom:0.3em'><strong>Date:</strong> ${formatMMDDYYYYToLongDate(meet.startDate)}</div>
                <div style='margin-bottom:0.3em'><strong>Warm Ups:</strong> ${meet.arrivalTime}</div>
                <div style='margin-bottom:0.3em'><strong>Location:</strong> <br>
                    <a href="${meet.mapLink}" style="color: ${styles.tileColor}; text-decoration: none;">
                        ${meet.pool} <br>
                        ${meet.address}
                    </a>
                </div>
                <div><strong>Confirmation Instructions:</strong> <br>
                    ${meet.instructions}
                </div>    
            </div>



        </div>
    `;
}

function infoDeCompetencia(meet, styles={tileColor: '#04f'}) {
    return `
        <div style="border: 2px solid ${styles.tileColor}; border-radius: 0.3em; padding: 0;
        background-color: #f9f9f9; max-width: 25em; font-family: Arial, sans-serif; font-size: 1em;
        margin: 0 auto;">

            <div style="font-weight: bold; background-color: ${styles.tileColor};
                color: #fff; font-size: 1em; padding: 0.5em; text-align: center;">
                ${meet.name}
            </div>

            <div style="font-weight: normal; color: #000; font-size: 1em; padding: 1em;">
                <div style='margin-bottom:0.3em'><strong>Fecha:</strong> ${formatMMDDYYYYToLongDate(meet.startDate, 'es-ES')}</div>
                <div style='margin-bottom:0.3em'><strong>Calentamiento:</strong> ${meet.arrivalTime}</div>
                <div style='margin-bottom:0.3em'><strong>Ubicación:</strong> <br>
                    <a href="${meet.mapLink}" style="color: ${styles.tileColor}; text-decoration: none;">
                        ${meet.pool} <br>
                        ${meet.address}
                    </a>
                </div>
                <div><strong>Instrucciones para confirmar:</strong> <br>
                    ${meet.instrucciones}
                </div>    
            </div>

        </div>
    `;
}

