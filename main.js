const header = document.querySelector(".topbar");
const progress = document.querySelector(".progress span");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const links = [...document.querySelectorAll(".nav a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function onScroll() {
  const scrolled = window.scrollY > 8;
  header.classList.toggle("is-stuck", scrolled);
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = height > 0 ? Math.min(1, window.scrollY / height) : 0;
  progress.style.width = `${ratio * 100}%`;

  const mark = window.scrollY + header.offsetHeight + 48;
  let current = null;
  for (const section of sections) {
    if (section.offsetTop <= mark) current = section;
  }
  links.forEach((link) => {
    const on = current && link.getAttribute("href") === `#${current.id}`;
    if (on) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggleLabel = toggle.querySelector(".sr-only");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggleLabel.textContent = open ? "Đóng mục lục" : "Mở mục lục";
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggleLabel.textContent = "Mở mục lục";
  }
});

const search = document.querySelector("#q");
const rows = [...document.querySelectorAll("[data-row]")];
const chips = [...document.querySelectorAll(".chips button")];
const count = document.querySelector("#count");
const empty = document.querySelector(".empty");
let province = "all";

function fold(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function applyFilter() {
  const query = fold(search.value.trim());
  let visible = 0;
  for (const row of rows) {
    const hay = fold(row.dataset.hay);
    const okProvince = province === "all" || row.dataset.province === province;
    const okQuery = !query || hay.includes(query);
    const show = okProvince && okQuery;
    row.hidden = !show;
    if (show) visible += 1;
  }
  count.textContent = visible === 11 ? "11 di tích" : `${visible} di tích đang hiện`;
  empty.classList.toggle("show", visible === 0);
}

search.addEventListener("input", applyFilter);
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    province = chip.dataset.filter;
    chips.forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
    applyFilter();
  });
});

const dialog = document.querySelector("#lightbox");
const dialogImg = dialog.querySelector("img");
const dialogCap = dialog.querySelector("p");

document.querySelectorAll("[data-zoom]").forEach((img) => {
  img.addEventListener("click", () => {
    dialogImg.src = img.currentSrc || img.src;
    dialogImg.alt = img.alt;
    const caption = img.closest("figure")?.querySelector("figcaption");
    dialogCap.textContent = caption ? caption.textContent.trim() : img.alt;
    dialog.showModal();
  });
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  dialogImg.removeAttribute("src");
});

const places = {
  "trung-thuan": {
    zoom: 14,
    hint: "Nhấp ghim bia di tích, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Bia di tích Chiến khu Trung Thuần",
        lat: 17.82146,
        lon: 106.33822,
        note: "Xã Trung Thuần, Quảng Trạch",
      },
    ],
  },
  "ben-pha-gianh": {
    zoom: 15,
    hint: "Nhấp ghim đài tưởng niệm bên cầu Gianh, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Di tích Bến phà Gianh",
        lat: 17.7166718,
        lon: 106.4446872,
        note: "Quốc lộ 1, phường Bắc Gianh",
      },
    ],
  },
  "hang-tam": {
    zoom: 14,
    hint: "Nhấp ghim nơi tưởng niệm trên đường 20, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Hang Tám thanh niên xung phong",
        lat: 17.5026045,
        lon: 106.2603225,
        note: "Quốc lộ 9G, km 16 đường 20 Quyết Thắng",
      },
    ],
  },
  "duong-truong-son": {
    hint: "Tuyến đi qua cả tỉnh. Nhấp một điểm có ghim để chỉ đường tới điểm đó.",
    points: [
      {
        name: "Cầu Khe Rinh",
        lat: 17.7347037,
        lon: 105.9604805,
        note: "Đường Hồ Chí Minh, Kim Phú",
      },
      {
        name: "Đèo Đá Đẽo",
        lat: 17.6480286,
        lon: 106.0889174,
        note: "Đài tưởng niệm trên đường Hồ Chí Minh",
      },
      {
        name: "Đền tưởng niệm cầu Long Đại",
        lat: 17.3256443,
        lon: 106.6229322,
        note: "Bến phà Long Đại xưa",
      },
    ],
  },
  "xuan-son": {
    zoom: 14,
    hint: "Nhấp ghim đài tưởng niệm Xuân Sơn, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Bến phà Xuân Sơn",
        lat: 17.6101954,
        lon: 106.3166617,
        note: "Quốc lộ 9G, Phong Nha",
      },
    ],
  },
  "len-ha": {
    zoom: 12,
    hint: "Hang chưa có ghim riêng trên bản đồ mở. Ghim đặt tại Đồng Lê; Chỉ đường mở theo tên di tích trên Google Maps.",
    points: [
      {
        name: "Hang Lèn Hà",
        lat: 17.8881795,
        lon: 106.022186,
        note: "Xã Thanh Hóa, Tuyên Hóa. Ghim này là thị trấn Đồng Lê, cách đường vào hang khoảng vài kilômét.",
        query: "Hang Lèn Hà, Tuyên Hóa, Quảng Bình",
      },
    ],
  },
  "thanh-co": {
    zoom: 16,
    hint: "Nhấp ghim trong thành, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Thành cổ Quảng Trị",
        lat: 16.7539122,
        lon: 107.1895187,
        note: "Phường Quảng Trị",
      },
    ],
  },
  "vinh-moc": {
    zoom: 15,
    hint: "Nhấp ghim nhà đón khách địa đạo, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Địa đạo Vịnh Mốc",
        lat: 17.07467,
        lon: 107.1127984,
        note: "Vịnh Mốc, Vĩnh Linh",
      },
    ],
  },
  "hien-luong": {
    zoom: 16,
    hint: "Nhấp ghim cầu Hiền Lương, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Cầu Hiền Lương – sông Bến Hải",
        lat: 17.003899,
        lon: 107.0514844,
        note: "Đôi bờ Vĩnh Linh và Gio Linh",
      },
    ],
  },
  "truong-son": {
    zoom: 15,
    hint: "Nhấp ghim nghĩa trang, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Nghĩa trang Liệt sĩ Quốc gia Trường Sơn",
        lat: 16.9574954,
        lon: 106.9547331,
        note: "Bến Tắt, Gio Linh",
      },
    ],
  },
  "lao-bao": {
    zoom: 16,
    hint: "Nhấp ghim khu tưởng niệm nhà tù, rồi chọn Chỉ đường.",
    points: [
      {
        name: "Nhà tù Lao Bảo",
        lat: 16.6111584,
        lon: 106.587657,
        note: "Đường Lê Thế Tiết, Lao Bảo",
      },
    ],
  },
};

