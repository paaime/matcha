const getGPSLocation = async () => {
  const gpsSuccess = (pos) => {
    if (pos.coords) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      return { lat, lon };
    } else {
      return null;
    }
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: Infinity
  };

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

    return gpsSuccess(position) || null;
  } catch (error) {
    return null;
  }
};

const getIPCoords = async() => {
  const datas = await fetch('https://ipapi.co/json/')
  const data = await datas.json();

  let lat = data.latitude;
  let lon = data.longitude;

  if (lat && lon) {
    return { lat, lon };
  }

  return null;
};

export const updateCoords = async (): Promise<string> => {
  const coords = await getGPSLocation();
  if (coords) {
    return `${coords.lat},${coords.lon}`;
  }

  const coords2 = await getIPCoords();

  if (coords2.lat && coords2.lon) { 
    return `${coords2.lat},${coords2.lon}`;
  }

  return "45.780967712402344,4.750461101531982";
};
