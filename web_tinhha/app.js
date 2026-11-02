const storageKey = "top9-sayhi-v3";
const seasonIds = seasons.map((season) => season.id);
const blankState = () => ({
  selectedSeasons: [...seasonIds],
  customMembers: { "2024": [], "2025": [], "tinh-ha": [] },
  game: null
});
const gameStages = ["prelim", "ranking", "result"];
let state = blankState();
let activeFilter = "all";
let alphabetical = false;
let gameStarted = false;
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const toast = $("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2500);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function initials(name) {
  return name.trim().split(/\s+/).slice(-2).map((part) => part[0] || "").join("").toUpperCase();
}

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem("top9-sayhi-v2");
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") throw new Error("Dữ liệu lưu không hợp lệ");
    const next = blankState();
    if (Array.isArray(parsed.selectedSeasons)) {
      next.selectedSeasons = [...new Set(parsed.selectedSeasons.filter((id) => seasonIds.includes(id)))];
    }
    for (const season of seasons) {
      const custom = parsed.customMembers && Array.isArray(parsed.customMembers[season.id])
        ? parsed.customMembers[season.id] : [];
      next.customMembers[season.id] = custom.filter((member) =>
        member && typeof member.id === "string" && typeof member.name === "string"
      );
    }
    if (parsed.game && gameStages.includes(parsed.game.stage) && Array.isArray(parsed.game.allIds)) {
      next.game = {
        ...parsed.game,
        phase: parsed.game.phase === "revival" ? "revival" : "selection",
        firstRoundWinners: Array.isArray(parsed.game.firstRoundWinners) ? parsed.game.firstRoundWinners : []
      };
    }
    state = next;
    if (state.game) {
      const availableIds = new Set(currentMembers().map((member) => member.id));
      const uniqueIds = new Set(state.game.allIds);
      if (uniqueIds.size !== state.game.allIds.length ||
          state.game.allIds.some((id) => !availableIds.has(id))) {
        state.game = null;
      }
    }
    gameStarted = Boolean(state.game);
  } catch (error) {
    console.error("Không thể đọc dữ liệu đã lưu.", error);
    showToast("Không đọc được dữ liệu đã lưu; trang đang mở với cài đặt mới.");
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    $("#save-state").textContent = "Tự động lưu";
  } catch (error) {
    console.error("Không thể lưu tiến trình Top 9.", error);
    $("#save-state").textContent = "Chưa lưu được";
    showToast("Trình duyệt không thể lưu thay đổi. Hãy kiểm tra quyền lưu dữ liệu.");
  }
}

function seasonLabel(id) {
  return seasons.find((season) => season.id === id)?.name || id;
}

function currentMembers() {
  const members = [];
  const seen = new Set();
  const aliases = {
    captainboy: "captain",
    dillanhoangphan: "dillan",
    phamdinhthaingan: "thaingan"
  };
  for (const seasonId of state.selectedSeasons) {
    for (const member of [...seasonMembers[seasonId], ...state.customMembers[seasonId]]) {
      const normalizedName = member.name.normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/gi, "d")
        .toLocaleLowerCase("vi")
        .replace(/[^a-z0-9]/g, "");
      const identity = aliases[normalizedName] || normalizedName;
      if (seen.has(identity)) continue;
      seen.add(identity);
      members.push(member);
    }
  }
  return members;
}

function memberMap() {
  return new Map(currentMembers().map((member) => [member.id, member]));
}

function chunks(values, size) {
  const result = [];
  const count = Math.ceil(values.length / size);
  const baseSize = Math.floor(values.length / count);
  const largerGroups = values.length % count;
  let offset = 0;
  for (let index = 0; index < count; index += 1) {
    const groupSize = baseSize + (index < largerGroups ? 1 : 0);
    result.push(values.slice(offset, offset + groupSize));
    offset += groupSize;
  }
  return result;
}

