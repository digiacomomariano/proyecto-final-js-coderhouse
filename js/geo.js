navigator.geolocation.getCurrentPosition((datos) => {
  let lat = datos.coords.latitude;
  let lon = datos.coords.longitude;
  DatosTiempo(lat, lon);
});

const DatosTiempo = async (lat, lon) => {
  apiKey = "1be8bf3a21815871c63efdff19feef36";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
};
