import io, re
from paddleocr import PaddleOCR
from rapidfuzz import fuzz, process

OCR = PaddleOCR(use_angle_cls=True, lang='en')

KNOWN_VENDORS = ["Screwfix","B&Q","Toolstation","Wickes","Builders Depot"]

def to_num(s):
    s = re.sub(r'[^0-9\.,-]', '', s).replace(',', '.')
    try:
        return float(s)
    except:
        return None

def detect_vendor(text):
    best = process.extractOne(text, KNOWN_VENDORS, scorer=fuzz.partial_ratio)
    if best and best[1] >= 80:
        return best[0]
    for v in KNOWN_VENDORS:
        if v.lower() in text.lower():
            return v
    return None

def extract_date(text):
    m = re.search(r'\b(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})\b', text)
    if m: return f"{m[3]}-{m[2]}-{m[1]}"
    m = re.search(r'\b(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})\b', text)
    if m: return m.group(0).replace('.', '-')
    return None

def extract_payment(text):
    T = text.upper()
    if 'CASH' in T: return 'Cash'
    if 'TRANSFER' in T or 'BANK TRANSFER' in T: return 'BankTransfer'
    if 'CARD' in T or 'VISA' in T or 'MASTERCARD' in T: return 'Card'
    return 'Unknown'

def extract_totals(text):
    total, vat, discount = None, None, None
    for ln in text.splitlines():
        if re.search(r'vat|tax', ln, re.I): vat = vat or to_num(ln)
        if re.search(r'discount|promo|off', ln, re.I): discount = discount or to_num(ln)
        if re.search(r'total|amount due|grand total|balance', ln, re.I):
            n = to_num(ln)
            if n is not None:
                total = n if total is None else max(total, n)
    return total, vat, discount

def parse_receipt(image_bytes: bytes, locale='en'):
    img_stream = io.BytesIO(image_bytes)
    res = OCR.ocr(img_stream.read(), cls=True)
    lines = [line[1][0] for page in res for line in page]
    raw_text = "\n".join(lines)

    vendor = detect_vendor(raw_text)
    date = extract_date(raw_text)
    method = extract_payment(raw_text)
    total, vat, discount = extract_totals(raw_text)
    confidence = min(1.0, 0.4 + sum(1 for v in [vendor, date, total, method] if v) * 0.15)

    return {
        'vendor': vendor,
        'date': date,
        'total': total,
        'tax_vat': vat,
        'discount': discount,
        'payment_method': method,
        'bank': None,
        'currency': 'GBP',
        'line_items': [],
        'confidence': confidence,
        'raw_text': raw_text,
        'image_url': '',
        'meta': { 'engine': 'paddleocr', 'locale': locale }
    }


