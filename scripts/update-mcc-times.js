#!/usr/bin/env node

/**
 * Halo MCC Campaign Times Updater
 *
 * Pulls Halo Waypoint MCC campaign service-record endpoints and updates:
 * public/data/campaign_times.json
 *
 * Requires one of these environment variables:
 * - MCC_API_SPARTAN_TOKEN   Recommended. Value from the x-343-authorization-spartan request header.
 * - MCC_API_COOKIE          Optional fallback. Full cookie value/header value.
 * - MCC_API_AUTHORIZATION   Optional fallback if your request uses an Authorization header.
 *
 * Optional environment variables:
 * - GAMERTAG=Cujo3211
 * - CAMPAIGN_TIMES_PATH=public/data/campaign_times.json
 * - MCC_API_DRY_RUN=1
 */

const fs = require("fs");
const path = require("path");

const GAMERTAG = process.env.GAMERTAG || "Cujo3211";
const CAMPAIGN_TIMES_PATH = process.env.CAMPAIGN_TIMES_PATH || path.join("public", "data", "campaign_times.json");
const DRY_RUN = process.env.MCC_API_DRY_RUN === "1" || process.env.MCC_API_DRY_RUN === "true";

const RAW_SPARTAN_TOKEN = process.env.MCC_API_SPARTAN_TOKEN || "";
const RAW_COOKIE = process.env.MCC_API_COOKIE || "";
const RAW_AUTHORIZATION = process.env.MCC_API_AUTHORIZATION || "";

if (!RAW_SPARTAN_TOKEN && !RAW_COOKIE && !RAW_AUTHORIZATION) {
  console.error("Missing auth. Set MCC_API_SPARTAN_TOKEN as a GitHub Actions secret or local env var.");
  process.exit(1);
}

function cleanHeaderValue(value, headerName) {
  if (!value) return "";
  const trimmed = String(value).trim();
  const lower = trimmed.toLowerCase();
  const prefix = `${headerName.toLowerCase()}:`;
  if (lower.startsWith(prefix)) {
    return trimmed.slice(prefix.length).trim();
  }
  return trimmed;
}

const SPARTAN_TOKEN = cleanHeaderValue(RAW_SPARTAN_TOKEN, "x-343-authorization-spartan");
const COOKIE = cleanHeaderValue(RAW_COOKIE, "cookie");
const AUTHORIZATION = cleanHeaderValue(RAW_AUTHORIZATION, "authorization");

const BASE_URL = `https://mccapi.svc.halowaypoint.com/hmcc/users/gt(${encodeURIComponent(GAMERTAG)})/service-record`;

const ENDPOINTS = {
  ce: `${BASE_URL}/h1/campaign`,
  h2: `${BASE_URL}/h2/campaign`,
  h3: `${BASE_URL}/h3/campaign`,
  h4: `${BASE_URL}/h4/campaign`,
  odst: `${BASE_URL}/odst/campaign`,
  reach: `${BASE_URL}/reach/campaign`,
};

const ORDER_MAP = {
  ce: [
    "The Pillar of Autumn",
    "Halo",
    "The Truth and Reconciliation",
    "The Silent Cartographer",
    "Assault on the Control Room",
    "343 Guilty Spark",
    "The Library",
    "Two Betrayals",
    "Keyes",
    "The Maw",
  ],
  h2: [
    "Cairo Station",
    "Outskirts",
    "Metropolis",
    "The Arbiter",
    "The Oracle",
    "Delta Halo",
    "Regret",
    "Sacred Icon",
    "Quarantine Zone",
    "Gravemind",
    "Uprising",
    "High Charity",
    "The Great Journey",
  ],
  h3: [
    "Sierra 117",
    "Crow's Nest",
    "Tsavo Highway",
    "The Storm",
    "Floodgate",
    "The Ark",
    "The Covenant",
    "Cortana",
    "Halo",
  ],
  h4: [
    "Dawn",
    "Requiem",
    "Forerunner",
    "Infinity",
    "Reclaimer",
    "Shutdown",
    "Composer",
    "Midnight",
  ],
  odst: [
    "Tayari Plaza",
    "Uplift Reserve",
    "Kizingo Boulevard",
    "ONI Alpha Site",
    "NMPD HQ",
    "Kikowani Station",
    "Data Hive",
    "Coastal Highway",
  ],
  reach: [
    "Winter Contingency",
    "ONI: Sword Base",
    "Nightfall",
    "Tip of the Spear",
    "Long Night of Solace",
    "Exodus",
    "New Alexandria",
    "The Package",
    "The Pillar of Autumn",
    null,
    "Lone Wolf",
  ],
};


const REMOVED_MISSION_NAMES = new Set([
  "Prepare To Drop",
  "Prepare to Drop",
  "Mombasa Streets",
  "Noble Actual",
]);