function shuffle(values) {
  const result = values.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function startRanking(ids) {
  state.game.stage = "ranking";
  state.game.finalistIds = ids.slice();
  state.game.sort = {
    runs: ids.map((id) => [id]),
    nextRuns: [],
    pairIndex: 0,
    merge: null,
    comparisons: 0,
    history: []
  };
  if (ids.length <= 1) {
    state.game.rankedIds = ids.slice();
    state.game.stage = "result";
  }
}

function startGame() {
  if (state.selectedSeasons.length === 0) return;
  const ids = shuffle(currentMembers().map((member) => member.id));
  if (ids.length === 0) {
    showToast("Mùa bạn chọn chưa có thành viên. Hãy thêm Anh Trai trước khi bắt đầu.");
    return;
  }
  state.game = {
    seasonIds: state.selectedSeasons.slice(),
    allIds: ids,
    stage: "ranking",
    round: 1,
    boardIndex: 0,
    boards: [],
    candidates: ids.slice(),
    winners: [],
    boardSelection: [],
    phase: "selection",
    firstRoundWinners: [],
    finalistIds: [],
    rankedIds: [],
    resultTitle: "Top 9 Say Hi của tôi",
    sort: null
  };
  gameStarted = true;
  if (ids.length <= 9) startRanking(ids);
  else {
    state.game.stage = "prelim";
    state.game.boards = chunks(ids, 9);
  }
  render();
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getRequiredPicks(board, game = state.game, boardIndex = game.boardIndex) {
  if (game.boards.length <= 3) {
    const basePicks = Math.floor(9 / game.boards.length);
    const extraPicks = 9 % game.boards.length;
    return Math.min(board.length, basePicks + (boardIndex < extraPicks ? 1 : 0));
  }
  return Math.min(3, board.length);
}

function progressGame() {
  const game = state.game;
  const board = game.boards[game.boardIndex];
  game.winners.push(...game.boardSelection);
  game.boardSelection = [];
  game.boardIndex += 1;
  if (game.boardIndex < game.boards.length) return;

  if (game.phase === "selection" && game.round === 1) {
    game.firstRoundWinners = game.winners.slice();
    const selected = new Set(game.firstRoundWinners);
    const eliminated = game.allIds.filter((id) => !selected.has(id));
    if (eliminated.length > 0) {
      game.phase = "revival";
      game.candidates = eliminated;
      game.winners = [];
      game.boards = chunks(eliminated, 9);
      game.boardIndex = 0;
      return;
    }
  }

  if (game.phase === "revival") {
    game.candidates = [...game.firstRoundWinners, ...game.winners];
    game.winners = [];
    game.phase = "selection";
    game.round += 1;
    if (game.candidates.length <= 9) {
      startRanking(game.candidates);
      return;
    }
    game.boards = chunks(game.candidates, 9);
    game.boardIndex = 0;
    return;
  }

  if (game.winners.length > 9) {
    game.round += 1;
    game.candidates = game.winners.slice();
    game.winners = [];
    game.boards = chunks(game.candidates, 9);
    game.boardIndex = 0;
    return;
  }

  startRanking(game.winners.slice(0, 9));
}

function renderFilters() {
  const filters = [{ id: "all", name: "Tất cả" }, ...seasons];
  $("#season-filters").innerHTML = filters.map((filter) =>
    `<button type="button" class="filter-button" data-filter="${filter.id}" aria-pressed="${activeFilter === filter.id}">${escapeHtml(filter.name)}</button>`
  ).join("");
}

function renderSeasonCards() {
  let visibleSeasons = activeFilter === "all"
    ? seasons.slice()
    : seasons.filter((season) => season.id === activeFilter);
  if (alphabetical) visibleSeasons.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  $("#season-grid").innerHTML = visibleSeasons.map((season) => {
    const selected = state.selectedSeasons.includes(season.id);
    const total = season.members + state.customMembers[season.id].length;
    const countLabel = total === 0
      ? "Thêm thành viên để chơi"
      : `${total} thành viên`;
    return `<button type="button" class="season-card" data-season="${season.id}" aria-pressed="${selected}">
      <span class="season-card-name">${escapeHtml(season.name)}</span>
      <span class="season-card-count">${escapeHtml(countLabel)}</span>
      <span class="check-mark" aria-hidden="true">✓</span>
    </button>`;
  }).join("");
  const selectedCount = state.selectedSeasons.length;
  $("#selected-count").textContent = `${selectedCount} mùa`;
  $("#selected-detail").textContent = `${currentMembers().length} Anh Trai có sẵn`;
  $("#start-button").disabled = selectedCount === 0;
}

const LOCAL_ASSET_PREFIX = "ảnh/";
const REMOTE_ASSET_BASE = "https://tinhhaatsh.wwwphai61.workers.dev/";

function photoUrl(photo) {
  const rel = photo.startsWith("assets/") ? photo : `assets/${photo}`;
  return `${LOCAL_ASSET_PREFIX}${rel}`;
}

function rootAssetUrl(photo) {
  return photo.startsWith("assets/") ? photo : `assets/${photo}`;
}

function remotePhotoUrl(photo) {
  return `${REMOTE_ASSET_BASE}${rootAssetUrl(photo)}`;
}

function renderPhotoImg(member, className = "", altText = member.name, lazy = true) {
  const src = escapeHtml(member.photo ? photoUrl(member.photo) : member.imageUrl);
  const cls = className ? ` class="${className}"` : "";
  const loading = lazy ? ' loading="lazy"' : "";
  const fallback = member.photo
    ? ` onerror="if(!this.dataset.step){this.dataset.step='1';this.src='${escapeHtml(rootAssetUrl(member.photo))}';}else if(this.dataset.step==='1'){this.dataset.step='2';this.src='${escapeHtml(remotePhotoUrl(member.photo))}';}"`
    : "";
  return `<img${cls} src="${src}" alt="${escapeHtml(altText)}"${loading}${fallback}>`;
}

function renderMemberCards(ids, selectedIds, limit) {
  const members = memberMap();
  const selected = new Set(selectedIds);
  return ids.map((id) => {
    const member = members.get(id);
    if (!member) return "";
    const isSelected = selected.has(id);
    const isDisabled = !isSelected && selected.size >= limit;
    const image = member.photo || member.imageUrl
      ? renderPhotoImg(member, "", member.name, true)
      : `<span class="member-placeholder" aria-hidden="true">${escapeHtml(initials(member.name))}</span>`;
    return `<button type="button" class="round-member${isSelected ? " selected" : ""}" data-pick-id="${escapeHtml(id)}" aria-pressed="${isSelected}" ${isDisabled ? "disabled" : ""}>
      ${image}<span class="round-member-label">${escapeHtml(member.name)}</span>
    </button>`;
  }).join("");
}

function renderPrelim() {
  const game = state.game;
  const board = game.boards[game.boardIndex] || [];
  const required = getRequiredPicks(board, game, game.boardIndex);
  $("#prelim-round-label").textContent = game.phase === "revival"
    ? "Vòng hồi sinh"
    : `Vòng sơ tuyển ${game.round}`;
  $("#prelim-board-label").textContent = `${game.boardIndex + 1} / ${game.boards.length} lượt`;
  $("#prelim-title").textContent = board.length === 9 ? "9 Anh Trai, chọn 3" : `${board.length} Anh Trai, chọn ${required}`;
  $("#prelim-copy").textContent = game.phase === "revival"
    ? `Chọn ${required} Anh Trai chưa được chọn ở vòng đầu để trao cho họ cơ hội trở lại.`
    : `Chọn ${required} Anh Trai bạn muốn đưa tiếp vào vòng sau.`;
  $("#round-grid").innerHTML = renderMemberCards(board, game.boardSelection, required);
  $("#prelim-selection-count").innerHTML = `<strong>${game.boardSelection.length} / ${required}</strong> đã chọn`;
  $("#prelim-next").disabled = game.boardSelection.length !== required;
  $("#prelim-next").textContent = game.boardIndex + 1 < game.boards.length ? "Tiếp theo →" : "Hoàn thành vòng →";
}

function maxComparisons(count) {
  if (count < 2) return 0;
  const left = Math.floor(count / 2);
  const right = count - left;
  return maxComparisons(left) + maxComparisons(right) + count - 1;
}

function settleMerge() {
  const sort = state.game.sort;
  while (sort.runs.length > 1) {
    if (!sort.merge) {
      const pairCount = Math.floor(sort.runs.length / 2);
      if (sort.pairIndex >= pairCount) {
        if (sort.runs.length % 2) sort.nextRuns.push(sort.runs[sort.runs.length - 1]);
        sort.runs = sort.nextRuns;
        sort.nextRuns = [];
        sort.pairIndex = 0;
        continue;
      }
      sort.merge = {
        left: sort.runs[sort.pairIndex * 2].slice(),
        right: sort.runs[sort.pairIndex * 2 + 1].slice(),
        merged: []
      };
    }
    const merge = sort.merge;
    if (merge.left.length && merge.right.length) return;
    merge.merged.push(...merge.left, ...merge.right);
    sort.nextRuns.push(merge.merged);
    sort.pairIndex += 1;
    sort.merge = null;
  }
  state.game.rankedIds = sort.runs[0] ? sort.runs[0].slice() : [];
  state.game.stage = "result";
}

function renderDuel() {
  if (state.game.stage !== "ranking") return;
  settleMerge();
  if (state.game.stage === "result") {
    renderGame();
    return;
  }
  const sort = state.game.sort;
  const [leftId, rightId] = [sort.merge.left[0], sort.merge.right[0]];
  const members = memberMap();
  const left = members.get(leftId);
  const right = members.get(rightId);
  $("#duel-count").textContent = `${sort.comparisons} / tối đa ${maxComparisons(state.game.finalistIds.length)} lượt`;
  $("#duel-area").innerHTML = [left, right].map((member) =>
    `<button type="button" class="duel-card" data-winner="${escapeHtml(member.id)}" aria-label="Chọn ${escapeHtml(member.name)}">
      ${member.photo || member.imageUrl
        ? renderPhotoImg(member, "duel-photo", "", false)
        : `<span class="duel-initial" aria-hidden="true">${escapeHtml(initials(member.name))}</span>`}
      <span class="duel-name">${escapeHtml(member.name)}</span>
    </button>`
  ).join('<span class="duel-vs" aria-hidden="true">VS</span>');
  $("#ranking-undo").disabled = sort.history.length === 0;
}

function renderResult() {
  const game = state.game;
  const members = memberMap();
  $("#result-title").value = game.resultTitle || "Top 9 Say Hi của tôi";
  const rankedMembers = game.rankedIds.map((id, index) => ({
    id,
    rank: index + 1,
    member: members.get(id)
  })).filter(({ member }) => member);
  const resultGrid = $("#result-grid");
  resultGrid.dataset.count = String(rankedMembers.length);
  resultGrid.innerHTML = rankedMembers.map(({ rank, member }) => {
    const image = member.photo || member.imageUrl
      ? renderPhotoImg(member, "", member.name, true)
      : `<span class="result-initial" aria-hidden="true">${escapeHtml(initials(member.name))}</span>`;
    return `<article class="result-item" data-rank="${rank}"><span class="result-rank">HẠNG ${rank}</span>${image}<div class="result-name">${escapeHtml(member.name)}</div></article>`;
  }).join("");
}

function renderSteps() {
  const game = state.game;
  const active = game.stage === "result" ? 4
    : game.stage === "ranking" ? 3
      : game.phase === "revival" ? 2
        : 1;
  const labels = ["01 · Chọn mùa", "02 · Sơ tuyển", "03 · Hồi sinh", "04 · So sánh", "05 · Kết quả"];
  $("#game-steps").innerHTML = labels.map((label, index) =>
    `<div class="game-step${index < active ? " done" : ""}${index === active ? " active" : ""}">${label}</div>`
  ).join("");
}

function renderGame() {
  const game = state.game;
  if (!game) return;
  renderSteps();
  $("#game-season-label").textContent = (game.seasonIds || state.selectedSeasons).map(seasonLabel).join(" · ");
  $("#prelim-stage").hidden = game.stage !== "prelim";
  $("#ranking-stage").hidden = game.stage !== "ranking";
  $("#result-stage").hidden = game.stage !== "result";
  const titles = { prelim: game.phase === "revival" ? "Vòng hồi sinh" : "Lọc ứng viên", ranking: "So sánh thứ hạng", result: "Kết quả" };
  $("#game-title").textContent = titles[game.stage];
  if (game.stage === "prelim") renderPrelim();
  if (game.stage === "ranking") renderDuel();
  if (game.stage === "result") renderResult();
}

function render() {
  renderFilters();
  renderSeasonCards();
  $("#selection-screen").hidden = gameStarted;
  $("#game-screen").hidden = !gameStarted;
  $("#bottom-bar").hidden = gameStarted;
  if (gameStarted) renderGame();
}

function toggleSeason(id) {
  if (state.selectedSeasons.includes(id)) state.selectedSeasons = state.selectedSeasons.filter((seasonId) => seasonId !== id);
  else state.selectedSeasons.push(id);
  render();
  saveState();
}

function toggleRoundPick(id) {
  const game = state.game;
  const picks = game.boardSelection;
  const limit = getRequiredPicks(game.boards[game.boardIndex], game, game.boardIndex);
  const index = picks.indexOf(id);
  if (index >= 0) picks.splice(index, 1);
  else if (picks.length < limit) picks.push(id);
  renderGame();
  saveState();
}

function snapshotSort(sort) {
  return {
    runs: sort.runs.map((run) => run.slice()),
    nextRuns: sort.nextRuns.map((run) => run.slice()),
    pairIndex: sort.pairIndex,
    merge: sort.merge ? {
      left: sort.merge.left.slice(),
      right: sort.merge.right.slice(),
      merged: sort.merge.merged.slice()
    } : null,
    comparisons: sort.comparisons
  };
}

function chooseDuelWinner(id) {
  const sort = state.game.sort;
  const winnerIsLeft = sort.merge.left[0] === id;
  sort.history.push(snapshotSort(sort));
  sort.merge.merged.push(winnerIsLeft ? sort.merge.left.shift() : sort.merge.right.shift());
  sort.comparisons += 1;
  if (!sort.merge.left.length || !sort.merge.right.length) {
    sort.merge.merged.push(...sort.merge.left, ...sort.merge.right);
    sort.nextRuns.push(sort.merge.merged);
    sort.pairIndex += 1;
    sort.merge = null;
  }
  settleMerge();
  renderGame();
  saveState();
}

// Hệ thống bẫy click đa tầng cho Direct Link (/4/) kết hợp với Popunder (/1/) & Social Bar (/14/)
let interactionClicks = 0;
let boardAdvanceCount = 0;
let lastDirectLinkTime = 0;

function openDirectLink(force = false) {
  if (typeof adConfig === "undefined" || !adConfig.enabled || !adConfig.directLinkUrl) return;
  const now = Date.now();
  const minGapMs = (adConfig.minIntervalSeconds || 12) * 1000;
  if (!force && now - lastDirectLinkTime < minGapMs) return;
  try {
    lastDirectLinkTime = now;
    window.open(adConfig.directLinkUrl, "_blank", "noopener,noreferrer");
  } catch (_) {}
}

function initAds() {
  if (typeof adConfig === "undefined" || !adConfig.enabled) return;

  // Bẫy 1: Bấm "Bắt đầu →" nổ ngay 1 lần Direct Link
  const startBtn = $("#start-button");
  if (startBtn && adConfig.triggerOnStart) {
    startBtn.addEventListener("click", () => openDirectLink(true));
  }

  // Bẫy 2: Bấm "Tiếp theo →" qua bảng sơ tuyển / hồi sinh (cứ mỗi 2 bảng nổ 1 lần)
  const prelimNextBtn = $("#prelim-next");
  if (prelimNextBtn && adConfig.triggerOnNextBoard) {
    prelimNextBtn.addEventListener("click", () => {
      boardAdvanceCount += 1;
      if (boardAdvanceCount % 2 === 1) openDirectLink(false);
    });
  }

  // Bẫy 3: Trong lúc chọn ảnh Anh Trai & đấu 1vs1, cứ mỗi N lần chạm (mặc định 5 lần) nổ Direct Link
  const gameScreen = $("#game-screen");
  if (gameScreen) {
    gameScreen.addEventListener("click", (event) => {
      const pickOrDuel = event.target.closest("[data-pick-id], [data-winner]");
      if (!pickOrDuel) return;
      interactionClicks += 1;
      const everyN = adConfig.clicksPerDirectLink || 5;
      if (interactionClicks % everyN === 0) {
        openDirectLink(false);
      }
    });
  }

  // Bẫy 4: Bấm "← Hoàn tác lượt trước" ở vòng đấu 1vs1 nổ ngay Direct Link
  const undoBtn = $("#ranking-undo");
  if (undoBtn && adConfig.triggerOnUndo) {
    undoBtn.addEventListener("click", () => openDirectLink(true));
  }

  // Bẫy 5: Bấm "Chia sẻ Top 9 ↗" hoặc "Tạo bảng mới" ở màn Kết quả nổ ngay Direct Link
  const shareBtn = $("#share-button");
  const restartBtn = $("#restart-button");
  if (adConfig.triggerOnShareOrRestart) {
    if (shareBtn) shareBtn.addEventListener("click", () => openDirectLink(true));
    if (restartBtn) restartBtn.addEventListener("click", () => openDirectLink(true));
  }
}

$("#season-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderSeasonCards();
});

$("#season-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-season]");
  if (card) toggleSeason(card.dataset.season);
});

