# SMS → Google Sheet → Website

Flow: phone receives SMS → forwarder app sends it to a Google Apps Script URL →
script saves it into a Google Sheet → this website reads from the same script and
shows a searchable list.

## 1. Create the Google Sheet "backend"

1. Go to https://sheets.new to create a new blank Google Sheet. Name it anything,
   e.g. "Client Messages".
2. In the Sheet, go to **Extensions → Apps Script**.
3. Delete anything in the editor and paste the contents of `Code.gs` (in this repo) instead.
4. In the script, change this line to your own secret value (any long random string):
   ```js
   var API_KEY = 'change-this-to-a-long-random-secret';
   ```
   Keep this value private — it's what protects your messages from being readable by
   anyone who finds the URL.
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (don't worry — the API key still protects it)
6. Click **Deploy**, authorize the permissions it asks for (it's your own script, so
   this is safe), and copy the **Web app URL** it gives you. It looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXX/exec
   ```
   Save this URL and your API key somewhere safe — you'll need both for the phone
   app and the website.

## 2. Deploy the website to Netlify

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick this repo.
3. Build settings: leave blank (no build command needed) — `netlify.toml` already
   tells Netlify to publish the root folder as-is.
4. Click **Deploy**. Netlify gives you a URL like `yoursite.netlify.app`.
5. Open that URL. The first time, it'll ask for the **Apps Script Web App URL** and
   your **API Key** — paste both in. They're saved only in your browser
   (`localStorage`), not anywhere public.

## 3. Set up the phone app

Use `AI_STUDIO_PROMPT.md` in this repo with Google AI Studio to generate the Android
app code, then build it in Android Studio. When you install it on your phone, enter
the same **Web App URL** and **API Key** in the app's settings screen.

## Security notes

- Anyone who has both your Web App URL *and* API key can read and write your
  messages. Treat the API key like a password — don't share the URL/key together
  in public places (e.g. don't post a screenshot showing both).
- If the API key ever leaks, just change `API_KEY` in the Apps Script, redeploy
  (**Deploy → Manage deployments → Edit → New version**), and update it in the
  website and the phone app.
- This setup is meant for your own business messages. Forwarding other people's
  one-time passcodes or private messages without their knowledge is a different,
  much more sensitive thing — this guide assumes it's your own phone and your own
  incoming texts.
