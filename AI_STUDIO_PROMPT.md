# Prompt for Google AI Studio — Android SMS Forwarder App

Paste everything below into AI Studio as your request:

---

Build a minimal Android app (Kotlin, targeting Android 13+, backward compatible to Android 8) called "SMS Forwarder" that does the following:

**Core behavior:**
1. On launch, request runtime permissions: `RECEIVE_SMS` and `READ_SMS`.
2. Register a `BroadcastReceiver` for `android.provider.Telephony.SMS_RECEIVED`.
3. When an SMS arrives, extract: sender phone number, message body, and timestamp (device time, ISO 8601).
4. Send this data as a JSON POST request to a webhook URL (this will be a Google Apps Script web app URL), with this exact body shape:
```json
{
  "apiKey": "the-secret-key",
  "sender": "+1234567890",
  "body": "message text here",
  "received_at": "2026-11-19T10:15:00Z"
}
```
5. The webhook URL and the secret API key should be stored in app settings (a simple settings screen with two text fields: "Webhook URL" and "API Key"), saved in `SharedPreferences`. Do not hardcode them. The apiKey goes inside the JSON body (as shown above), not in a header — Google Apps Script doesn't reliably expose custom headers to the script.
7. If the POST fails (no internet, server error), queue the message in a local Room database table and retry via `WorkManager` with exponential backoff until it succeeds, then delete it from the queue.
8. Run as a foreground service with a persistent low-priority notification ("SMS Forwarder is active") so Android doesn't kill the background listener — required for reliable delivery on most Android versions.
9. Add a simple main screen showing: connection status, count of messages forwarded today, and a "test connection" button that sends a dummy POST to verify the webhook works.
10. Use `OkHttp` or `Retrofit` for networking, `Room` for the local queue, `WorkManager` for retries.

**Do NOT:**
- Do not upload this app to the Play Store (it will violate SMS permission policy for most listings) — I'm installing it manually as an APK I sign myself.
- Do not forward call logs, contacts, or anything beyond SMS content.
- Do not add any analytics, ads, or third-party SDKs beyond what's needed above.

**Output:** Full Android Studio project structure (Gradle files, manifest, all Kotlin source), ready for me to open in Android Studio, build, and sign as a debug/release APK for my own phone.

---

After generating, open the project in **Android Studio** (not AI Studio) to build the APK — AI Studio writes the code but can't compile/install it.
