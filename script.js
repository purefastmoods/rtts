const SHEET_URL = "https://opensheet.elk.sh/18-BGDh4RSMRS-4sqh41xZzhWZWtqCdE-qdeUFsP9Avk/Sheet1";

let sets = [];

async function fetchData() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();

  sets = data.map(row => ({
    eventDate: row.event_date,
    party: row.party,
    artist: row.artist,
    room: row.room,
    start: new Date(row.start),
    end: new Date(row.end)
  }));

  render();
}

function getStatus(set, now) {
  if (now >= set.start && now <= set.end) return "live";
  if (now > set.end) return "done";
  return "upcoming";
}

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(dateString) {
  return dateString;
}

function render() {
  const now = new Date();

  const container = document.getElementById("ascension-terminal");

  container.innerHTML = `
    <div class="terminal">

      <div class="header-row">
        <div>START</div>
        <div>ARTIST</div>
        <div>ROOM</div>
        <div>EVENT</div>
      </div>

      ${sets.map(set => {

        const status = getStatus(set, now);

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

              <div class="party">
                ${set.party}
              </div>

            </div>

          </div>
        `;
      }).join("")}

    </div>
  `;
}

setInterval(render, 1000);
setInterval(fetchData, 300000);

fetchData();