function sanitizeRemovedMissions(data) {
  for (const game of Object.values(data)) {
    if (!game || !Array.isArray(game.missions)) continue;
    game.missions = game.missions.filter((mission) => !REMOVED_MISSION_NAMES.has(mission.name));
  }
  return data;
}

const MAP_ID_MAP = {
  h2: {
    31: "Cairo Station",
    32: "Outskirts",
    33: "Metropolis",
    34: "The Arbiter",
    35: "The Oracle",
    36: "Delta Halo",
    37: "Regret",
    38: "Sacred Icon",
    39: "Quarantine Zone",
    40: "Gravemind",
    41: "Uprising",
    42: "High Charity",
    43: "The Great Journey",
  },
  reach: {
    179: "Winter Contingency",
    180: "ONI: Sword Base",
    181: "Nightfall",
    182: "Tip of the Spear",
    183: "Long Night of Solace",
    184: "Exodus",
    185: "New Alexandria",
    186: "The Package",
    187: "The Pillar of Autumn",
    188: null,
    189: "Lone Wolf",
  },
};

function msToTime(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return "";
  const totalSeconds = Math.round(n / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function missionNameFor(gameKey, record, index) {
  const map = MAP_ID_MAP[gameKey];
  if (map && Object.prototype.hasOwnProperty.call(map, record.mapId)) {
    return map[record.mapId];
  }
  return ORDER_MAP[gameKey]?.[index] || null;
}

async function fetchJson(url) {
  const headers = {
    accept: "application/json",
    "user-agent": "Halo-MCC-Tracker-Updater/1.0",
  };

  if (SPARTAN_TOKEN) headers["x-343-authorization-spartan"] = SPARTAN_TOKEN;
  if (COOKIE) headers.cookie = COOKIE;
  if (AUTHORIZATION) headers.authorization = AUTHORIZATION;

  const response = await fetch(url, { headers });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${url}\n${text.slice(0, 500)}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON from ${url}: ${err.message}\n${text.slice(0, 500)}`);
  }
}

function updateGame(data, gameKey, payload) {
  const game = data[gameKey];
  if (!game || !Array.isArray(game.missions)) {
    throw new Error(`Missing game/missions in campaign_times.json: ${gameKey}`);
  }

  const missions = Array.isArray(payload?.missions) ? payload.missions : [];
  const changes = [];

  missions.forEach((record, index) => {
    const missionName = missionNameFor(gameKey, record, index);
    if (!missionName) return;

    const mission = game.missions.find((m) => m.name === missionName);
    if (!mission) return;

    const pulledSolo = msToTime(record?.legendary?.bestTimeMsSinglePlayer);
    const pulledCoop = msToTime(record?.legendary?.bestTimeMsCoop);

    if (pulledSolo && mission.solo !== pulledSolo) {
      changes.push({
        game: gameKey,
        mission: missionName,
        field: "solo",
        from: mission.solo || "",
        to: pulledSolo,
        rawMs: record.legendary.bestTimeMsSinglePlayer,
      });
      mission.solo = pulledSolo;
    }

    if (pulledCoop && mission.coop !== pulledCoop) {
      changes.push({
        game: gameKey,
        mission: missionName,
        field: "coop",
        from: mission.coop || "",
        to: pulledCoop,
        rawMs: record.legendary.bestTimeMsCoop,
      });
      mission.coop = pulledCoop;
    }
  });

  return changes;
}

async function main() {
  const dataPath = path.resolve(process.cwd(), CAMPAIGN_TIMES_PATH);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Could not find ${CAMPAIGN_TIMES_PATH} at ${dataPath}`);
  }

  const data = sanitizeRemovedMissions(JSON.parse(fs.readFileSync(dataPath, "utf8")));
  const allChanges = [];

  for (const [gameKey, url] of Object.entries(ENDPOINTS)) {
    console.log(`Pulling ${gameKey}: ${url}`);
    const payload = await fetchJson(url);
    const changes = updateGame(data, gameKey, payload);
    console.log(`  ${changes.length} value(s) changed for ${gameKey}`);
    allChanges.push(...changes);
  }

  console.log("\nChanges:");
  if (!allChanges.length) {
    console.log("  No changes.");
  } else {
    allChanges.forEach((change) => {
      console.log(`  ${change.game} / ${change.mission} / ${change.field}: ${change.from || "—"} -> ${change.to} (${change.rawMs} ms)`);
    });
  }

  if (DRY_RUN) {
    console.log("\nDry run enabled. campaign_times.json was not written.");
    return;
  }

  sanitizeRemovedMissions(data);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`\nUpdated ${CAMPAIGN_TIMES_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
