const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const audio = document.getElementById('audio');
let recorder, chunks = [];

startBtn.addEventListener('click', () => {
startBtn.classList.add('display-none');
stopBtn.classList.toggle('display-none');
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder = new MediaRecorder(stream);
      recorder.addEventListener('dataavailable', e => chunks.push(e.data));
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        audio.src = url;
        stream.getAudioTracks()[0].stop();
        uploadRecordedAudio();
      });
      recorder.start();
    });
});

stopBtn.addEventListener('click', () => {
stopBtn.classList.toggle('display-none');
startBtn.classList.toggle('display-none');
  if (recorder.state === 'recording') {
    recorder.stop();
    chunks = [];
  }
});

function uploadRecordedAudio() {
  const formData = new FormData();
  const blob = new Blob(chunks, { type: 'audio/mp3' });
  formData.append('audio', blob, 'recorded_audio.mp3');

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload-audio');
  xhr.send(formData);
}