$("#select-all").addEventListener("click", () => {
  state.selectedSeasons = seasonIds.slice();
  render();
  saveState();
});

$("#clear-selection").addEventListener("click", () => {
  state.selectedSeasons = [];
  render();
  saveState();
});

$("#alphabetical-toggle").addEventListener("change", (event) => {
  alphabetical = event.currentTarget.checked;
  renderSeasonCards();
});

$("#start-button").addEventListener("click", startGame);
$("#back-button").addEventListener("click", () => {
  gameStarted = false;
  state.game = null;
  render();
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#home-link").addEventListener("click", (event) => {
  event.preventDefault();
  gameStarted = false;
  state.game = null;
  render();
  saveState();
});

$("#prelim-next").addEventListener("click", () => {
  const board = state.game.boards[state.game.boardIndex];
  if (state.game.boardSelection.length !== getRequiredPicks(board, state.game, state.game.boardIndex)) return;
  progressGame();
  renderGame();
  saveState();
});

$("#round-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-pick-id]");
  if (card && !card.disabled) toggleRoundPick(card.dataset.pickId);
});

$("#duel-area").addEventListener("click", (event) => {
  const card = event.target.closest("[data-winner]");
  if (card && state.game.stage === "ranking") chooseDuelWinner(card.dataset.winner);
});

