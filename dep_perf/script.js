// script.js

function calculatePerformance() {
    // Récupération des valeurs des champs de formulaire
    const aircraftType = document.getElementById('aircraft-type').value;
    const weight = parseFloat(document.getElementById('aircraft-weight').value);
    const runwayLength = parseFloat(document.getElementById('runway-length').value);
    const flaps = parseInt(document.getElementById('flaps-setting').value);
    const antiIce = document.getElementById('anti-ice').value === 'Yes';
    const packs = document.getElementById('packs').value === 'Yes';
    const temperature = parseFloat(document.getElementById('temperature').value);
    const qnh = parseFloat(document.getElementById('qnh').value);
    const windSpeed = parseFloat(document.getElementById('wind-speed').value);
    const windDirection = parseFloat(document.getElementById('wind-direction').value);
    const runwayHeading = parseFloat(document.getElementById('runway-heading').value);

    // Calculer les vitesses V1, VR, V2 (formules simplifiées)
    const vSpeeds = calculateVSpeeds(aircraftType, weight);
    const takeoffShift = calculateTakeoffShift(runwayLength, weight);
    const flapsThs = `${flaps}/0.0`;
    const flexTemp = calculateFlexTemp(temperature, aircraftType);

    // Afficher les résultats
    document.getElementById('v1-result').textContent = vSpeeds.v1.toFixed(1);
    document.getElementById('vr-result').textContent = vSpeeds.vr.toFixed(1);
    document.getElementById('v2-result').textContent = vSpeeds.v2.toFixed(1);
    document.getElementById('takeoff-shift').textContent = takeoffShift.toFixed(1);
    document.getElementById('flaps-ths').textContent = flapsThs;
    document.getElementById('flex-temp').textContent = flexTemp.toFixed(1);
}

function calculateVSpeeds(type, weight) {
    // Cette fonction utilise des valeurs simplifiées et ne remplace pas les calculs réels
    const baseSpeed = 130; // vitesse de base pour l'A320, à ajuster selon l'avion
    let adjustmentFactor = 0;

    switch(type) {
        case 'A220': adjustmentFactor = 1; break;
        case 'A318': adjustmentFactor = 1.2; break;
        case 'A319': adjustmentFactor = 1.4; break;
        case 'A320': adjustmentFactor = 1.6; break;
        case 'A321': adjustmentFactor = 1.8; break;
        case 'A330-900': adjustmentFactor = 2.0; break;
        case 'A340-600': adjustmentFactor = 2.2; break;
        case 'A380-800': adjustmentFactor = 2.4; break;
        default: adjustmentFactor = 1.6; break; // par défaut, A320
    }

    const v1 = baseSpeed + (weight - 60000) / 1000 * adjustmentFactor;
    const vr = baseSpeed + 5 + (weight - 60000) / 1000 * adjustmentFactor;
    const v2 = baseSpeed + 10 + (weight - 60000) / 1000 * adjustmentFactor;

    return { v1, vr, v2 };
}

function calculateTakeoffShift(runwayLength, weight) {
    // Calcul simplifié du décalage au décollage basé sur le poids
    const baseShift = 0; // décalage de base
    const shiftAdjustment = (weight - 60000) / 1000;
    return baseShift + shiftAdjustment;
}

function calculateFlexTemp(temperature, type) {
    // Calcule une température FLEX de base, dépendant du type d'avion
    let flexAdjustment = 0;

    switch(type) {
        case 'A220': flexAdjustment = 5; break;
        case 'A318': flexAdjustment = 6; break;
        case 'A319': flexAdjustment = 7; break;
        case 'A320': flexAdjustment = 8; break;
        case 'A321': flexAdjustment = 9; break;
        case 'A330-900': flexAdjustment = 10; break;
        case 'A340-600': flexAdjustment = 11; break;
        case 'A380-800': flexAdjustment = 12; break;
        default: flexAdjustment = 8; break; // par défaut, A320
    }

    return temperature + flexAdjustment;
}

function resetForm() {
    document.getElementById('performance-form').reset();
    document.getElementById('v1-result').textContent = '';
    document.getElementById('vr-result').textContent = '';
    document.getElementById('v2-result').textContent = '';
    document.getElementById('takeoff-shift').textContent = '';
    document.getElementById('flaps-ths').textContent = '';
    document.getElementById('flex-temp').textContent = '';
}



// Function to update time and date
function updateTimeDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Local time in French
    const localTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const localDate = now.toLocaleDateString('fr-FR', options);

    // Zulu time in English
    const utcTime = now.toISOString().substring(11, 16); // UTC time in HH:mm format

    // Display time and date
    document.getElementById('time-date').textContent = `${localDate} ${localTime}L / ${utcTime}Z`;
}

let batteryPercent = 100;
let chargingInterval = null;

function updateBatteryDisplay() {
    const batteryPercentSpan = document.getElementById('battery-percent');
    batteryPercentSpan.textContent = `${batteryPercent}%`;
}

function dischargeBattery() {
    if (batteryPercent > 0) {
        batteryPercent -= 1;
        updateBatteryDisplay();
    }
}

function chargeBattery() {
    if (batteryPercent < 100) {
        batteryPercent += 1;
        updateBatteryDisplay();
    }
}

function toggleCharging() {
    if (chargingInterval) {
        clearInterval(chargingInterval);
        chargingInterval = null;
    } else {
        chargingInterval = setInterval(chargeBattery, 45000);
    }
}

document.getElementById('battery-icon').addEventListener('click', toggleCharging);

// Discharge battery every 5 minutes (300,000 milliseconds)
setInterval(dischargeBattery, 300000);

// Update time and date every minute
updateTimeDate();
setInterval(updateTimeDate, 60000);

