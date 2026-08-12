const STORAGE_KEY = "rbcc-board-state-v1";
const API_BASE = "/api/items";
const AUTH_BASE = "/api/auth";
const useApi = location.protocol !== "file:";
const researchTopics = [
  "医疗健康与家居照护场景",
  "智慧交通与基础设施场景",
  "公共服务与城市空间场景",
  "创意与内容产业场景",
  "装备制造加工和装配场景"
];

const days = [
  { key: "8.10", week: "周一" },
  { key: "8.11", week: "周二" },
  { key: "8.12", week: "周三" },
  { key: "8.13", week: "周四" },
  { key: "8.14", week: "会谈日" },
  { key: "8.15", week: "周六" },
  { key: "8.16", week: "会议日" },
  { key: "8.17", week: "周一" },
  { key: "8.18", week: "周二" },
  { key: "8.19", week: "路演日" }
];

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "19:00-22:00"
];

const defaultState = {
  metrics: [
    { id: crypto.randomUUID(), label: "任务总量", value: "32", note: "可直接修改，自动形成项目留痕" },
    { id: crypto.randomUUID(), label: "完成进度", value: "68%", note: "今天重点看待确认项" },
    { id: crypto.randomUUID(), label: "待确认决策", value: "3", note: "今晚复盘统一处理" },
    { id: crypto.randomUUID(), label: "项目周期", value: "10天", note: "8.10 - 8.19" }
  ],
  schedule: [
    { id: crypto.randomUUID(), day: "8.10", time: "09:00", title: "开营仪式", detail: "线上", type: "gold" },
    { id: crypto.randomUUID(), day: "8.10", time: "10:00", title: "课程1", detail: "线上", type: "gold" },
    { id: crypto.randomUUID(), day: "8.10", time: "14:00", title: "课程2", detail: "线上", type: "blue" },
    { id: crypto.randomUUID(), day: "8.11", time: "10:00", title: "正式签到", detail: "希尔顿（花园）", type: "gold" },
    { id: crypto.randomUUID(), day: "8.12", time: "10:00", title: "调研", detail: "产业园", type: "gold" },
    { id: crypto.randomUUID(), day: "8.13", time: "10:00", title: "调研", detail: "产业园", type: "gold" },
    { id: crypto.randomUUID(), day: "8.14", time: "14:00", title: "主题抽签", detail: "迭代 / 开拓", type: "gold" },
    { id: crypto.randomUUID(), day: "8.14", time: "16:00", title: "Milestone 1", detail: "16:00-22:00", type: "green" },
    { id: crypto.randomUUID(), day: "8.15", time: "10:00", title: "实践", detail: "小组项目 / Milestone 2", type: "green" },
    { id: crypto.randomUUID(), day: "8.16", time: "10:00", title: "实践", detail: "小组项目", type: "green" },
    { id: crypto.randomUUID(), day: "8.17", time: "10:00", title: "实践", detail: "小组项目", type: "green" },
    { id: crypto.randomUUID(), day: "8.18", time: "17:00", title: "小组互评", detail: "", type: "green" },
    { id: crypto.randomUUID(), day: "8.19", time: "09:00", title: "集中展演", detail: "产业园", type: "pink" },
    { id: crypto.randomUUID(), day: "8.19", time: "10:00", title: "分组路演", detail: "Milestone 3 · 产业园", type: "pink" }
  ],
  tasks: [
    { id: crypto.randomUUID(), title: "用户访谈", status: "进行中", lead: "Mary", collaborators: "Alice / Bob", deadline: "8月12日 18:00" },
    { id: crypto.randomUUID(), title: "竞品分析", status: "待确认", lead: "Alice", collaborators: "Cindy", deadline: "8月13日 20:00" },
    { id: crypto.randomUUID(), title: "Demo 框架", status: "进行中", lead: "Bob", collaborators: "David", deadline: "8月15日 22:00" }
  ],
  decisions: [
    { id: crypto.randomUUID(), title: "目标用户选择大学生", problem: "样本与时间如何平衡", participants: "Mary / Alice / Bob / Cindy", result: "第一阶段目标用户选择大学生" },
    { id: crypto.randomUUID(), title: "界面优先做看板，不先做聊天", problem: "功能范围如何收敛", participants: "全员", result: "先让分工和证据链跑起来，再扩展功能" },
    { id: crypto.randomUUID(), title: "每天 21:30 复盘", problem: "如何保证同步", participants: "全员", result: "任务调整、进度确认、第二天优先级更新" }
  ],
  contributions: [
    { id: crypto.randomUUID(), member: "Mary", description: "完成 3 名用户访谈", result: "得到痛点 3 条", task: "用户访谈" },
    { id: crypto.randomUUID(), member: "Alice", description: "整理竞品资料", result: "输出对比表 1 份", task: "竞品分析" },
    { id: crypto.randomUUID(), member: "Bob", description: "完成原型页面", result: "产出 Demo 草图", task: "Demo 框架" }
  ],
  research: [
    {
      id: crypto.randomUUID(),
      company: "示例公司 A",
      topic: "医疗健康与家居照护场景",
      group: "迭代组",
      owner: "Mary",
      interviewee: "产品经理 / 运营负责人",
      interviewTime: "8月12日 15:00",
      place: "产业园 3F 会议室",
      user: "企业协作工具使用者",
      says: "现有工具很多，但信息经常分散在不同群和文档里。",
      thinks: "希望团队信息能自动汇总，不想每天手动整理。",
      does: "每天查看群聊、表格和会议纪要，再把重点转成任务。",
      feels: "焦虑、重复劳动多，担心遗漏关键决策。",
      personaName: "Beatrice",
      personaAge: "21",
      personaBehaviors: "经常参与小组协作，习惯用表格和聊天工具记录信息。",
      personaNeeds: "需要更清晰的任务分配、调研留痕和决策记录。",
      personaGoal: "减少重复整理，把更多时间放在分析和展示上。",
      personaQuote: "我不怕做事，怕的是大家做过什么最后没人记得清。",
      formulaUser: "项目成员",
      formulaNeed: "快速沉淀调研证据",
      formulaInsight: "临时项目最缺的是轻量、清晰、可回看的记录系统"
    }
  ]
};

