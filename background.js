"use strict";

const TEMPLATE_WINDOW_WIDTH = 380;
const TEMPLATE_WINDOW_HEIGHT = 560;

browser.runtime.onInstalled.addListener(async () => {
  const data = await browser.storage.local.get("templates");
  if (!Array.isArray(data.templates) || data.templates.length === 0) {
    await browser.storage.local.set({ templates: window.DEFAULT_TEMPLATES });
  }
});

browser.composeAction.onClicked.addListener(async (tab) => {
  if (!tab?.id) {
    return;
  }
  const pageUrl = new URL(browser.runtime.getURL("popup/popup.html"));
  pageUrl.searchParams.set("composeTabId", String(tab.id));
  await browser.windows.create({
    type: "popup",
    url: pageUrl.href,
    width: TEMPLATE_WINDOW_WIDTH,
    height: TEMPLATE_WINDOW_HEIGHT,
  });
});
