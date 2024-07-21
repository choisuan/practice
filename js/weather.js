document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('spinner');
  let weatherMenuIcon = document.querySelector('.weather-menu-btn');
  let weatherName;
  let url;

  const showWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
        return `<i class="fa-solid fa-sun sun"></i>`;
      case 'Rain':
        return `<i class="fa-solid fa-umbrella rain"></i>`;
      case 'Snow':
        return `<i class="fa-solid fa-snowflake snow"></i>`;
      case 'Clouds':
        return `<i class="fa-solid fa-cloud cloud"></i>`;
      case 'Thunderstorm':
        return `<i class="fa-solid fa-bolt thunder"></i>`;
      default:
        return `<i class="fa-solid fa-sun sun"></i>`;
    }
  };

  const getWeatherIcon = async () => {
    try {
      spinner.style.display = 'flex'; // 로딩 스피너 표시

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      url = './data/weather2.json';

      // url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=us&appid=${WEATHER_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      if (!data.current || !data.current.weather || !data.current.weather[0]) {
        throw new Error('Invalid weather data');
      }

      weatherName = data.current.weather[0].main;
      console.log(weatherName);
      weatherMenuIcon.innerHTML = showWeatherIcon(weatherName) + ' 날씨 추천곡';

      await callSpotifyAPI(weatherName);
    } catch (error) {
      console.log('Error Message >> ', error);
    } finally {
      spinner.style.display = 'none'; // 로딩 스피너 숨김
    }
  };

  const getWeatherInfo = async () => {
    try {
      spinner.style.display = 'flex';

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      url = './data/weather2.json';

      // url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=us&appid=${WEATHER_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('88', data);

      if (!data.current || !data.current.weather || !data.current.weather[0]) {
        throw new Error('Invalid weather data');
      }

      renderHTML(data);
      const weatherDescription = matchWeather(data.current.weather[0].main);
      console.log('weatherDescription', weatherDescription);

      await callSpotifyAPI(weatherDescription);
    } catch (error) {
      console.log('Error Message >> ', error);
    } finally {
      if (spinner) {
        spinner.style.display = 'none'; // 로딩 스피너 숨김
      }
    }
  };

  const renderHTML = (data) => {
    const nav = document.querySelector('#nav');
    // 기존 섹션을 지웁니다.
    const existingSection = nav.querySelector('.weather-display');
    if (existingSection) {
      nav.removeChild(existingSection);
    }

    const section = document.createElement('section');
    section.classList.add('weather-display');
    section.innerHTML = `
    <div class='weather-display'>
      <img src="https://openweathermap.org/img/wn/${
        data.current.weather[0].icon
      }@2x.png" alt="weather_Icon" />
      <div class='weather-current'>${data.current.weather[0].main}</div>
      <p class='weather-temp'>${data.current.temp.toFixed(1)}°</p>
    </div>
    `;
    nav.appendChild(section);
  };

  const createWeatherPlaylistSection = () => {
    const section = document.querySelector('#section');

    section.innerHTML = '';

    const mainWeatherPlaylist = document.createElement('div');
    mainWeatherPlaylist.classList.add(
      'contents-container',
      'd-flex',
      'flex-column',
      'gap-4',
      'main_weather_playlist'
    );

    const contentsLine = document.createElement('div');
    contentsLine.classList.add('contents-line');

    const weatherPlaylistHeader = document.createElement('div');
    weatherPlaylistHeader.classList.add(
      'contents-header',
      'weather_playlist_header'
    );

    const headerTitle = document.createElement('h4');
    headerTitle.classList.add('contents-header-title', 'h4', 'text-white');
    headerTitle.innerHTML =
      '<i class="fa-solid fa-sun sun" aria-hidden="true"></i> 오늘 날씨와 어울리는 플레이리스트';

    weatherPlaylistHeader.appendChild(headerTitle);

    const weatherPlaylistRow = document.createElement('div');
    weatherPlaylistRow.classList.add(
      'card-container',
      'weather-playlist-row',
      'weather-playlist-row2'
    );

    contentsLine.appendChild(weatherPlaylistHeader);
    contentsLine.appendChild(weatherPlaylistRow);

    mainWeatherPlaylist.appendChild(contentsLine);
    section.appendChild(mainWeatherPlaylist);
  };
  const renderPlaylists = (playlists) => {
    createWeatherPlaylistSection();
    const mainWeatherPlaylist = document.querySelector(
      '.main_weather_playlist'
    );
    let weatherListHeader = document.querySelector('.weather_playlist_header');

    if (!mainWeatherPlaylist) {
      console.error('main_weather_playlist element not found');
      return;
    }

    if (!weatherListHeader) {
      weatherListHeader = document.createElement('div');
      weatherListHeader.classList.add('weather_playlist_header');
      mainWeatherPlaylist.prepend(weatherListHeader);
    }

    weatherListHeader.innerHTML = `<h4 class="weather-playlist-h1">${showWeatherIcon(
      weatherName
    )} 오늘 날씨와 어울리는 플레이리스트</h4>`;

    let row = document.querySelector('.weather-playlist-row2');
    if (!row) {
      console.error(
        'weather-playlist-row element not found, creating new element'
      );
      row = document.createElement('div');
      row.classList.add('card-container', 'weather-playlist-row2');
      mainWeatherPlaylist.appendChild(row);
    } else {
      row.innerHTML = '';
    }

    playlists.forEach((playlist) => {
      const plItem = document.createElement('div');
      plItem.classList.add('contents-card', 'playlist-item');

      const playlistName = playlist.name.trim();

      plItem.innerHTML = `
      <div class="card-img-box position-relative">
        <a href="${playlist.external_urls.spotify}" class="weather-playlist-more" target="_blank">  
           <div class="card-img">
            <img src="${playlist.images[0].url}" alt="${playlist.name}" />
          </div>      
          <div class="card-text single-line-text">
            <span>${playlistName}</span>
          </div>
        </a>
      </div>
    `;
      row.appendChild(plItem);
    });
  };

  const getAccessToken = async (CLIENT_ID, CLIENT_SECRET) => {
    const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  };

  const fetchTrackFeatures = async (trackId, token) => {
    url = `https://api.spotify.com/v1/audio-features/${trackId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch track features');
    }

    return response.json();
  };

  const callSpotifyAPI = async (weatherDescription) => {
    const CLIENT_ID = config.clientID;
    const CLIENT_SECRET = config.clientSecret;

    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    let query = weatherDescription;

    // 날씨가 'Clear'인 경우 query를 'sunny'로 설정
    if (weatherDescription === 'Clear') {
      query = 'sunny';
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=playlist`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Spotify data');
    }

    const spotifyData = await response.json();
    if (spotifyData.playlists.items.length === 0) {
      throw new Error('No playlists found');
    }

    renderPlaylists(spotifyData.playlists.items);
  };

  const loadMusic = async (tracks, token, weatherDescription) => {
    try {
      const musicInfo = await Promise.all(
        tracks.map(async (track) => {
          const features = await fetchTrackFeatures(track.id, token);
          let musicDescription = {
            id: track.id,
            releaseDate: track.album.release_date,
            songName: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            albumCover: track.album.images[2].url,
            playMusic: track.preview_url,
            danceability: features.danceability,
            energy: features.energy,
            tempo: features.tempo,
            valence: features.valence,
            mood: [weatherDescription],
          };

          return matchWeatherWithSong(musicDescription);
        })
      );

      return musicInfo;
    } catch (error) {
      console.log('Error loading music:', error);
    }
  };

  const matchWeather = (weather) => {
    switch (weather) {
      case 'Clear':
        return '화창한 날';
      case 'Clouds':
        return '비온 후/ 맑게 갠';
      case 'Snow':
        return '눈오는 날';
      case 'Rain':
        return '비/ 흐림';
      default:
    }
  };

  const matchWeatherWithSong = (eachInfo) => {
    const weather = eachInfo.mood[0];
    if (weather === '화창한 날') {
      if (
        0.55 < eachInfo.valence &&
        70 < eachInfo.tempo &&
        eachInfo.tempo < 130
      ) {
        eachInfo.mood.push(
          '화창한 날',
          'sunny clear',
          '밝은 날',
          'bright day',
          '명랑한 날',
          'cheerful day',
          '행복한 햇살',
          'happy sunshine',
          '빛나는 날',
          'radiant day'
        );
      }
    } else if (weather === '비온 후/ 맑게 갠') {
      if (
        (0.7 < eachInfo.danceability &&
          eachInfo.danceability < 0.85 &&
          0.5 < eachInfo.energy &&
          eachInfo.energy < 0.7) ||
        (0.3 < eachInfo.valence &&
          eachInfo.valence < 0.4 &&
          eachInfo.tempo > 160)
      ) {
        eachInfo.mood.push(
          '비온 후',
          '맑게 갠',
          'clear after rain',
          '상쾌한',
          'refreshed',
          '새로워진',
          'renewed',
          '활기찬',
          'revitalized',
          '맑은 하늘',
          'clean sky'
        );
      }
    } else if (weather === '눈오는 날') {
      if (
        (eachInfo.songName.indexOf('눈') !== -1 ||
          eachInfo.songName.indexOf('겨울') !== -1 ||
          eachInfo.songName.toLowerCase().indexOf('snow') !== -1 ||
          eachInfo.songName.toLowerCase().indexOf('winter') !== -1) &&
        (parseInt(eachInfo.releaseDate.split('-')[1]) <= 2 ||
          parseInt(eachInfo.releaseDate.split('-')[1]) >= 11)
      ) {
        eachInfo.mood.push(
          '눈오는 날',
          'snowy day',
          '겨울 원더랜드',
          'winter wonderland',
          '하얀 날',
          'white day',
          '서리 내리는 날',
          'frosty day',
          '쌀쌀한 날',
          'chilly day'
        );
      }
    } else if (weather === '비/ 흐림') {
      if (
        (eachInfo.danceability < 0.71 &&
          eachInfo.energy < 0.66 &&
          eachInfo.valence < 0.55 &&
          eachInfo.tempo < 100) ||
        eachInfo.songName.indexOf('비') !== -1 ||
        eachInfo.songName.indexOf('빗') !== -1 ||
        eachInfo.songName.indexOf('우산') !== -1 ||
        eachInfo.songName.indexOf('장마') !== -1 ||
        eachInfo.songName.toLowerCase().indexOf('rain') !== -1
      ) {
        eachInfo.mood.push(
          '비/ 흐림',
          'rainy/cloudy',
          '음울한 날',
          'dreary day',
          '우울한 날',
          'gloomy day',
          '이슬비 내리는 날',
          'drizzly day',
          '젖은 날',
          'wet day'
        );
      }
    }
    return eachInfo;
  };

  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('weather-menu-btn')) {
      const section = document.querySelector('#section');
      section.innerHTML = '';
      getWeatherInfo();
      getWeatherIcon();

      // .weather-playlist-row의 overflow 속성을 visible로 설정
      const weatherPlaylistRow = document.querySelector(
        '.weather-playlist-row'
      );
      if (weatherPlaylistRow) {
        weatherPlaylistRow.style.overflow = 'visible';
      }
    }
  });
});