let state = structuredClone(defaultState);
let editing = { type: "", id: null };
let authMode = "login";

const $ = (selector) => document.querySelector(selector);
const toast = (message) => {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => node.classList.remove("show"), 2200);
};

function setAuthenticated(authenticated) {
  $("#loginScreen").hidden = authenticated;
  $("#appShell").hidden = !authenticated;
}

function storageKey() {
  return useApi ? `${STORAGE_KEY}-team` : STORAGE_KEY;
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  $("#authTitle").textContent = registering ? "注册项目账号" : "登录项目看板";
  $("#authSubmitBtn").textContent = registering ? "注册并登录" : "登录";
  $("#authSwitchBtn").textContent = registering ? "已有账号，去登录" : "注册账号";
  $("#loginPassword").autocomplete = registering ? "new-password" : "current-password";
  $("#loginError").textContent = "";
}

async function startBoard() {
  await loadState();
  initPageNav();
  render();
  saveLocal();
}

async function checkAuth() {
  if (!useApi) {
    setAuthenticated(true);
    await startBoard();
    return;
  }
  try {
    const response = await fetch(`${AUTH_BASE}/me`);
    const data = await response.json();
    if (data.authenticated) {
      setAuthenticated(true);
      await startBoard();
      return;
    }
  } catch {
    $("#loginError").textContent = "后端没有启动，请先运行 Spring Boot 项目";
  }
  setAuthenticated(false);
}

