import { describe, it, expect } from 'vitest'
import * as topps from '@/lib/ocr/vendors/toppsTiles'
import * as moran from '@/lib/ocr/vendors/mpMoran'
import * as wickes from '@/lib/ocr/vendors/wickes'
import * as stevens from '@/lib/ocr/vendors/chrisStevens'
import * as tradepoint from '@/lib/ocr/vendors/tradepoint'
import * as screwfix from '@/lib/ocr/vendors/screwfix'

describe('Vendor detectors and parsers', () => {
  it('Topps Tiles detection and parsing', () => {
    const txt = `Topps Tiles
    SKU 123456  2 x £3.50
    VAT 20% £2.10
    TOTAL £10.10`
    expect(topps.isVendor(txt)).toBe(true)
    const totals = topps.extractTotals(txt)
    expect(totals.total).toBeDefined()
    const items = topps.extractLineItems(txt)
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].name).toBeTruthy()
  })

  it('MP Moran detection and parsing', () => {
    const txt = `MP Moran
    Copper Pipe
    1 EA @ 3.20
    VAT £0.64
    Grand Total £3.84`
    expect(moran.isVendor(txt)).toBe(true)
    const totals = moran.extractTotals(txt)
    expect(totals.total).toBeDefined()
    const items = moran.extractLineItems(txt)
    expect(items.length).toBeGreaterThan(0)
  })

  it('Wickes detection and parsing', () => {
    const txt = `Wickes
    Sand Bag @ £1.40
    Project Saving -£0.20
    VAT £2.50
    Total £80.07`
    expect(wickes.isVendor(txt)).toBe(true)
    const totals = wickes.extractTotals(txt)
    expect(totals.total).toBeDefined()
    const items = wickes.extractLineItems(txt)
    expect(items.length).toBeGreaterThan(0)
  })

  it('Chris Stevens detection and parsing', () => {
    const txt = `Chris Stevens Ltd
    ProductA  £10.00  2  £20.00
    VAT £4.00
    Amount Due £24.00`
    expect(stevens.isVendor(txt)).toBe(true)
    const totals = stevens.extractTotals(txt)
    expect(totals.total).toBeDefined()
    const items = stevens.extractLineItems(txt)
    expect(items.length).toBeGreaterThan(0)
  })

  it('TradePoint detection and parsing', () => {
    const txt = `TradePoint
    Screw Pack 2 x £3.00 = £6.00
    TP 10% Loyalty -£0.60
    VAT £1.08
    TOTAL £10.80`
    expect(tradepoint.isVendor(txt)).toBe(true)
    const totals = tradepoint.extractTotals(txt)
    expect(totals.total).toBeDefined()
    const items = tradepoint.extractLineItems(txt)
    expect(items.length).toBeGreaterThan(0)
  })

  it('Screwfix regression basic', () => {
    const txt = `Screwfix
    VAT £2.00
    Total £12.00`
    expect(screwfix.isVendor(txt)).toBe(true)
    const totals = screwfix.extractTotals(txt)
    expect(totals.total).toBeDefined()
  })
})


