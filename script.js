const SHEET_URL = "https://opensheet.elk.sh/18-BGDh4RSMRS-4sqh41xZzhWZWtqCdE-qdeUFsP9Avk/Sheet1";

let sets = [];

/* =========================
   FETCH DATA
========================= */

async function fetchData() {

  try {

    const response = await fetch(SHEET_URL);

    const data = await response.json();

    sets = data.map(item => ({
      party: item.party?.trim() || "",
      room: item.room?.trim() || "",
      artist: item.artist?.trim() || "",
      start: item.start,
      end: item.end
    }));

    /* SORT BY START TIME */

    sets.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });

    render();

  } catch (error) {

    console.error("ERROR LOADING SHEET:", error);

  }

}

/* =========================
   FORMAT TIME
========================= */

function formatTime(dateString) {

  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

}

/* =========================
   STATUS
========================= */

function getStatus(set) {

  const now = new Date();

  const start = new Date(set.start);
  const end = new Date(set.end);

  const nowTime = now.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (nowTime >= startTime && nowTime < endTime) {
    return "live";
  }

  if (nowTime >= endTime) {
    return "done";
  }

  return "upcoming";

}

/* =========================
   RENDER
========================= */

function render() {

  const container = document.getElementById("ascension-terminal");

  /* GROUP BY PARTY */

  const grouped = {};

  sets.forEach(set => {

    const cleanParty = set.party.trim().toUpperCase();

    if (!grouped[cleanParty]) {
      grouped[cleanParty] = [];
    }

    grouped[cleanParty].push(set);

  });

  container.innerHTML = `
    <div class="terminal">

      ${Object.entries(grouped).map(([party, partySets]) => {

        return `

          <div class="party-section">

            <div class="party-header">
              ${party}
            </div>

            <div class="header-row">
              <div>START</div>
              <div>ARTIST</div>
              <div>ROOM</div>
            </div>

            ${partySets.map(set => {

              const status = getStatus(set);

              return `

                <div class="set ${status}">

                  <div class="line">

                    <div class="time">
                      ${formatTime(set.start)}
                    </div>

                    <div class="artist">
                      ${set.artist}
                    </div>

                    <div class="room">
                      ${set.room}
                    </div>

                  </div>

                </div>

              `;

            }).join("")}

          </div>

        `;

      }).join("")}

    </div>
  `;

}

/* =========================
   INITIAL LOAD
========================= */

fetchData();

/* =========================
   AUTO REFRESH
========================= */

setInterval(fetchData, 60000);

console.log(
  set.artist,
  "START:", new Date(set.start).toString(),
  "END:", new Date(set.end).toString(),
  "STATUS:", getStatus(set)
);
