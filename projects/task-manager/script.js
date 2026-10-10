const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const empty = document.getElementById("emptyState");
const filters = [...document.querySelectorAll(".filter")];
let currentFilter = "all";
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("focus-list-tasks") || "[]");
  if (!Array.isArray(tasks)) tasks = [];
} catch {
  tasks = [];
}
function save() {
  localStorage.setItem("focus-list-tasks", JSON.stringify(tasks));
  render();
}
function render() {
  list.replaceChildren();
  const visible = tasks.filter(
    (t) =>
      currentFilter === "all" ||
      (currentFilter === "active" && !t.done) ||
      (currentFilter === "done" && t.done),
  );
  visible.forEach((task) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.done);
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.setAttribute("aria-label", "Mark task completed");
    check.addEventListener("change", () => {
      task.done = check.checked;
      save();
    });
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "×";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      save();
    });
    li.append(check, text, del);
    list.append(li);
  });
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = tasks.filter(
    (t) => t.done,
  ).length;
  document.getElementById("leftCount").textContent = tasks.filter(
    (t) => !t.done,
  ).length;
  empty.hidden = visible.length > 0;
  empty.textContent =
    tasks.length === 0
      ? "You're all caught up. Add a task to get started ✨"
      : "No tasks in this filter.";
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now() + Math.random(), text, done: false });
  input.value = "";
  save();
  input.focus();
});
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filters.forEach((f) => f.classList.toggle("active", f === btn));
    render();
  }),
);
document.getElementById("clearDone").addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
});
render();
