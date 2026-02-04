"use strict";

browser.runtime.onInstalled.addListener(async () => {
  const data = await browser.storage.local.get("templates");
  if (!Array.isArray(data.templates) || data.templates.length === 0) {
    await browser.storage.local.set({ templates: window.DEFAULT_TEMPLATES });
  }
});
