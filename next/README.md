# Accounting Next App

## Setup

Create `.env.local` in `next/` with:

```
MONGODB_URI=mongodb+srv://.../your-db
# OCR selection (true uses remote, false uses local parser)
USE_REMOTE_OCR=false
# Remote OCR service endpoint (used when USE_REMOTE_OCR=true)
OCR_SERVICE_URL=http://localhost:8000/v1/receipt:parse
# Public URL of this Next app (used by remote parser to fetch image bytes)
PUBLIC_BASE_URL=http://localhost:3000
```

Install and run:

```
npm install
npm run dev
```

## OCR Modes
- Local (default): `/api/ocr` uses `parserLocal`, expects client to pass `raw_text` when available (e.g. from `tesseract.js`).
- Remote: set `USE_REMOTE_OCR=true` and run the Python OCR service below.

### Python OCR Service (PaddleOCR)
Located in `ocr-service/`

```
cd ../ocr-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Or with Docker:

```
docker build -t ocr-service .
docker run -p 8000:8000 ocr-service
```

## Endpoints
- POST `/api/upload` — image upload to `/public/uploads` (max 5MB, image/* only)
- POST `/api/ocr` — parses receipt (local or remote based on env)
- GET/POST `/api/income` — create/list income (userId is demo placeholder)
- GET/POST `/api/expenses` — create/list expenses

## UI
- Accounting home: `/accounting` — daily balance; supports `?date=YYYY-MM-DD`
- Income: `/accounting/income` — create + list
- Expenses: `/accounting/expenses` — create + list
- Receipt OCR: `/accounting/receipt` — upload + OCR + save as expense


