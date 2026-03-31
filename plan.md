1. **Create Campaigns Module:**
   - Create `CampaignsModel`, `CampaignsView`, and `CampaignsController` in `js/modules/campaigns/`.
   - Add tool 'campaigns' in `js/app.js` and `js/modules/home/HomeController.js` to enable routing.
   - Add translation texts in `data/locales.json`.
   - Update `index.html` navbar.

2. **Implement Campaigns Logic:**
   - In `CampaignsModel`, manage list of campaigns, the active campaign, and store state in `localStorage` under `trh_campaigns`.
   - Implement importing and exporting of full state: Newspaper (`trh_newspaper_data`), Documents (`trh_documents_data`), Flyers, and AI Config (`ai_config`) using `DataService`. This feature lets DMs pack their entire state into a `.json` file and switch to another workspace.

3. **Pre-commit step:**
   - Run tests to ensure regressions are not introduced.

4. **Submit**
