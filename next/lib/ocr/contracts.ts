export interface ReceiptParseRequest {
  fileUrl: string;
  projectId?: string | null;
  locale?: 'fa' | 'en';
}

export interface LineItem {
  name: string;
  qty?: number;
  unit_price?: number;
  total?: number;
}

export interface ReceiptParseResult {
  vendor?: string;
  date?: string;
  total?: number;
  tax_vat?: number;
  payment_method?: 'Cash' | 'Card' | 'BankTransfer' | 'Unknown';
  bank?: string | null;
  discount?: number;
  currency?: 'GBP' | 'EUR' | 'IRR' | 'USD' | string;
  line_items?: LineItem[];
  confidence?: number;
  raw_text: string;
  image_url: string;
  meta?: Record<string, any>;
}

export interface IReceiptParser {
  parse(req: ReceiptParseRequest): Promise<ReceiptParseResult>;
}