async function login(event) {
  event.preventDefault();
  $("#loginError").textContent = "";
  const data = Object.fromEntries(new FormData(event.target).entries());
  try {
    const response = await fetch(`${AUTH_BASE}/${authMode === "register" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      $("#loginError").textContent = result.message || (authMode === "register" ? "注册失败" : "账号或密码错误");
      return;
    }
    setAuthenticated(true);
    await startBoard();
  } catch {
    $("#loginError").textContent = "后端没有启动，请先运行 Spring Boot 项目";
  }
}

async function logout() {
  if (useApi) {
    await fetch(`${AUTH_BASE}/logout`, { method: "POST" }).catch(() => {});
  }
  setAuthenticated(false);
  $("#loginForm").reset();
  $("#loginUsername").focus();
  history.replaceState(null, "", "#overview-page");
}

function saveLocal() {
  localStorage.setItem(storageKey(), JSON.stringify(state));
}

async function save() {
  saveLocal();
  if (!useApi) return;
  try {
    await fetch(`${API_BASE}/snapshot/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
  } catch {
    // The page remains usable with localStorage when the backend is not running.
  }
}

async function loadState() {
  const local = useApi ? null : localStorage.getItem(storageKey());
  if (local) {
    state = JSON.parse(local);
  }
  state = { ...structuredClone(defaultState), ...state };
  if (!useApi) return;
  try {
    const response = await fetch(`${API_BASE}/snapshot`);
    if (!response.ok) return;
    const data = await response.json();
    const recoveredResearch = collectLegacyResearch(data);
    if (recoveredResearch.length) {
      await fetch(`${API_BASE}/snapshot/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ research: recoveredResearch })
      });
      const refreshedResponse = await fetch(`${API_BASE}/snapshot`);
      if (refreshedResponse.ok) {
        state = { ...structuredClone(defaultState), ...(await refreshedResponse.json()) };
      }
    } else if (data && Object.keys(data).length) {
      state = { ...structuredClone(defaultState), ...data };
    }
    state = { ...structuredClone(defaultState), ...state };
  } catch {
    toast("后端未启动，当前使用浏览器本地保存");
  }
}

function collectLegacyResearch(serverState) {
  const existingIds = new Set((serverState.research || []).map((item) => item.id));
  const recovered = [];
  const seen = new Set();
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key !== STORAGE_KEY && !key?.startsWith(`${STORAGE_KEY}-`)) continue;
    try {
      const cached = JSON.parse(localStorage.getItem(key));
      (cached.research || []).forEach((item) => {
        if (!item?.id || !item.company || existingIds.has(item.id) || seen.has(item.id)) return;
        seen.add(item.id);
        recovered.push(item);
      });
    } catch {
      // Ignore unrelated or malformed browser data.
    }
  }
  return recovered;
}

function renderMetrics() {
  $("#metricGrid").innerHTML = state.metrics.map((item) => `
    <article class="metric">
      <div class="metric-top">
        <span>${escapeHtml(item.label)}</span>
        <span class="metric-actions">
          <button class="icon-btn" type="button" data-action="edit" data-type="metrics" data-id="${item.id}">✎</button>
          <button class="icon-btn" type="button" data-action="delete" data-type="metrics" data-id="${item.id}">×</button>
        </span>
      </div>
      <div class="metric-value">${escapeHtml(item.value)}</div>
      <div class="metric-note">${escapeHtml(item.note)}</div>
    </article>
  `).join("") + `
    <button class="metric add-card" type="button" data-action="add" data-type="metrics">
      <div class="metric-value">＋</div>
      <div class="metric-note">新增核心数字</div>
    </button>
  `;
}

function renderSchedule() {
  let html = `<div class="schedule-cell schedule-corner">时间</div>`;
  days.forEach((day) => {
    html += `<div class="schedule-cell schedule-day">${day.key}<small>${day.week}</small></div>`;
  });
  times.forEach((time) => {
    html += `<button class="schedule-cell schedule-time" type="button" data-action="add-schedule-at" data-time="${time}">${time}</button>`;
    days.forEach((day) => {
      const events = state.schedule.filter((item) => item.day === day.key && item.time === time);
      html += `<div class="schedule-cell schedule-slot" data-action="add-schedule-at" data-day="${day.key}" data-time="${time}">`;
      events.forEach((event) => {
        html += `
          <article class="schedule-event ${event.type}" data-action="edit" data-type="schedule" data-id="${event.id}">
            <div class="event-actions">
              <button class="icon-btn" type="button" data-action="edit" data-type="schedule" data-id="${event.id}">✎</button>
              <button class="icon-btn" type="button" data-action="delete" data-type="schedule" data-id="${event.id}">×</button>
            </div>
            <div class="schedule-event-title">${escapeHtml(event.title)}</div>
            <div class="schedule-event-desc">${escapeHtml(event.detail || "")}</div>
          </article>
        `;
      });
      html += `</div>`;
    });
  });
  $("#scheduleGrid").innerHTML = html;
}

function renderTasks() {
  $("#taskList").innerHTML = state.tasks.map((item) => `
    <article class="record">
      <div class="record-actions">
        <button class="icon-btn" type="button" data-action="edit" data-type="tasks" data-id="${item.id}">✎</button>
        <button class="icon-btn" type="button" data-action="delete" data-type="tasks" data-id="${item.id}">×</button>
      </div>
      <div class="record-title">${escapeHtml(item.title)} <span class="tag ${tagClass(item.status)}">${escapeHtml(item.status)}</span></div>
      <div class="record-meta">Lead：${escapeHtml(item.lead)} · 协作者：${escapeHtml(item.collaborators)} · 截止：${escapeHtml(item.deadline)}</div>
    </article>
  `).join("");
}

function renderDecisions() {
  $("#decisionList").innerHTML = state.decisions.map((item) => `
    <article class="record">
      <div class="record-actions">
        <button class="icon-btn" type="button" data-action="edit" data-type="decisions" data-id="${item.id}">✎</button>
        <button class="icon-btn" type="button" data-action="delete" data-type="decisions" data-id="${item.id}">×</button>
      </div>
      <div class="record-title">${escapeHtml(item.title)}</div>
      <div class="record-meta">问题：${escapeHtml(item.problem)} · 参与：${escapeHtml(item.participants)}</div>
      <div class="record-meta">结论：${escapeHtml(item.result)}</div>
    </article>
  `).join("");
}

function renderContributions() {
  $("#contributionList").innerHTML = state.contributions.map((item) => `
    <article class="record">
      <div class="record-actions">
        <button class="icon-btn" type="button" data-action="edit" data-type="contributions" data-id="${item.id}">✎</button>
        <button class="icon-btn" type="button" data-action="delete" data-type="contributions" data-id="${item.id}">×</button>
      </div>
      <div class="record-title">${escapeHtml(item.member)}</div>
      <div class="record-meta">${escapeHtml(item.description)} · ${escapeHtml(item.result)}</div>
      <div class="record-meta">关联任务：${escapeHtml(item.task)}</div>
    </article>
  `).join("");
}

function renderResearch() {
  const filteredResearch = filterResearch(state.research);
  $("#researchResultCount").textContent = `找到 ${filteredResearch.length} 条调研记录`;
  $("#researchList").innerHTML = filteredResearch.map((item) => `
    <article class="research-card">
      <div class="research-card-head">
        <div>
          <div class="research-title">${escapeHtml(item.company)}</div>
          <div class="research-meta">主题：${escapeHtml(item.topic)}</div>
          <div class="research-meta">负责人：${escapeHtml(item.owner)} · 访谈人：${escapeHtml(item.interviewee)}</div>
          <div class="research-meta">时间：${escapeHtml(item.interviewTime)} · 地点：${escapeHtml(item.place)}</div>
          <div class="research-tags">
            <span class="tag ${item.group === "开拓组" ? "tag-pink" : "tag-green"}">${escapeHtml(item.group)}</span>
            <span class="tag tag-blue">${escapeHtml(item.owner)}</span>
          </div>
        </div>
        <div class="record-actions">
          <button class="icon-btn" type="button" data-action="edit" data-type="research" data-id="${item.id}">✎</button>
          <button class="icon-btn" type="button" data-action="delete" data-type="research" data-id="${item.id}">×</button>
        </div>
      </div>
      <div class="research-body">
        <div class="empathy-map" aria-label="四象限图">
          ${empathyCell("SAYS", item.says)}
          ${empathyCell("THINKS", item.thinks)}
          ${empathyCell("DOES", item.does)}
          ${empathyCell("FEELS", item.feels)}
          <div class="empathy-user">${escapeHtml(item.user)}</div>
        </div>
        <div>
          <div class="persona-box">
            <div class="persona-title">用户画像</div>
            <div class="persona-grid">
              <strong>Name</strong><span>${escapeHtml(item.personaName)}</span>
              <strong>Age</strong><span>${escapeHtml(item.personaAge)}</span>
              <strong>Habit/Behaviors</strong><span>${escapeHtml(item.personaBehaviors)}</span>
              <strong>Needs/Challenges</strong><span>${escapeHtml(item.personaNeeds)}</span>
              <strong>Goal</strong><span>${escapeHtml(item.personaGoal)}</span>
              <strong>Quote</strong><span>${escapeHtml(item.personaQuote)}</span>
            </div>
          </div>
          <div class="insight-formula" aria-label="一句话公式">
            <div class="formula-box">${escapeHtml(item.formulaUser)}</div>
            <div class="formula-word">needs to</div>
            <div class="formula-box">${escapeHtml(item.formulaNeed)}</div>
            <div class="formula-word">because</div>
            <div class="formula-box">${escapeHtml(item.formulaInsight)}</div>
          </div>
        </div>
      </div>
    </article>
  `).join("") || `<div class="research-empty">没有找到符合条件的调研记录</div>`;
}

function filterResearch(items) {
  const keyword = $("#researchKeyword").value.trim();
  const topic = $("#researchTopicFilter").value;
  const group = $("#researchGroupFilter").value;
  const mode = $("#researchMatchMode").value;
  const normalizedKeyword = keyword.toLocaleLowerCase();
  return items.filter((item) => {
    if (topic && item.topic !== topic) return false;
    if (group && item.group !== group) return false;
    if (!normalizedKeyword) return true;
    const searchable = Object.values(item).join(" ").toLocaleLowerCase();
    return mode === "exact" ? searchable.split(/[\s,，。；;、:：/|]+/).includes(normalizedKeyword) : searchable.includes(normalizedKeyword);
  });
}

function initResearchTools() {
  $("#researchTopicFilter").innerHTML = `<option value="">全部主题</option>${researchTopics.map((topic) => `<option value="${topic}">${topic}</option>`).join("")}`;
  ["researchKeyword", "researchTopicFilter", "researchGroupFilter", "researchMatchMode"].forEach((id) => {
    $(`#${id}`).addEventListener(id === "researchKeyword" ? "input" : "change", renderResearch);
  });
}

function parseResearchInput(text) {
  const result = {
    topic: researchTopics.find((topic) => text.includes(topic)) || "",
    group: text.includes("开拓组") ? "开拓组" : text.includes("迭代组") ? "迭代组" : "迭代组"
  };
  const aliases = {
    company: ["调研公司", "公司", "企业", "项目"],
    topic: ["调研主题", "主题", "场景"],
    group: ["标签", "组别", "小组"],
    owner: ["负责人", "对接人"],
    interviewee: ["访谈人", "受访者", "访谈对象"],
    interviewTime: ["访谈时间", "时间", "日期"],
    place: ["访谈地点", "地点", "地址"],
    user: ["中心用户", "用户"],
    says: ["SAYS", "用户说", "原话"],
    thinks: ["THINKS", "用户想"],
    does: ["DOES", "用户做"],
    feels: ["FEELS", "用户感受"],
    personaName: ["姓名", "Name"],
    personaAge: ["年龄", "Age"],
    personaBehaviors: ["习惯", "行为", "Behaviors"],
    personaNeeds: ["需求", "痛点", "Needs"],
    personaGoal: ["目标", "Goal"],
    personaQuote: ["引用", "金句", "Quote"],
    formulaUser: ["公式用户", "Formula User"],
    formulaNeed: ["公式需求", "Formula Need"],
    formulaInsight: ["洞察", "Insight"]
  };
  const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean);
  lines.forEach((line) => {
    const match = line.match(/^([^:：]{1,20})[:：]\s*(.+)$/);
    if (!match) return;
    const [, key, value] = match;
    Object.entries(aliases).some(([field, names]) => {
      if (!names.some((name) => key.toLocaleLowerCase().includes(name.toLocaleLowerCase()))) return false;
      if (!(field === "topic" && result.topic && !researchTopics.includes(value.trim()))) result[field] = value.trim();
      return true;
    });
  });
  if (!result.company) {
    const companyLine = lines.find((line) => /公司|企业|集团|医院|中心/.test(line));
    if (companyLine) result.company = companyLine.replace(/^(公司|企业|项目)[:：]?\s*/, "");
  }
  const allLabels = Object.values(aliases).flat().sort((a, b) => b.length - a.length);
  const escapedLabels = allLabels.map(escapeRegExp).join("|");
  Object.entries(aliases).forEach(([field, names]) => {
    if (result[field] && field !== "company") return;
    const labelPattern = names.map(escapeRegExp).join("|");
    const expression = new RegExp(
      `(?:${labelPattern})(?:是|为|在|：|:|？|\\?)?\\s*([\\s\\S]*?)(?=(?:${escapedLabels})(?:是|为|在|：|:|？|\\?)|[，,。；;\\n]|$)`,
      "i"
    );
    const match = text.match(expression);
    if (match?.[1]) result[field] = cleanExtractedValue(match[1]);
  });
  if (result.topic && !researchTopics.includes(result.topic)) {
    result.topic = researchTopics.find((topic) => text.includes(topic)) || "";
  }
  const saysMatch = text.match(/(?:用户说了什么|用户说|原话|SAYS)(?:是|为|：|:|？|\?)?\s*([\s\S]*?)(?=(?:THINKS|用户在想什么|用户想|DOES|用户做了什么|用户做|FEELS|用户感受)|$)/i);
  if (saysMatch?.[1]) result.says = cleanExtractedValue(saysMatch[1]);
  return result;
}

function cleanExtractedValue(value) {
  return value
    .replace(/^[：:，,。；;\s]+|[：:，,。；;\s]+$/g, "")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function empathyCell(label, value) {
  return `
    <section class="empathy-cell">
      <div class="empathy-label">${label}</div>
      <div class="empathy-text">${escapeHtml(value)}</div>
    </section>
  `;
}

function render() {
  renderMetrics();
  renderSchedule();
  renderResearch();
  renderTasks();
  renderDecisions();
  renderContributions();
}

function openEditor(type, id = null, seed = {}) {
  editing = { type, id };
  const isNew = !id;
  const collection = state[type] || [];
  const item = id ? collection.find((entry) => entry.id === id) : seed;
  $("#dialogTitle").textContent = `${isNew ? "新增" : "编辑"}${typeName(type)}`;
  $("#formFields").innerHTML = fieldsFor(type, item).map(fieldTemplate).join("");
  $("#editorDialog").showModal();
}

function fieldsFor(type, item = {}) {
  const common = (name, label, kind = "text", options = []) => ({ name, label, kind, options, value: item[name] || "" });
  if (type === "metrics") {
    return [common("label", "数字名称"), common("value", "数字"), common("note", "说明", "textarea")];
  }
  if (type === "schedule") {
    return [
      common("day", "日期", "select", days.map((day) => day.key)),
      common("time", "时间", "select", times),
      common("title", "日程标题"),
      common("detail", "地点/说明", "textarea"),
      common("type", "颜色类型", "select", ["blue", "gold", "green", "pink"])
    ];
  }
  if (type === "tasks") {
    return [
      common("title", "任务名称"),
      common("status", "状态", "select", ["待开始", "进行中", "待确认", "已完成"]),
      common("lead", "Lead 主导人"),
      common("collaborators", "Collaborators 协作者"),
      common("deadline", "截止时间")
    ];
  }
  if (type === "decisions") {
    return [
      common("title", "决策标题"),
      common("problem", "问题背景", "textarea"),
      common("participants", "参与人"),
      common("result", "最终结论", "textarea")
    ];
  }
  if (type === "research") {
    return [
      common("company", "调研公司 / 项目"),
      common("topic", "调研主题", "select", researchTopics),
      common("group", "标签", "select", ["迭代组", "开拓组"]),
      common("owner", "负责人"),
      common("interviewee", "访谈人 / 职位"),
      common("interviewTime", "访谈时间"),
      common("place", "访谈地点"),
      common("user", "四象限中心用户"),
      common("says", "SAYS：用户说了什么", "textarea"),
      common("thinks", "THINKS：用户在想什么", "textarea"),
      common("does", "DOES：用户做了什么", "textarea"),
      common("feels", "FEELS：用户感受如何", "textarea"),
      common("personaName", "画像 Name"),
      common("personaAge", "画像 Age"),
      common("personaBehaviors", "画像 Habit/Behaviors", "textarea"),
      common("personaNeeds", "画像 Needs/Challenges", "textarea"),
      common("personaGoal", "画像 Goal", "textarea"),
      common("personaQuote", "画像 Quote", "textarea"),
      common("formulaUser", "一句话公式：User"),
      common("formulaNeed", "一句话公式：User's need"),
      common("formulaInsight", "一句话公式：Insight", "textarea")
    ];
  }
  return [
    common("member", "成员"),
    common("description", "做了什么", "textarea"),
    common("result", "产出物", "textarea"),
    common("task", "关联任务")
  ];
}

function fieldTemplate(field) {
  const full = field.kind === "textarea" ? " full" : "";
  if (field.kind === "textarea") {
    return `<div class="field${full}"><label for="${field.name}">${field.label}</label><textarea id="${field.name}" name="${field.name}">${escapeHtml(field.value)}</textarea></div>`;
  }
  if (field.kind === "select") {
    const options = field.options.map((option) => `<option value="${option}" ${field.value === option ? "selected" : ""}>${option}</option>`).join("");
    return `<div class="field"><label for="${field.name}">${field.label}</label><select id="${field.name}" name="${field.name}">${options}</select></div>`;
  }
  return `<div class="field"><label for="${field.name}">${field.label}</label><input id="${field.name}" name="${field.name}" value="${escapeHtml(field.value)}"></div>`;
}

async function submitEditor(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  if (editing.id) {
    const collection = state[editing.type];
    const index = collection.findIndex((item) => item.id === editing.id);
    collection[index] = { ...collection[index], ...data };
  } else {
    state[editing.type].push({ id: crypto.randomUUID(), ...data });
  }
  $("#editorDialog").close();
  render();
  await save();
  toast("已保存");
}

async function deleteItem(type, id) {
  state[type] = state[type].filter((item) => item.id !== id);
  render();
  if (useApi) {
    try {
      await fetch(`${API_BASE}/snapshot/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch {
      toast("删除未同步，请刷新后重试");
      return;
    }
  }
  await save();
  toast("已删除");
}

function typeName(type) {
  return ({ metrics: "核心数字", schedule: "日程", tasks: "任务", decisions: "决策", contributions: "贡献", research: "调研" })[type] || "记录";
}

function tagClass(status) {
  if (status === "进行中") return "tag-blue";
  if (status === "待确认") return "tag-gold";
  if (status === "已完成") return "tag-green";
  return "tag-pink";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showPage(pageId = "overview-page") {
  const validPage = document.getElementById(pageId) ? pageId : "overview-page";
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === validPage);
  });
  document.querySelectorAll(".page-nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${validPage}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initPageNav() {
  document.querySelectorAll(".page-nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const pageId = link.getAttribute("href").slice(1);
      history.replaceState(null, "", `#${pageId}`);
      showPage(pageId);
    });
  });
  showPage(location.hash.slice(1) || "overview-page");
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const type = target.dataset.type;
  const id = target.dataset.id;
  event.stopPropagation();
  if (action === "add") openEditor(type);
  if (action === "edit") openEditor(type, id);
  if (action === "delete") await deleteItem(type, id);
  if (action === "add-schedule-at") openEditor("schedule", null, { time: target.dataset.time, day: target.dataset.day || days[0].key, type: "blue" });
});