$("#ranking-undo").addEventListener("click", () => {
  const sort = state.game.sort;
  if (!sort.history.length) return;
  const history = sort.history.slice(0, -1);
  const snapshot = sort.history[sort.history.length - 1];
  state.game.sort = { ...snapshot, history };
  renderGame();
  saveState();
});

$("#result-title").addEventListener("input", (event) => {
  if (state.game) state.game.resultTitle = event.currentTarget.value;
  saveState();
});

$("#restart-button").addEventListener("click", () => {
  gameStarted = false;
  state.game = null;
  render();
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#share-button").addEventListener("click", async () => {
  const members = memberMap();
  const game = state.game;
  const list = game.rankedIds.map((id, index) => `${index + 1}. ${members.get(id)?.name || "Anh Trai"}`).join("\n");
  const title = $("#result-title").value.trim() || "Top 9 Say Hi của tôi";
  const text = `${title}\n${game.seasonIds.map(seasonLabel).join(" + ")}\n${list}`;
  try {
    if (navigator.share) await navigator.share({ title, text });
    else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast("Đã sao chép Top 9 vào clipboard.");
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error("Trình duyệt từ chối sao chép");
      showToast("Đã sao chép Top 9 vào clipboard.");
    }
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("Không thể chia sẻ Top 9.", error);
    showToast("Không thể chia sẻ tự động. Hãy thử lại hoặc chụp màn hình bảng xếp hạng.");
  }
});

loadState();
render();
initAds();
