"use strict";

const templateSelect = document.getElementById("templateSelect");
const fieldsSection = document.getElementById("fieldsSection");
const previewSection = document.getElementById("previewSection");
const subjectPreview = document.getElementById("subjectPreview");
const bodyPreview = document.getElementById("bodyPreview");
const statusEl = document.getElementById("status");
const applyButton = document.getElementById("applyTemplate");
const optionsButton = document.getElementById("openOptions");

let templates = [];
let currentTemplate = null;

function setStatus(message) {
  statusEl.textContent = message;
}

function buildTemplateOptions() {
  templateSelect.innerHTML = "";
  if (templates.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No templates found";
    templateSelect.appendChild(option);
    return;
  }

  templates.forEach((template, index) => {
    const option = document.createElement("option");
    option.value = template.id || String(index);
    option.textContent = template.name || `Template ${index + 1}`;
    templateSelect.appendChild(option);
  });
}

function getTemplateByValue(value) {
  return templates.find((template, index) => (template.id || String(index)) === value);
}

function createFieldInput(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = field.label || field.id;
  label.setAttribute("for", `field-${field.id}`);
  wrapper.appendChild(label);

  let input;
  if (field.type === "select") {
    input = document.createElement("select");
    resolveSelectOptions(field).forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    });
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = field.placeholder || "";
  }

  input.id = `field-${field.id}`;
  input.dataset.fieldId = field.id;
  input.required = Boolean(field.required);
  input.addEventListener("input", updatePreview);
  input.addEventListener("change", updatePreview);

  wrapper.appendChild(input);
  return wrapper;
}

function resolveSelectOptions(field) {
  const staticOptions = Array.isArray(field.options) ? field.options : [];
  const dynamicOptions = field.optionsDynamic ? buildDynamicOptions(field.optionsDynamic) : [];
  const merged = [...staticOptions, ...dynamicOptions];
  return [...new Set(merged)];
}

function buildDynamicOptions(optionsDynamic) {
  if (optionsDynamic === "months") {
    return buildMonthOptions({ count: 2, startOffset: 0, step: -1, format: "monthYear", locale: undefined });
  }

  if (optionsDynamic && optionsDynamic.type === "months") {
    return buildMonthOptions({
      count: Number.isFinite(optionsDynamic.count) ? optionsDynamic.count : 2,
      startOffset: Number.isFinite(optionsDynamic.startOffset) ? optionsDynamic.startOffset : 0,
      step: Number.isFinite(optionsDynamic.step) ? optionsDynamic.step : -1,
      format: optionsDynamic.format || "monthYear",
      locale: normalizeLocale(optionsDynamic.locale),
    });
  }

  return [];
}

function buildMonthOptions({ count, startOffset, step, format, locale }) {
  const options = [];
  const base = new Date();

  for (let i = 0; i < count; i += 1) {
    const date = new Date(base.getFullYear(), base.getMonth() + startOffset + step * i, 1);
    options.push(formatMonth(date, format, locale));
  }

  return options;
}

function formatMonth(date, format, locale) {
  let config = { month: "long", year: "numeric" };
  switch (format) {
    case "month":
      config = { month: "long" };
      break;
    case "shortMonth":
      config = { month: "short" };
      break;
    case "shortMonthYear":
      config = { month: "short", year: "numeric" };
      break;
    case "monthYear":
    default:
      config = { month: "long", year: "numeric" };
      break;
  }
  return new Intl.DateTimeFormat(locale, config).format(date);
}

function normalizeLocale(locale) {
  if (!locale) {
    return undefined;
  }
  if (locale === "pl") {
    return "pl-PL";
  }
  return locale;
}

function renderFields(template) {
  fieldsSection.innerHTML = "";
  if (!template || !Array.isArray(template.fields)) {
    previewSection.classList.add("hidden");
    return;
  }

  template.fields.forEach((field) => {
    fieldsSection.appendChild(createFieldInput(field));
  });

  previewSection.classList.remove("hidden");
  updatePreview();
}

function collectValues() {
  const values = {};
  const inputs = fieldsSection.querySelectorAll("[data-field-id]");
  inputs.forEach((input) => {
    values[input.dataset.fieldId] = input.value || "";
  });
  return values;
}

function applyValues(text, values) {
  let result = text || "";
  Object.keys(values).forEach((key) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(pattern, values[key]);
  });
  return result;
}

function toPlainText(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html || "";
  return wrapper.textContent || "";
}

function updatePreview() {
  if (!currentTemplate) {
    return;
  }
  const values = collectValues();
  subjectPreview.textContent = applyValues(currentTemplate.subject, values);
  bodyPreview.textContent = toPlainText(applyValues(currentTemplate.body, values));
}

async function loadTemplates() {
  const data = await browser.storage.local.get("templates");
  templates = Array.isArray(data.templates) && data.templates.length > 0 ? data.templates : window.DEFAULT_TEMPLATES;
  buildTemplateOptions();
  const initialValue = templateSelect.options[0]?.value;
  if (initialValue) {
    templateSelect.value = initialValue;
    currentTemplate = getTemplateByValue(initialValue);
    renderFields(currentTemplate);
  }
}

function validateRequiredFields() {
  const inputs = fieldsSection.querySelectorAll("[data-field-id]");
  for (const input of inputs) {
    if (input.required && !input.value.trim()) {
      return input;
    }
  }
  return null;
}

async function applyTemplate() {
  if (!currentTemplate) {
    setStatus("Select a template first.");
    return;
  }

  const missing = validateRequiredFields();
  if (missing) {
    setStatus(`Fill required field: ${missing.dataset.fieldId}`);
    missing.focus();
    return;
  }

  const values = collectValues();
  const subject = applyValues(currentTemplate.subject, values);
  const bodyHtml = applyValues(currentTemplate.body, values);
  const bodyPlain = toPlainText(bodyHtml);

  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setStatus("No active compose tab found.");
      return;
    }

    await browser.compose.setComposeDetails(tab.id, {
      subject,
      body: bodyHtml,
      plainTextBody: bodyPlain,
    });

    setStatus("Template applied.");
  } catch (error) {
    setStatus("Failed to apply template.");
    console.error(error);
  }
}

optionsButton.addEventListener("click", async () => {
  await browser.runtime.openOptionsPage();
});

templateSelect.addEventListener("change", (event) => {
  currentTemplate = getTemplateByValue(event.target.value);
  renderFields(currentTemplate);
});

applyButton.addEventListener("click", applyTemplate);

loadTemplates().catch((error) => {
  console.error(error);
  setStatus("Failed to load templates.");
});