function googleDir(point) {
  const destination = point.query
    ? encodeURIComponent(point.query)
    : `${point.lat},${point.lon}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}

function formatRoute(meters, seconds) {
  const km = meters / 1000;
  const distance = km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
  const minutes = Math.max(1, Math.round(seconds / 60));
  const duration = minutes >= 60 ? `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút` : `${minutes} phút`;
  return `${distance} · khoảng ${duration} bằng ô tô`;
}

function popupHtml(point) {
  const exhibit = point.exhibitId ? `<a href="#${point.exhibitId}">Xem hiện vật</a>` : "";
  const direct = point.query
    ? `<a href="${googleDir(point)}" target="_blank" rel="noopener">Chỉ đường trên Google Maps</a>`
    : `<button type="button" data-dir>Chỉ đường</button>
      <a href="${googleDir(point)}" target="_blank" rel="noopener">Google Maps</a>`;
  return `<div class="pin-card">
    <strong>${point.name}</strong>
    <span>${point.note}</span>
    <div class="pin-actions">${direct}${exhibit}</div>
  </div>`;
}

function drawRoute(map, status, origin, point) {
  status.textContent = "Đang tính đường đi…";
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${point.lon},${point.lat}?overview=full&geometries=geojson`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("route");
      return response.json();
    })
    .then((data) => {
      const route = data.routes && data.routes[0];
      if (!route) throw new Error("route");
      if (map._routeLine) map.removeLayer(map._routeLine);
      if (map._originPin) map.removeLayer(map._originPin);
      map._routeLine = L.geoJSON(route.geometry, {
        style: { color: "#8d2424", weight: 4, opacity: 0.9 },
      }).addTo(map);
      map._originPin = L.circleMarker([origin.lat, origin.lon], {
        radius: 6,
        color: "#1b1714",
        weight: 2,
        fillColor: "#c6ae80",
        fillOpacity: 1,
      }).addTo(map);
      map.fitBounds(map._routeLine.getBounds(), { padding: [28, 28] });
      status.textContent = `Lộ trình tới ${point.name}: ${formatRoute(route.distance, route.duration)}.`;
    })
    .catch(() => {
      status.textContent = "Chưa vẽ được lộ trình trên trang. Hãy mở Google Maps.";
    });
}

function askAndRoute(map, status, point) {
  if (!navigator.geolocation) {
    status.textContent = "Trình duyệt không hỗ trợ định vị. Hãy mở Google Maps.";
    return;
  }
  status.textContent = "Đang xin vị trí của bạn…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      drawRoute(map, status, { lat: pos.coords.latitude, lon: pos.coords.longitude }, point);
    },
    () => {
      status.textContent = "Chưa nhận được vị trí. Hãy cho phép định vị, hoặc mở Google Maps.";
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
  );
}

