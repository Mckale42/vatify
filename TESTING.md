# VATify V4 Test Checklist

## Demo mode (no backend credentials required)

The included `.env.local` enables demo mode for local UI testing.

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

### Dashboard
- Confirm animated hero and metric counters.
- Open Notifications.
- Open the mobile Quick Actions FAB.
- Switch between Home, Invoices, VAT, Chat and More on a narrow viewport.

### Invoice capture
- Open **Invoices**.
- Tap **Capture invoice**.
- Choose **Take a photo**. Grant camera permission if the browser supports it.
- Capture an image and choose **Use photo**.
- Watch the processing state and success result.
- Alternatively choose **Upload a document**; demo mode simulates AI extraction.

### Live backend mode
Set these in `.env.local`:

```env
VATIFY_DEMO_MODE=false
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

The existing Supabase/Gemini invoice flow is then used instead of the demo simulator.
