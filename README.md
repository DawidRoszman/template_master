# Mail Templates (Thunderbird)

## Load in Thunderbird
1. Open Thunderbird.
2. Go to `Tools` > `Add-ons and Themes`.
3. Click the gear icon and choose `Debug Add-ons`.
4. Click `Load Temporary Add-on...` and select `manifest.json` from this folder.

## Use
1. Open a new compose window.
2. Click the `Mail Templates` button in the compose toolbar.
3. Pick a template, fill the fields, and click `Apply to compose`.

## Customize templates
Open `Tools` > `Add-ons and Themes` > your extension > `Preferences`, or click `Manage templates` in the popup.
Use the form editor to manage templates, fields, and the rich-text body. Use `{{field_id}}` placeholders in `subject` and `body`.
If you need to import/export JSON, open the **Advanced JSON** panel and apply it there.

Example field definition:
```json
{
  "id": "contact_name",
  "label": "Contact name",
  "type": "text",
  "required": true
}
```

### Dynamic select options (months)
You can generate month options automatically:
```json
{
  "id": "report_month",
  "label": "Report month",
  "type": "select",
  "optionsDynamic": "months"
}
```

Advanced:
```json
{
  "id": "report_month",
  "label": "Report month",
  "type": "select",
  "optionsDynamic": {
    "type": "months",
    "count": 4,
    "startOffset": 0,
    "step": -1,
    "format": "monthYear",
    "locale": "pl"
  }
}
```

`format` supports: `month`, `shortMonth`, `monthYear`, `shortMonthYear`.
`locale` supports any BCP-47 tag (e.g. `pl` or `pl-PL`).

## Contact placeholders
When composing a message to a contact in your address book, you can use:
- `{{contact.firstName}}`
- `{{contact.lastName}}`
- `{{contact.displayName}}`
- `{{contact.email}}`

Underscore variants also work: `{{contact_first_name}}`, etc.
