const signalCanvas = document.getElementById('signalCanvas');
const ctx = signalCanvas.getContext('2d');

const frequencyInput_1 = document.getElementById('frequency1');
const phaseInput_1 = document.getElementById('phase1');
const amplitudeInput_1 = document.getElementById('amp1');
const playButton_1 = document.getElementById('playSignal1');

const frequencyInput_2 = document.getElementById('frequency2');
const phaseInput_2 = document.getElementById('phase2');
const amplitudeInput_2 = document.getElementById('amp2');
const playButton_2 = document.getElementById('playSignal2');

const firstFreqText = document.getElementById('first-freq');
const secondFreqText = document.getElementById('second-freq');

class Signal{
    constructor(frequency, amplitude, phase, color) {
        this.frequency = frequency || 1;
        this.amplitude = amplitude || 1;
        this.phase = phase || 0;
        this.color = color || 'black';
        this.coordinates = [];
        this.isPlaying = false;
        this.oscillator = null;
    }

    generateSignal() {
        for (let i = 0; i < signalCanvas.width; i++) {
            this.coordinates.push(this.amplitude * Math.sin(2 * Math.PI * this.frequency * i / signalCanvas.width + this.phase));
        }
    }

    drawSignal() {
        ctx.beginPath();
        ctx.moveTo(0, signalCanvas.height / 2);
        ctx.strokeStyle = this.color;
        for (let i = 0; i < signalCanvas.width; i++) {
            ctx.lineTo(i, signalCanvas.height / 2 - this.coordinates[i] * 50);
        }
        ctx.stroke();
    }

    play() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioCtx.sampleRate;
        const buffer = audioCtx.createBuffer(1, this.coordinates.length, sampleRate);
        const data = buffer.getChannelData(0);

        if (this.isPlaying) {
            this.oscillator.stop();
            this.isPlaying = false;
        } else {

            for(let i = 0; i < this.coordinates.length; i++) {
                data[i] = (this.coordinates[i] / 100) * 0.5;
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start();
        }
    }
}

const signal1 = new Signal(1, 0, 0, 'rgba(255, 0, 0, 0.7)');
signal1.generateSignal();
signal1.drawSignal();


const signal2 = new Signal(1, 0, 0, 'rgba(0, 0, 255, 0.7)');
signal2.generateSignal();
signal2.drawSignal();

const averageFrequency = (signal1.frequency + signal2.frequency) / 2;
const signal3 = new Signal(1, 50, 0);
signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
signal3.drawSignal();

// Frequency 1

frequencyInput_1.addEventListener('input', () => {
    firstFreqText.innerHTML = `First Frequency: ${frequencyInput_1.value}`;
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal1.frequency = frequencyInput_1.value;
    signal1.coordinates = [];
    signal1.generateSignal();
    signal1.drawSignal();
    signal2.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();
    
});

phaseInput_1.addEventListener('input', () => {
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal1.phase = phaseInput_1.value;
    signal1.coordinates = [];
    signal1.generateSignal();
    signal1.drawSignal();
    signal2.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();
});

amplitudeInput_1.addEventListener('input', () => {
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal1.amplitude = amplitudeInput_1.value * 0.1;
    signal1.coordinates = [];
    signal1.generateSignal();
    signal1.drawSignal();
    signal2.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();
    
});

playButton_1.addEventListener('click', () => {
    signal1.play();
});


// Frequancy 2

frequencyInput_2.addEventListener('input', () => {
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal2.frequency = frequencyInput_2.value;
    signal2.coordinates = [];
    signal2.generateSignal();
    signal2.drawSignal();
    signal1.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();

    secondFreqText.innerHTML = `Second Frequency: ${frequencyInput_2.value}`;
});

phaseInput_2.addEventListener('input', () => {
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal2.phase = phaseInput_2.value;
    signal2.coordinates = [];
    signal2.generateSignal();
    signal2.drawSignal();
    signal1.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();
});

amplitudeInput_2.addEventListener('input', () => {
    ctx.clearRect(0, 0, signalCanvas.width, signalCanvas.height);
    signal2.amplitude = amplitudeInput_2.value * 0.1;
    signal2.coordinates = [];
    signal2.generateSignal();
    signal2.drawSignal();
    signal1.drawSignal();
    signal3.coordinates = signal1.coordinates.map((value, index) => value + signal2.coordinates[index]);
    signal3.drawSignal();
});

playButton_2.addEventListener('click', () => {
    signal2.play();
});


const complexCanvas = document.getElementById('complexPlaneCanvas');
const freqCanvas = document.getElementById('frequencyDomainCanvas');
const freqCtx = freqCanvas.getContext('2d');
const complexCtx = complexCanvas.getContext('2d');

const freq = document.getElementById('frq');
const time = document.getElementById('time');

const windingFreq = document.getElementById('winding-freq');

let intervalId = null;

let centere_of_mass = [{ x: 0, y: 0 }];

function drawWindingPattern(signal, frequency) {
    const centerX = complexCanvas.width / 2;
    const centerY = complexCanvas.height / 2;
    const radius = 100;

    let t = 0;
    const traces = []; 

        complexCtx.clearRect(0, 0, complexCanvas.width, complexCanvas.height);
        
        complexCtx.beginPath();
        complexCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        complexCtx.strokeStyle = 'black';
        complexCtx.stroke();

        for (let i = 0; i < signal.coordinates.length; i++) {
            const signalValue = signal.coordinates[i];
            
            const angle = -2 * Math.PI * frequency * (i / signal.coordinates.length ); // -2πƒt
            
            const x = centerX + signalValue * Math.cos(angle) * radius;
            const y = centerY + signalValue * Math.sin(angle) * radius;

            traces.push({ x, y });

            if (traces.length > 1) {
                complexCtx.beginPath();
                complexCtx.moveTo(traces[traces.length - 2].x, traces[traces.length - 2].y);
                complexCtx.lineTo(x, y);
                complexCtx.strokeStyle = signal.color;
                complexCtx.stroke();
            }
        }

        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < traces.length; i++) {
            sumX += traces[i].x;
            sumY += traces[i].y;
        }

        const avgX = sumX / traces.length;
        const avgY = sumY / traces.length;


        complexCtx.beginPath();
        complexCtx.arc(avgX, avgY, 5, 0, 2 * Math.PI);
        complexCtx.fillStyle = 'red';
        complexCtx.fill();

        const magnitude = Math.sqrt(avgX * avgX + avgY * avgY);

        const scaledFrequency = frequency;

        const freqPosition = Math.min(scaledFrequency, freqCanvas.width);

        freqCtx.fillStyle = 'blue'; 
        freqCtx.fillRect(freqPosition * 20, avgY, 10, avgY/10);

        freqCtx.fillStyle = 'black'; 
        freqCtx.font = '12px Arial'; 
        freqCtx.textAlign = 'center'; 
        freqCtx.fillText(frequency, freqPosition * 20 + 5, avgY - 5); 

        t += 0.01;
}

drawWindingPattern(signal3, 0);

freq.addEventListener('input', () => {
    complexCtx.clearRect(0, 0, complexCanvas.width, complexCanvas.height);
    

    drawWindingPattern(signal3, freq.value);

    windingFreq.innerHTML = `Frequency: ${freq.value}`;

});