$("#addScheduleBtn").addEventListener("click", () => openEditor("schedule", null, { day: days[0].key, time: times[0], type: "blue" }));
$("#addResearchBtn").addEventListener("click", () => openEditor("research", null, { group: "迭代组" }));
$("#addTaskBtn").addEventListener("click", () => openEditor("tasks"));
$("#addDecisionBtn").addEventListener("click", () => openEditor("decisions"));
$("#addContributionBtn").addEventListener("click", () => openEditor("contributions"));
$("#loginForm").addEventListener("submit", login);
$("#authSwitchBtn").addEventListener("click", () => setAuthMode(authMode === "login" ? "register" : "login"));
$("#logoutBtn").addEventListener("click", logout);
$("#editorForm").addEventListener("submit", submitEditor);
$("#closeDialogBtn").addEventListener("click", () => $("#editorDialog").close());
$("#cancelDialogBtn").addEventListener("click", () => $("#editorDialog").close());
$("#resetBtn").addEventListener("click", async () => {
  if (!confirm("确定恢复初始数据吗？")) return;
  state = structuredClone(defaultState);
  render();
  await save();
});
$("#exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rbcc-board-data.json";
  link.click();
  URL.revokeObjectURL(url);
});
$("#syncBtn").addEventListener("click", async () => {
  await save();
  toast(useApi ? "已尝试同步到后端" : "当前为本地文件模式，数据保存在浏览器");
});
$("#clearResearchSearchBtn").addEventListener("click", () => {
  $("#researchKeyword").value = "";
  $("#researchTopicFilter").value = "";
  $("#researchGroupFilter").value = "";
  $("#researchMatchMode").value = "fuzzy";
  renderResearch();
});
$("#parseResearchBtn").addEventListener("click", () => {
  const text = $("#researchImportText").value.trim();
  if (!text) {
    $("#researchImportHint").textContent = "请先粘贴调研内容";
    return;
  }
  const seed = parseResearchInput(text);
  const count = Object.values(seed).filter(Boolean).length;
  $("#researchImportHint").textContent = `已识别 ${count} 项信息，请确认后保存`;
  openEditor("research", null, seed);
});

initResearchTools();
checkAuth();
