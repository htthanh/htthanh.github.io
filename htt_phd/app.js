// SHA-256 của code truy cập (code cố định, không ghi thẳng trong file)
const CODE_HASH = "dfe6e863b58b8ad4c25e93077e72b892c33cb20c403707c55cc991ae1f47d37c";

// Danh sách tài liệu: thêm tài liệu mới = chép file vào docs/ rồi thêm 1 dòng ở đây
const DOCS = [
  {
    title: "Kujala et al. (2018): Temporal distance profile & mcpCSA",
    meta: "Slides · 2026-11-19",
    desc: "Pareto-optimal journeys, temporal distance profile, CSA/mcpCSA chạy tay, so sánh với Huynh & Barthelemy (2022).",
    url: "docs/kujala2018-mcpcsa.html",
  },
  {
    title: "GTFS file format: định dạng dữ liệu lịch chạy giao thông công cộng",
    meta: "Slides · 2026-11-24",
    desc: "GTFS là gì, nguồn gốc & lịch sử, các file và quan hệ, feed mẫu, stop_times → connection (temporal graph), code Python, nguồn download dataset.",
    url: "docs/gtfs-file-format.html",
  },
];

const $ = (id) => document.getElementById(id);

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function showList() {
  $("gate").classList.add("hidden");
  $("list").classList.remove("hidden");
  $("docs").innerHTML = DOCS.map((d) =>
    `<a class="doc" href="${d.url}"><div class="t">${d.title}</div><div class="m">${d.meta}</div><div class="d">${d.desc}</div></a>`
  ).join("");
}

$("gate").addEventListener("submit", async (e) => {
  e.preventDefault();
  if ((await sha256($("code").value.trim())) === CODE_HASH) {
    sessionStorage.setItem("htt_phd_ok", "1");
    showList();
  } else {
    $("err").textContent = "Code không đúng.";
  }
});

$("code").addEventListener("input", () => {
  $("code").value = $("code").value.replace(/\D/g, "").slice(0, 6);
  $("err").textContent = "";
});

$("lock").addEventListener("click", () => {
  sessionStorage.removeItem("htt_phd_ok");
  location.reload();
});

if (sessionStorage.getItem("htt_phd_ok") === "1") showList();
else $("code").focus();
