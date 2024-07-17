let url;
let artistNames = [];
let clickedName;

let topTrackList = [];

// 토큰 설정
const getAccessToken = async (CLIENT_ID, CLIENT_SECRET) => {
  const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

// Spotify API 호출(변경필요)
const callSpotifyAPI = async () => {
  const CLIENT_ID = `03e132602b064240889cad723e1e7500`;
  const CLIENT_SECRET = `5eb49937181f4e58bf9a6bb9fdd6a0b7`;

  const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${clickedName}&type=artist`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  console.log(data.artists.items[0].name);
  console.log(data.artists.items[0].id);
  console.log(data.artists.items[0].href);
  url = data.artists.items[0].href;
  fetchArtist(url, token);
  fetchArtistAlbum(url + "/albums", token);
  fetchArtistTopTrack(url + "/top-tracks", token);
  fetchArtistTopRelated(url + "/related-artists", token);
};

// 클릭 이벤트 리스너 추가 (변경필요)
const artistText = document.querySelector(".artist-artist-name");
artistText.addEventListener("click", () => {
  clickedName = artistText.textContent.toLocaleLowerCase();
  console.log("클릭된 아티스트 이름: ", clickedName);
  callSpotifyAPI();
});

// 아티스트 정보 fetch
const fetchArtist = async (artistURL, token) => {
  const response = await fetch(artistURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const artistData = await response.json();
  console.log("fetchArtist", artistData);
  artistHeader(artistData);
};

// 아티스트 페이지 헤더(변경필요)
const artistHeader = (artistData) => {
  let artistHeaderHTML = `<section id="artist-header">
            <div class="overlay-text">
            <div class="artist-artist-name">NewJeans</div>
            <div class="artist-monthly-listener">${
              artistData.followers.total.toLocaleString() + " " + "followers"
            }</div>
          </div>
          <div class="artist-contents-card">
            <div class="artist-card-img-box">
              <div class="artist-card-play-btn"></div>
              <div class="artist-card-img">
                <img
                  src="${artistData.images[1].url}"
                  alt=""
                />
            </div>
            </div>
          </div>
          </section>`;
  document.getElementById("artist-header").innerHTML = artistHeaderHTML;
};

// 아티스트 앨범 정보 fetch
const fetchArtistAlbum = async (artistURL, token) => {
  const response = await fetch(artistURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const artistData = await response.json();
  console.log("fetchArtistAlbum", artistData);
};

// 아티스트 탑트랙 정보 fetch
const fetchArtistTopTrack = async (artistURL, token) => {
  const response = await fetch(artistURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const artistData = await response.json();
  console.log("fetchArtistTopTrack", artistData);

  topTrackList = artistData.tracks;
  console.log(topTrackList);
  renderTopTracks();
};

// 아티스트의 탑트랙 렌더링
const renderTopTracks = () => {
  let topTracksHTML = ``;
  topTrackList.slice(0, 5).forEach((list, index) => {
    const duration = formatDuration(list.duration_ms);

    topTracksHTML += `<div class="row artist-popular-chart">
                <div class="col-lg-1 text-center">${index + 1}</div>
                <div class="col-lg-1"><i class="fa-solid fa-play"></i></div>
                  <div class="col-lg-1">
                  <img
                    class="artist-popular-img"
                    src="${list.album.images[0].url}"
                  />
                </div>
                <div class="col-lg-4 artist-song-name">${list.name}</div>
                <div class="col-lg-2">${list.artists[0].name}</div>
                <div class="col-lg-1 text-center"><i class="fa-regular fa-heart heart-icon" style="display: none"></i></div>
                <div class="col-lg-1 text-center">${duration}</div>
                <div class="col-lg-1 text-center"><span class="more-icon" style="display: none">&middot;&middot;&middot;</span></div>
              </div>`;
  });
  const container = document.querySelector(".artist-popular-chart"); // 처음 한줄만 적용하면 자동으로 아래줄 완성
  container.innerHTML = topTracksHTML;

  // hover 이벤트리스너
  const trackElements = container.querySelectorAll(".artist-popular-chart"); // 차트 5개 모두 순회
  trackElements.forEach((trackElement) => {
    trackElement.addEventListener("mouseenter", () => {
      trackElement.style.backgroundColor = "#2A2E33";
      trackElement.querySelector(".heart-icon").style.display = "inline-block";
      trackElement.querySelector(".more-icon").style.display = "inline-block";
    });

    trackElement.addEventListener("mouseleave", () => {
      trackElement.style.backgroundColor = "";
      trackElement.querySelector(".heart-icon").style.display = "none";
      trackElement.querySelector(".more-icon").style.display = "none";
    });
  });
};

// 밀리초를 분과 초로 변환하는 함수
const formatDuration = (durationMs) => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// 비슷한 아티스트 정보 fetch
const fetchArtistTopRelated = async (artistURL, token) => {
  const response = await fetch(artistURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const artistData = await response.json();
  console.log("fetchArtistTopRelated", artistData);
};
