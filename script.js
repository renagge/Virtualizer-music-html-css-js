const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');
const volumeSlider = document.getElementById('volumeSlider');
const visualizer = document.getElementById('visualizer');
const canvasContext = visualizer.getContext('2d');

let audioContext;
let analyzer;
let bufferLength;
let dataArray;
let audioSource;

function playMusic() {
    audioSource.start();
}

function stopMusic() {
    audioSource.stop();
}

function setVolume() {
    audioSource.volume = volumeSlider.value;
}

function drawVisualizer() {
    analyzer.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, visualizer.width, visualizer.height);

    const barWidth = (visualizer.width / bufferLength) * 2;
    const barSpacing = 2;
    const centerX = visualizer.width / 2;
    const centerY = visualizer.height / 2;

    const gradient = canvasContext.createLinearGradient(0, 0, 0, visualizer.height);
    gradient.addColorStop(0, 'rgb(0, 255, 0)'); // Warna awal (hijau)
    gradient.addColorStop(1, 'rgb(255, 0, 0)'); // Warna akhir (merah)

    for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * 2 * Math.PI;
        const radius = (dataArray[i] / 255) * (visualizer.height / 2 - barWidth);

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(x, y, barWidth, barWidth);
    }

    requestAnimationFrame(drawVisualizer);
}

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    audioSource = audioContext.createMediaElementSource(new Audio('1.mp3'));
    audioSource.connect(analyzer);
    audioSource.connect(audioContext.destination);

    drawVisualizer();
}

playButton.addEventListener('click', playMusic);
stopButton.addEventListener('click', stopMusic);
volumeSlider.addEventListener('input', setVolume);

initAudio();
