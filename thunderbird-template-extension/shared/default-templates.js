"use strict";

// Shared defaults for background, options, and popup.
window.DEFAULT_TEMPLATES = [
  {
    id: "intro",
    name: "Intro - New Contact",
    subject: "Intro: {{company}} x {{your_name}}",
    body:
      "<p>Hi {{contact_name}},</p>" +
      "<p>I hope you're doing well. I'm {{your_name}} from {{company}}.</p>" +
      "<p>I'd love to discuss {{topic}}. Are you open to a quick chat next week?</p>" +
      "<p>Best,</p><p>{{your_name}}</p>",
    fields: [
      { id: "contact_name", label: "Contact name", type: "text", required: true },
      { id: "company", label: "Company", type: "text", required: true },
      { id: "your_name", label: "Your name", type: "text", required: true },
      { id: "topic", label: "Topic", type: "text", required: false },
    ],
  },
  {
    id: "follow_up",
    name: "Follow-up",
    subject: "Following up on {{topic}}",
    body:
      "<p>Hi {{contact_name}},</p>" +
      "<p>Just following up on {{topic}}.</p>" +
      "<p>Would {{time_option}} work for a quick call?</p>" +
      "<p>Thanks,</p><p>{{your_name}}</p>",
    fields: [
      { id: "contact_name", label: "Contact name", type: "text", required: true },
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "time_option", label: "Time option", type: "select", required: true, options: ["Tomorrow morning", "Tomorrow afternoon", "Friday"] },
      { id: "your_name", label: "Your name", type: "text", required: true },
    ],
  },
];
