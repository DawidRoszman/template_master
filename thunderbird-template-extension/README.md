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
Edit the JSON and save. Use `{{field_id}}` placeholders in `subject` and `body`.

Example field definition:
```json
{
  "id": "contact_name",
  "label": "Contact name",
  "type": "text",
  "required": true
}
```
