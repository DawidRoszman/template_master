"use strict";

const textarea = document.getElementById("templatesJson");
const saveButton = document.getElementById("saveTemplates");
const statusEl = document.getElementById("status");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#a53f3f" : "#6d655e";
}

function normalizeTemplates(data) {
  if (!Array.isArray(data)) {
    throw new Error("Templates must be a JSON array.");
  }
  data.forEach((template, index) => {
    if (!template.id || !template.subject || !template.body) {
      throw new Error(`Template at index ${index} must include id, subject, and body.`);
    }
    if (!Array.isArray(template.fields)) {
      template.fields = [];
    }
  });
  return data;
}

async function loadTemplates() {
  const data = await browser.storage.local.get("templates");
  const templates = Array.isArray(data.templates) && data.templates.length > 0 ? data.templates : window.DEFAULT_TEMPLATES;
  textarea.value = JSON.stringify(templates, null, 2);
}

async function saveTemplates() {
  try {
    const parsed = JSON.parse(textarea.value);
    const normalized = normalizeTemplates(parsed);
    await browser.storage.local.set({ templates: normalized });
    setStatus("Templates saved.");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Failed to save templates.", true);
  }
}

saveButton.addEventListener("click", saveTemplates);

loadTemplates().catch((error) => {
  console.error(error);
  setStatus("Failed to load templates.", true);
});
