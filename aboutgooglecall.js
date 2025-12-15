// client.js
fetch('/api/geocode?address=Zagreb')
  .then(r => r.json())
  .then(data => console.log(data));