function showMapFallback(host, place) {
  const link = place
    ? `<a href="${googleDir(place.points[0])}" target="_blank" rel="noopener">Mở chỉ đường trên Google Maps</a>`
    : `<a href="https://www.google.com/maps/search/?api=1&query=di+tich+Quang+Binh+Quang+Tri" target="_blank" rel="noopener">Mở Google Maps</a>`;
  host.innerHTML = `<div class="sitemap-canvas sitemap-fallback" role="status"></div><div class="sitemap-bar"><p>Bản đồ cần kết nối mạng (Leaflet). ${link}</p></div>`;
}

function mountMap(host, place) {
  if (!place || !place.points || !place.points.length) {
    showMapFallback(host, null);
    return null;
  }
  if (!window.L) {
    showMapFallback(host, place);
    return null;
  }

  const label = place.points.length === 1 ? place.points[0].name : "các điểm di tích";
  host.innerHTML = `<div class="sitemap-canvas" role="application" aria-label="Bản đồ ${label}"></div><div class="sitemap-bar"><p></p></div>`;
  const canvas = host.querySelector(".sitemap-canvas");
  const status = host.querySelector(".sitemap-bar p");
  status.textContent = place.hint || "Nhấp ghim để xem chi tiết.";

  try {
    const map = L.map(canvas, {
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, OpenStreetMap',
    }).addTo(map);

    const icon = L.divIcon({
      className: "map-pin-wrap",
      html: '<div class="map-pin"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -10],
    });

    const layers = place.points.map((point) => {
      const marker = L.marker([point.lat, point.lon], {
        icon,
        title: point.name,
        alt: point.name,
      });
      marker.bindPopup(popupHtml(point));
      marker.on("popupopen", (event) => {
        const button = event.popup.getElement()?.querySelector("[data-dir]");
        if (!button) return;
        button.onclick = () => askAndRoute(map, status, point);
      });
      return marker;
    });

    const group = L.featureGroup(layers).addTo(map);
    if (place.points.length === 1 && place.zoom) {
      map.setView([place.points[0].lat, place.points[0].lon], place.zoom);
    } else {
      map.fitBounds(group.getBounds(), { padding: [36, 36], maxZoom: 15 });
    }

    canvas.addEventListener("click", () => map.scrollWheelZoom.enable());
    canvas.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

    // Leaflet needs a visible size; retry after layout settles
    const refresh = () => {
      try {
        map.invalidateSize();
      } catch (_) {}
    };
    requestAnimationFrame(refresh);
    setTimeout(refresh, 100);
    setTimeout(refresh, 400);
    setTimeout(refresh, 1000);

    host.dataset.ready = "true";
    return map;
  } catch (err) {
    console.error("Không tạo được bản đồ:", err);
    showMapFallback(host, place);
    return null;
  }
}

function placeForHost(host, overviewPoints) {
  const id = host.dataset.map;
  if (id === "overview") {
    return {
      hint: "Nhấp một ghim. Chỉ đường vẽ lộ trình từ vị trí của bạn; Google Maps mở cùng điểm đến.",
      points: overviewPoints,
    };
  }
  return places[id] || null;
}

function bootMaps() {
  const mapHosts = [...document.querySelectorAll("[data-map]")];
  if (!mapHosts.length) return;

  const overviewPoints = Object.entries(places).flatMap(([id, place]) =>
    place.points.map((point) => ({ ...point, exhibitId: id }))
  );

  function initHost(host) {
    if (host.dataset.ready) return;
    const place = placeForHost(host, overviewPoints);
    if (!place) {
      showMapFallback(host, null);
      host.dataset.ready = "true";
      return;
    }
    mountMap(host, place);
  }

  function start() {
    if (!window.L) {
      mapHosts.forEach((host) => {
        const place = placeForHost(host, overviewPoints);
        showMapFallback(host, place);
        host.dataset.ready = "true";
      });
      return;
    }

    // Mount maps already near the viewport immediately
    mapHosts.forEach((host) => {
      const rect = host.getBoundingClientRect();
      const near =
        rect.top < window.innerHeight + 320 && rect.bottom > -320;
      if (near) initHost(host);
    });

    // Lazy-load the rest when scrolled into view
    if ("IntersectionObserver" in window) {
      const watch = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            initHost(entry.target);
            watch.unobserve(entry.target);
          });
        },
        { rootMargin: "320px 0px", threshold: 0.01 }
      );
      mapHosts.forEach((host) => {
        if (!host.dataset.ready) watch.observe(host);
      });
    } else {
      mapHosts.forEach(initHost);
    }
  }

  // Leaflet script is before main.js, but wait briefly if still loading
  if (window.L) {
    start();
  } else {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.L || tries > 40) {
        clearInterval(timer);
        start();
      }
    }, 100);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootMaps);
} else {
  bootMaps();
}
