const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const audio = document.getElementById('audio')
let recorder, chunks = []

startBtn.addEventListener('click', () => {
  startBtn.classList.add('display-none')
  stopBtn.classList.toggle('display-none')
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder = new MediaRecorder(stream)
      recorder.addEventListener('dataavailable', e => chunks.push(e.data))
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' })
        const url = URL.createObjectURL(blob)
        audio.src = url
        stream.getAudioTracks()[0].stop()
        createRecord()
      })
      recorder.start()
    })
})

stopBtn.addEventListener('click', () => {
  stopBtn.classList.toggle('display-none')
  startBtn.classList.toggle('display-none')
  if (recorder.state === 'recording') {
    recorder.stop()
    chunks = []
  }
})

function createRecord() {

  const xhr1 = new XMLHttpRequest()

  xhr1.onreadystatechange = function() {
    if (xhr1.readyState === 4 && xhr1.status === 200) {
      // Request is finished and the response has been successfully fetched
      const response = xhr1.response
      const jsonResponse = JSON.parse(response)

      if (jsonResponse.id) {
        const id = jsonResponse.id
        uploadAudio(id)
      }
    }
  }
  xhr1.open('POST', '/new-record')
  xhr1.send()

}


function uploadAudio(id) {
  const formData = new FormData()
  const blob = new Blob(chunks, { type: 'audio/ogg' })
  formData.append('audio', blob, 'recorded_audio.ogg')

  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/upload-audio/' + id)
  xhr.send(formData)
}
