const { log, table } = console;

// serealize form
const myForm = document.forms['myForm'];

function serialize(form) {
  // get most things
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Get full values for checkboxes & multi-selects
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const fullData = formData.getAll(key);
      if (fullData.length > 1) {
        data[key] = fullData;
      }
    }
  }

  return data;
}

myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = serialize(myForm);
  log('data', data);

  const artist = document.forms['artist'];
  const song = document.forms['song'];

  let artistData = data.artist;
  let songData = data.song;

  const mountNode = document.getElementById('mount');
  log(mountNode);
  fetch(`https://api.lyrics.ovh/v1/${artistData}/${songData}`)
    .then((response) => response.json())
    .then((data) => {
      table('data', data);
      renderLyrics(data);
    });

  function renderLyrics(data = {}, targetEl = mountNode) {
    const list = document.createElement('p');
    list.innerHTML = `
<p class="lyrics">${data.lyrics}</p>
`;
    targetEl.innerHTML = '';
    targetEl.append(list);
  }
  e.currentTarget.reset();
});
