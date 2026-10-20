import java.util.ArrayList;
import java.util.Arrays;

// A Forms / EBS-style master-detail data entry screen, hand-painted into an int[] framebuffer (Px).
// No AWT, no Swing, no lambdas, no libraries, Java 8 bytecode, so CheerpJ only has to fetch the
// bare minimum of the JRE before the first frame. In the browser, main() runs the event loop and
// shows each frame on a <canvas> through Web's natives. FormsDesktop runs it in an AWT window.
public class Forms {
    static final int DW = 860, DH = 500, ROWS = 7, LOVY = 110;
    // DOM KeyboardEvent.keyCode values (FormsDesktop maps AWT's to these).
    static final int K_BACK_SPACE = 8, K_TAB = 9, K_ENTER = 13, K_ESCAPE = 27, K_END = 35, K_HOME = 36,
        K_LEFT = 37, K_UP = 38, K_RIGHT = 39, K_DOWN = 40, K_DELETE = 46, K_L = 76, K_S = 83, K_F9 = 120;
    // The keys keyPressed handles, alone and with Ctrl: the page cancels the browser's action for them.
    static final int[] KEYS = {K_BACK_SPACE, K_TAB, K_ENTER, K_ESCAPE, K_END, K_HOME, K_LEFT, K_UP, K_RIGHT, K_DOWN, K_DELETE, K_F9},
        CTRL_KEYS = {K_L, K_S};
    static final int MDI = 0xC3D0E0, CANVAS = 0xE9EEF4,
        BAR = 0xF3F5F8, BORDER = 0x7F9DB9, DARK = 0x2B4566,
        REQ = 0xFFFFC6, RO = 0xE2E5EA, FOCUS = 0x2E6DB4,
        TITLE1 = 0x1F457A, TITLE2 = 0x5A8AC6, SEL = 0xD2E2F6,
        TAB = 0xD3DDE9, BTN1 = 0xFDFEFF, BTN2 = 0xD5DFEA,
        TIP = 0xFFFFE1, DIM = 0x28000000, TXT = 0x000000, WHITE = 0xFFFFFF;

    static final String[] TYPES = {"Standard Purchase Order", "Blanket Purchase Agreement", "Contract Purchase Agreement", "Planned Purchase Order"};
    static final String[] SUPPLIERS = {"Acme Industrial Supply", "Blue River Metals", "Globex Office Products", "Initech Hardware", "Northwind Components", "Summit Logistics"};
    static final String[] SITES = {"HQ", "EAST", "WEST", "CENTRAL"};
    static final String[] CURRENCIES = {"USD", "EUR", "GBP", "JPY"};
    static final String[] UOMS = {"Each", "Box", "Kg", "Hour"};
    static final String[] MENUS = {"File", "Edit", "View", "Folder", "Tools", "Actions", "Window", "Help"};
    static final String[] TOOLS = {"New record", "Save (Ctrl+S)", "Previous record", "Next record", "Delete record"};
    static final String[] TABS = {"Lines", "Price Reference", "Reference Documents", "More"};
    static final String[] COLS = {"Num", "Item", "Description", "UOM", "Quantity", "Price", "Amount"};
    static final int[] COLX = {50, 92, 204, 456, 528, 610, 702}, COLW = {40, 110, 250, 70, 80, 90, 110};

    // One text item. row == -1 is the header block (col = header index), otherwise a cell of the lines block.
    static final class F {
        final String label, lovTitle;
        final String[] lov;
        final int x, y, w, row, col;
        final boolean req, ro, num, right;
        F(String label, int x, int y, int w, int row, int col, String flags, String[] lov, String lovTitle) {
            this.label = label; this.x = x; this.y = y; this.w = w; this.row = row; this.col = col;
            this.lov = lov; this.lovTitle = lovTitle;
            req = flags.indexOf('r') >= 0; ro = flags.indexOf('o') >= 0;
            num = flags.indexOf('n') >= 0; right = flags.indexOf('>') >= 0;
        }
    }

    // One purchase order: header values (PO, type, status, supplier, site, currency, buyer) + lines.
    static final class Rec {
        final String[] h = new String[7];
        final String[][] l = new String[ROWS][7];
        Rec(String... v) {
            Arrays.fill(h, "");
            for (int i = 0; i < ROWS; i++) Arrays.fill(l[i], "");
            for (int i = 0; i < 7 && i < v.length; i++) h[i] = v[i];
        }
        Rec line(int r, String item, String desc, String uom, String qty, String price) {
            l[r][1] = item; l[r][2] = desc; l[r][3] = uom; l[r][4] = qty; l[r][5] = price;
            return this;
        }
    }

    final ArrayList<F> fields = new ArrayList<F>();
    final ArrayList<Rec> recs = new ArrayList<Rec>();
    Rec cur;
    int ri = 0;
    F focus, lov;
    int caret, lovSel, hover = -1;
    String msg = "";
    boolean blink = true, dirty = false;
    final int[] menuX = new int[MENUS.length], menuW = new int[MENUS.length], tabX = new int[TABS.length], tabW = new int[TABS.length];

    final Px buf;
    boolean bold;

    public Forms() { this(1); }

    // scale: device pixels per form pixel in frame(), 1 or 2.
    public Forms(int scale) {
        buf = new Px(DW, DH, scale);
        fields.add(new F("PO Number", 110, 100, 100, -1, 0, "", null, null));
        fields.add(new F("Type", 290, 100, 220, -1, 1, "", TYPES, "Document Types"));
        fields.add(new F("Status", 620, 100, 140, -1, 2, "o", null, null));
        fields.add(new F("Supplier", 110, 128, 300, -1, 3, "r", SUPPLIERS, "Suppliers"));
        fields.add(new F("Site", 490, 128, 100, -1, 4, "r", SITES, "Supplier Sites"));
        fields.add(new F("Currency", 690, 128, 70, -1, 5, "r", CURRENCIES, "Currencies"));
        fields.add(new F("Buyer", 110, 156, 200, -1, 6, "", null, null));
        fields.add(new F("Total", 620, 156, 140, -1, 7, "o>", null, null));
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < 7; c++)
                fields.add(new F(COLS[c], COLX[c], 249 + r * 22, COLW[c], r, c,
                    c == 0 || c == 6 ? "o>" : c >= 4 ? "n>" : "", c == 3 ? UOMS : null, "Units of Measure"));

        recs.add(new Rec("4510", TYPES[0], "Incomplete", "Northwind Components", "EAST", "USD", "Patel, Sam")
            .line(0, "NW-330", "Circuit breaker 20A", "Each", "40", "22.50")
            .line(1, "NW-118", "Cable ties 300mm (pack of 100)", "Box", "30", "6.75")
            .line(2, "NW-907", "Panel enclosure, steel", "Each", "8", "129.00"));
        recs.add(new Rec("4511", TYPES[0], "Approved", "Acme Industrial Supply", "HQ", "USD", "Lee, Jordan")
            .line(0, "AS-1001", "Steel bracket, 40mm", "Each", "250", "1.85")
            .line(1, "AS-2040", "Hex bolt M8 (box of 100)", "Box", "12", "14.20"));
        recs.add(new Rec("4512", TYPES[1], "Incomplete", "Globex Office Products", "WEST", "EUR", "Garcia, Alex")
            .line(0, "GX-0042", "Copy paper A4 (5 reams)", "Box", "60", "24.90")
            .line(1, "GX-0310", "Toner cartridge, black", "Each", "10", "79.50"));
        cur = recs.get(0);
        focusField(fields.get(3));
    }

    // ---- data -------------------------------------------------------------------------------

    static double num(String v) {
        try { return v.length() == 0 ? 0 : Double.parseDouble(v); } catch (NumberFormatException e) { return 0; }
    }

    // Hand-rolled "#,##0.00" so we don't pull in java.util.Formatter / regex for String.format.
    static String money(double v) {
        long c = Math.round(v * 100);
        String sign = c < 0 ? "-" : "";
        if (c < 0) c = -c;
        String whole = String.valueOf(c / 100), cents = String.valueOf(c % 100);
        StringBuilder sb = new StringBuilder(sign);
        for (int i = 0; i < whole.length(); i++) {
            if (i > 0 && (whole.length() - i) % 3 == 0) sb.append(',');
            sb.append(whole.charAt(i));
        }
        return sb.append(cents.length() < 2 ? ".0" : ".").append(cents).toString();
    }

    boolean lineUsed(int r) {
        for (int c = 1; c < 6; c++) if (cur.l[r][c].length() > 0) return true;
        return false;
    }

    String get(F f) {
        if (f.row < 0) {
            if (f.col < 7) return cur.h[f.col];
            double t = 0;
            for (int r = 0; r < ROWS; r++) t += num(cur.l[r][4]) * num(cur.l[r][5]);
            return money(t);
        }
        if (f.col == 0) return lineUsed(f.row) ? String.valueOf(f.row + 1) : "";
        if (f.col == 6) return cur.l[f.row][4].length() + cur.l[f.row][5].length() == 0 ? ""
            : money(num(cur.l[f.row][4]) * num(cur.l[f.row][5]));
        return cur.l[f.row][f.col];
    }

    void set(F f, String v) {
        if (f.row < 0) cur.h[f.col] = v; else cur.l[f.row][f.col] = v;
        dirty = true;
    }

    F field(int row, int col) { return fields.get(8 + row * 7 + col); }

    boolean editable() {
        if (cur.h[2].equals("Approved")) { msg = "Purchase order " + cur.h[0] + " is approved and can no longer be changed."; return false; }
        return true;
    }

    // ---- actions ----------------------------------------------------------------------------

    void focusField(F f) {
        if (f != focus) msg = f.lov != null ? "List of values available (F9)." : "";
        focus = f;
        caret = get(f).length();
    }

    void move(int dir) {
        int i = fields.indexOf(focus);
        do { i = (i + dir + fields.size()) % fields.size(); } while (fields.get(i).ro);
        focusField(fields.get(i));
    }

    void go(int i) {
        ri = i;
        cur = recs.get(i);
        caret = get(focus).length();
    }

    boolean checkRequired() {
        for (int i = 0; i < 8; i++) {
            F f = fields.get(i);
            if (f.req && get(f).trim().length() == 0) {
                focusField(f);
                msg = "Field must be entered: " + f.label + ".";
                return false;
            }
        }
        return true;
    }

    void save() {
        if (!dirty) { msg = "No changes to save."; return; }
        if (!checkRequired()) return;
        dirty = false;
        msg = "Transaction complete: 1 record applied and saved.";
    }

    void approve() {
        if (cur.h[2].equals("Approved")) { msg = "Purchase order " + cur.h[0] + " is already approved."; return; }
        if (!checkRequired()) return;
        cur.h[2] = "Approved";
        dirty = false;
        msg = "Purchase order " + cur.h[0] + " has been approved.";
    }

    void deleteLine() {
        if (focus.row < 0) { msg = "Place the cursor on a line first."; return; }
        if (!editable()) return;
        for (int r = focus.row; r < ROWS - 1; r++) cur.l[r] = cur.l[r + 1];
        cur.l[ROWS - 1] = new String[7];
        Arrays.fill(cur.l[ROWS - 1], "");
        dirty = true;
        caret = Math.min(caret, get(focus).length());
        msg = "Line deleted.";
    }

    void tool(int i) {
        if (i == 0) {
            int po = 0;
            for (int r = 0; r < recs.size(); r++) po = Math.max(po, (int) num(recs.get(r).h[0]));
            recs.add(new Rec(String.valueOf(po + 1), TYPES[0], "Incomplete", "", "", "USD", ""));
            go(recs.size() - 1);
            focusField(fields.get(3));
            dirty = true;
            msg = "New purchase order " + cur.h[0] + ". Pick a supplier with F9.";
        } else if (i == 1) save();
        else if (i == 2) { if (ri > 0) go(ri - 1); else msg = "At first record."; }
        else if (i == 3) { if (ri < recs.size() - 1) go(ri + 1); else msg = "At last record."; }
        else if (recs.size() == 1) msg = "Cannot delete the only record.";
        else {
            recs.remove(ri);
            go(Math.min(ri, recs.size() - 1));
            msg = "Record deleted.";
        }
    }

    void openLov() {
        if (focus.lov == null) { msg = "No list of values for this field."; return; }
        if (!editable()) return;
        lov = focus;
        lovSel = Math.max(0, Arrays.asList(lov.lov).indexOf(get(lov)));
    }

    void pickLov() {
        set(lov, lov.lov[lovSel]);
        caret = get(lov).length();
        lov = null;
        msg = "";
    }

    // ---- text -------------------------------------------------------------------------------
    // Text is drawn from Glyphs, a table of Liberation Sans glyphs pre-rendered at build time
    // (tools/GlyphGen.java). Starting Java's font system costs ~1 s of CPU in CheerpJ before the
    // first frame; this skips it. There is no font to fall back to, so typing is limited to the
    // table (printable ASCII) and anything else is drawn as '?'.

    // HiDPI screens (frame scale 2) get Glyphs2, the same font pre-rendered at 24px. Layout still
    // uses the 12px advances, so text measures the same at both scales.

    // One style of one glyph table: alpha masks for all glyphs one after another (glyph g
    // starts at off[g] * height), and each glyph's advance. A glyph's mask is decoded the first
    // time it's drawn: the form uses about 60 of the 95, and decoding all of the 24px table up
    // front costs ~20 ms before the first frame.
    static final class Face {
        final String px;
        final byte[] mask;
        final boolean[] decoded;
        final int[] off, adv;
        final int ascent, height, pad;

        Face(String px, String adv, int ascent, int height, int pad) {
            this.px = px; this.ascent = ascent; this.height = height; this.pad = pad;
            mask = new byte[px.length()];
            decoded = new boolean[adv.length()];
            this.adv = new int[adv.length()];
            off = new int[adv.length() + 1];
            for (int i = 0; i < adv.length(); i++) {
                this.adv[i] = adv.charAt(i) - 'a';
                off[i + 1] = off[i] + this.adv[i] + 2 * pad;
            }
        }

        // Glyph g's mask starts at off[g] * height.
        byte[] mask(int g) {
            if (!decoded[g]) {
                for (int i = off[g] * height; i < off[g + 1] * height; i++) mask[i] = (byte) ((px.charAt(i) - 'a') * 17);
                decoded[g] = true;
            }
            return mask;
        }
    }

    static final Face REG = new Face(Glyphs.REGULAR, Glyphs.REGULAR_ADV, Glyphs.ASCENT, Glyphs.HEIGHT, Glyphs.PAD),
        BOLD = new Face(Glyphs.BOLD, Glyphs.BOLD_ADV, Glyphs.ASCENT, Glyphs.HEIGHT, Glyphs.PAD);

    // A class of its own so Glyphs2 (~90 KB) only loads on HiDPI screens.
    static final class Hi {
        static final Face REG = new Face(Glyphs2.REGULAR, Glyphs2.REGULAR_ADV, Glyphs2.ASCENT, Glyphs2.HEIGHT, Glyphs2.PAD),
            BOLD = new Face(Glyphs2.BOLD, Glyphs2.BOLD_ADV, Glyphs2.ASCENT, Glyphs2.HEIGHT, Glyphs2.PAD);
    }

    static boolean inTable(char ch) { return ch >= Glyphs.FIRST && ch <= Glyphs.LAST; }

    static int glyph(char ch) { return (inTable(ch) ? ch : '?') - Glyphs.FIRST; }

    int tw(String v) {
        int w = 0;
        for (int i = 0; i < v.length(); i++) w += REG.adv[glyph(v.charAt(i))];
        return w;
    }

    // Like drawString(v, x, y): y is the baseline, color is the Px's current color.
    void text(Px g, String v, int x, int y) {
        Face lo = bold ? BOLD : REG, f = g.s == 1 ? lo : bold ? Hi.BOLD : Hi.REG;
        for (int i = 0; i < v.length(); i++) {
            int gi = glyph(v.charAt(i)), cw = f.off[gi + 1] - f.off[gi];
            // Centre the glyph in its scaled 12px cell: the 24px advances differ by a pixel or two.
            int dx = x * g.s + (lo.adv[gi] * g.s - f.adv[gi]) / 2 - f.pad;
            g.mask(f.mask(gi), f.off[gi] * f.height, cw, f.height, dx, y * g.s - f.ascent);
            x += lo.adv[gi];
        }
    }

    // ---- painting ---------------------------------------------------------------------------

    // Called every 530 ms to blink the caret.
    public void tick() { blink = !blink; }

    // The whole screen, (DW * scale) x (DH * scale) pixels of 0xAABBGGRR (see Px). The form is laid
    // out at a fixed size, like a real Forms canvas; whoever shows it scales it to fit.
    public int[] frame() {
        render(buf);
        return buf.px;
    }

    void render(Px b) {
        b.unclip();
        b.setColor(MDI);
        b.fillRect(0, 0, DW, DH);
        bold = false;
        drawChrome(b);
        drawWindow(b);
        if (lov != null) drawLov(b);
        if (hover >= 100 && hover < 100 + TOOLS.length) {
            String t = TOOLS[hover - 100];
            int tx = toolX(hover - 100), tw = tw(t) + 10;
            b.setColor(TIP); b.fillRect(tx, 52, tw, 18);
            b.setColor(TXT); b.drawRect(tx, 52, tw - 1, 17); text(b, t, tx + 5, 65);
        }
    }

    static int toolX(int i) { return 8 + i * 30 + (i >= 2 ? 10 : 0) + (i >= 4 ? 10 : 0); }

    // fillPolygon would pull Java2D's general shape rasterizer (~384 KB of rt.jar) into the boot,
    // and all we draw are small arrow triangles, so fill them by scanline with fillRect.
    static void fillTri(Px b, int[] xs, int[] ys) {
        int y0 = Math.min(ys[0], Math.min(ys[1], ys[2])), y1 = Math.max(ys[0], Math.max(ys[1], ys[2]));
        for (int y = y0; y < y1; y++) {
            double yc = y + 0.5, l = Double.MAX_VALUE, r = -Double.MAX_VALUE; // sample at pixel centres, like fillPolygon
            for (int i = 0; i < 3; i++) {
                int ax = xs[i], ay = ys[i], bx = xs[(i + 1) % 3], by = ys[(i + 1) % 3];
                if ((yc >= ay) != (yc >= by)) {
                    double x = ax + (yc - ay) * (bx - ax) / (by - ay);
                    l = Math.min(l, x);
                    r = Math.max(r, x);
                }
            }
            int xl = (int) Math.ceil(l - 0.5), xr = (int) Math.ceil(r - 0.5);
            if (xr > xl) b.fillRect(xl, y, xr - xl, 1);
        }
    }

    void sunken(Px b, int x, int y, int w, int h) {
        b.setColor(WHITE); b.fillRect(x, y, w, h);
        b.setColor(BORDER); b.drawRect(x, y, w - 1, h - 1);
    }

    void button(Px b, String label, int x, int y, int w, int h, boolean hov) {
        // Rounded corners built from rects and lines: fill/drawRoundRect (with a gradient) would pull
        // Java2D's general shape rasterizer into the boot, the same ~384 KB of rt.jar as fillPolygon.
        b.gradient(0, y, hov ? WHITE : BTN1, 0, y + h, hov ? SEL : BTN2);
        b.fillRect(x + 2, y, w - 4, h);
        b.fillRect(x + 1, y + 1, w - 2, h - 2);
        b.fillRect(x, y + 2, w, h - 4);
        b.setColor(hov ? FOCUS : BORDER);
        b.drawLine(x + 3, y, x + w - 4, y);
        b.drawLine(x + 3, y + h - 1, x + w - 4, y + h - 1);
        b.drawLine(x, y + 3, x, y + h - 4);
        b.drawLine(x + w - 1, y + 3, x + w - 1, y + h - 4);
        b.fillRect(x + 1, y + 1, 2, 1); b.fillRect(x + 1, y + 2, 1, 1);
        b.fillRect(x + w - 3, y + 1, 2, 1); b.fillRect(x + w - 2, y + 2, 1, 1);
        b.fillRect(x + 1, y + h - 2, 2, 1); b.fillRect(x + 1, y + h - 3, 1, 1);
        b.fillRect(x + w - 3, y + h - 2, 2, 1); b.fillRect(x + w - 2, y + h - 3, 1, 1);
        b.setColor(TXT);
        text(b, label, x + (w - tw(label)) / 2, y + h / 2 + 4);
    }

    void drawChrome(Px b) {
        b.setColor(BAR);
        b.fillRect(0, 0, DW, 52);
        b.setColor(BORDER);
        b.drawLine(0, 22, DW, 22);
        b.drawLine(0, 52, DW, 52);

        int x = 4;
        for (int i = 0; i < MENUS.length; i++) {
            int mw = tw(MENUS[i]) + 16;
            menuX[i] = x; menuW[i] = mw;
            if (hover == 200 + i) { b.setColor(SEL); b.fillRect(x, 2, mw, 18); }
            b.setColor(TXT);
            text(b, MENUS[i], x + 8, 16);
            b.drawLine(x + 8, 18, x + 7 + tw(MENUS[i].substring(0, 1)), 18); // mnemonic underline
            x += mw;
        }

        for (int i = 0; i < TOOLS.length; i++) {
            int tx = toolX(i), ty = 25;
            if (hover == 100 + i) {
                b.setColor(SEL); b.fillRect(tx, ty, 25, 24);
                b.setColor(BORDER); b.drawRect(tx, ty, 24, 23);
            }
            if (i == 0) { // new: blank page
                b.setColor(WHITE); b.fillRect(tx + 7, ty + 4, 11, 16);
                b.setColor(DARK); b.drawRect(tx + 7, ty + 4, 11, 16);
                b.drawLine(tx + 14, ty + 4, tx + 18, ty + 8);
            } else if (i == 1) { // save: floppy
                b.setColor(DARK); b.fillRect(tx + 5, ty + 4, 15, 16);
                b.setColor(WHITE); b.fillRect(tx + 8, ty + 5, 9, 6);
                b.setColor(RO); b.fillRect(tx + 9, ty + 14, 7, 6);
            } else if (i == 2 || i == 3) { // previous / next record
                int d = i == 2 ? -1 : 1, cx = tx + 12;
                b.setColor(FOCUS);
                fillTri(b, new int[] {cx + 5 * d, cx - 5 * d, cx - 5 * d}, new int[] {ty + 12, ty + 5, ty + 19});
            } else { // delete: red cross
                b.setColor(0xC62828);
                b.drawLine(tx + 7, ty + 6, tx + 17, ty + 17, 3);
                b.drawLine(tx + 17, ty + 6, tx + 7, ty + 17, 3);
            }
        }
        b.setColor(BORDER);
        b.drawLine(toolX(2) - 6, 27, toolX(2) - 6, 48);
        b.drawLine(toolX(4) - 6, 27, toolX(4) - 6, 48);

        int sy = DH - 24;
        b.setColor(BAR); b.fillRect(0, sy, DW, 24);
        b.setColor(BORDER); b.drawLine(0, sy, DW, sy);
        sunken(b, 4, sy + 3, 676, 18);
        sunken(b, 684, sy + 3, 172, 18);
        b.setColor(TXT);
        text(b, msg, 10, sy + 16);
        text(b, "Record: " + (ri + 1) + "/" + recs.size() + (dirty ? "   (changed)" : ""), 690, sy + 16);
    }

    void drawWindow(Px b) {
        int wx = 12, wy = 62, ww = 836, wh = 400;
        b.setColor(CANVAS); b.fillRect(wx, wy, ww, wh);
        b.gradient(wx, 0, TITLE1, wx + ww, 0, TITLE2);
        b.fillRect(wx, wy, ww, 22);
        b.setColor(DARK); b.drawRect(wx, wy, ww - 1, wh - 1);
        bold = true; b.setColor(WHITE);
        text(b, "Purchase Orders (Demo Operations) - " + cur.h[0] + (cur.h[3].length() > 0 ? ", " + cur.h[3] : ""), wx + 8, wy + 15);
        bold = false;
        for (int i = 0; i < 3; i++) { // fake minimise / maximise / close boxes
            int bx = wx + ww - 60 + i * 19;
            b.setColor(BTN2); b.fillRect(bx, wy + 4, 16, 14);
            b.setColor(DARK); b.drawRect(bx, wy + 4, 15, 13);
            if (i == 0) b.drawLine(bx + 4, wy + 14, bx + 11, wy + 14);
            else if (i == 1) b.drawRect(bx + 4, wy + 7, 7, 7);
            else { b.drawLine(bx + 4, wy + 7, bx + 11, wy + 14); b.drawLine(bx + 11, wy + 7, bx + 4, wy + 14); }
        }

        // tabbed canvas holding the lines block
        int x = 26;
        for (int i = 0; i < TABS.length; i++) {
            int tw = tw(TABS[i]) + 24;
            tabX[i] = x; tabW[i] = tw;
            b.setColor(i == 0 ? CANVAS : hover == 300 + i ? SEL : TAB);
            b.fillRect(x, 196, tw, 22);
            b.setColor(BORDER); b.drawRect(x, 196, tw - 1, 22);
            bold = i == 0; b.setColor(TXT);
            text(b, TABS[i], x + 12, 211);
            x += tw + 2;
        }
        bold = false;
        b.setColor(BORDER); b.drawRect(24, 218, 812, 196);
        b.setColor(CANVAS); b.fillRect(tabX[0] + 1, 217, tabW[0] - 2, 3);

        for (int c = 0; c < 7; c++) {
            b.setColor(TAB); b.fillRect(COLX[c], 228, COLW[c], 20);
            b.setColor(BORDER); b.drawRect(COLX[c], 228, COLW[c] - 1, 19);
            b.setColor(TXT);
            int lw = tw(COLS[c]);
            text(b, COLS[c], c == 0 || c >= 4 ? COLX[c] + COLW[c] - lw - 5 : COLX[c] + 5, 242);
        }
        for (int r = 0; r < ROWS; r++) { // current record indicator
            int ry = 249 + r * 22;
            b.setColor(focus.row == r ? DARK : WHITE); b.fillRect(36, ry + 3, 10, 14);
            b.setColor(BORDER); b.drawRect(36, ry + 3, 9, 13);
        }
        int sbx = 816, sby = 249, sbh = ROWS * 22 - 2; // decorative scrollbar, all rows fit
        b.setColor(RO); b.fillRect(sbx, sby, 14, sbh);
        b.setColor(BORDER); b.drawRect(sbx, sby, 13, sbh - 1);
        b.setColor(BTN2); b.fillRect(sbx + 1, sby + 14, 12, sbh - 28);
        b.setColor(BORDER); b.drawRect(sbx + 1, sby + 14, 11, sbh - 29);
        b.drawLine(sbx, sby + 13, sbx + 13, sby + 13);
        b.drawLine(sbx, sby + sbh - 14, sbx + 13, sby + sbh - 14);
        b.setColor(DARK);
        fillTri(b, new int[] {sbx + 3, sbx + 11, sbx + 7}, new int[] {sby + 9, sby + 9, sby + 4});
        fillTri(b, new int[] {sbx + 3, sbx + 11, sbx + 7}, new int[] {sby + sbh - 9, sby + sbh - 9, sby + sbh - 4});

        for (int i = 0; i < fields.size(); i++) drawField(b, fields.get(i));

        button(b, "Delete Line", 632, 424, 98, 26, hover == 401);
        button(b, "Approve", 736, 424, 100, 26, hover == 400);
    }

    boolean hasLovBtn(F f) { return f.lov != null && (f.row < 0 || f == focus); }

    int inner(F f) { return f.w - 8 - (hasLovBtn(f) ? 18 : 0); }

    // Where the text starts; scrolls left if the caret would run past the end of the item.
    int textX(F f, String v) {
        if (f.right) return f.x + 4 + inner(f) - tw(v);
        int cw = f == focus ? tw(v.substring(0, caret)) : 0;
        return f.x + 4 - Math.max(0, cw - inner(f));
    }

    void drawField(Px b, F f) {
        boolean foc = f == focus;
        b.setColor(f.ro ? RO : f.req ? REQ : f.row >= 0 && f.row == focus.row ? SEL : WHITE);
        b.fillRect(f.x, f.y, f.w, 20);
        b.setColor(foc ? FOCUS : BORDER);
        b.drawRect(f.x, f.y, f.w - 1, 19);
        if (foc) b.drawRect(f.x + 1, f.y + 1, f.w - 3, 17);

        String v = get(f);
        int tx = textX(f, v);
        b.clip(f.x + 2, f.y, inner(f) + 4, 20);
        b.setColor(TXT);
        text(b, v, tx, f.y + 14);
        if (foc && blink && lov == null) {
            int cx = tx + tw(v.substring(0, caret));
            b.drawLine(cx, f.y + 4, cx, f.y + 16);
        }
        b.unclip();

        if (hasLovBtn(f)) {
            int bx = f.x + f.w - 19;
            b.setColor(hover == 3000 + fields.indexOf(f) ? SEL : BTN2); b.fillRect(bx, f.y + 2, 17, 16);
            b.setColor(BORDER); b.drawRect(bx, f.y + 2, 16, 15);
            b.setColor(DARK);
            for (int d = 0; d < 3; d++) b.fillRect(bx + 4 + d * 4, f.y + 12, 2, 2);
        }
        if (f.row < 0) {
            b.setColor(DARK);
            text(b, f.label, f.x - 6 - tw(f.label), f.y + 14);
        }
    }

    int lovX() { return (DW - 320) / 2; }

    void drawLov(Px b) {
        int lx = lovX(), n = lov.lov.length, lh = 32 + n * 20 + 46;
        b.setColor(DIM); b.fillRect(0, 0, DW, DH);
        b.fillRect(lx + 4, LOVY + 4, 320, lh);
        b.setColor(CANVAS); b.fillRect(lx, LOVY, 320, lh);
        b.gradient(lx, 0, TITLE1, lx + 320, 0, TITLE2);
        b.fillRect(lx, LOVY, 320, 22);
        b.setColor(DARK); b.drawRect(lx, LOVY, 319, lh - 1);
        bold = true; b.setColor(WHITE);
        text(b, lov.lovTitle, lx + 8, LOVY + 15);
        bold = false;
        int ly = LOVY + 32;
        sunken(b, lx + 10, ly - 1, 300, n * 20 + 2);
        for (int i = 0; i < n; i++) {
            boolean sel = i == lovSel;
            if (sel || hover == 500 + i) { b.setColor(sel ? FOCUS : SEL); b.fillRect(lx + 11, ly + i * 20, 298, 20); }
            b.setColor(sel ? WHITE : TXT);
            text(b, lov.lov[i], lx + 16, ly + i * 20 + 14);
        }
        int by = ly + n * 20 + 10;
        button(b, "OK", lx + 140, by, 80, 26, hover == 590);
        button(b, "Cancel", lx + 230, by, 80, 26, hover == 591);
    }

    // ---- input ------------------------------------------------------------------------------

    static boolean in(int x, int y, int rx, int ry, int rw, int rh) { return x >= rx && x < rx + rw && y >= ry && y < ry + rh; }

    // Hit codes: 100+ toolbar, 200+ menu, 300+ tab, 400/401 buttons, 500+ LOV rows, 590/591 LOV buttons,
    // 1000+ field, 3000+ field's LOV button, -2 inside the LOV dialog, -1 nothing.
    int hit(int x, int y) {
        if (lov != null) {
            int lx = lovX(), n = lov.lov.length, ly = LOVY + 32, by = ly + n * 20 + 10;
            if (in(x, y, lx + 10, ly, 300, n * 20)) return 500 + (y - ly) / 20;
            if (in(x, y, lx + 140, by, 80, 26)) return 590;
            if (in(x, y, lx + 230, by, 80, 26)) return 591;
            return in(x, y, lx, LOVY, 320, by + 36 - LOVY) ? -2 : -1;
        }
        for (int i = 0; i < MENUS.length; i++) if (in(x, y, menuX[i], 2, menuW[i], 18)) return 200 + i;
        for (int i = 0; i < TOOLS.length; i++) if (in(x, y, toolX(i), 25, 25, 24)) return 100 + i;
        for (int i = 0; i < TABS.length; i++) if (in(x, y, tabX[i], 196, tabW[i], 22)) return 300 + i;
        if (in(x, y, 632, 424, 98, 26)) return 401;
        if (in(x, y, 736, 424, 100, 26)) return 400;
        for (int i = 0; i < fields.size(); i++) {
            F f = fields.get(i);
            if (hasLovBtn(f) && in(x, y, f.x + f.w - 19, f.y + 2, 17, 16)) return 3000 + i;
            if (in(x, y, f.x, f.y, f.w, 20)) return 1000 + i;
        }
        return -1;
    }

    // Coordinates are in form pixels (0..DW, 0..DH). The caller repaints after every call that
    // returns true, or after every call for the ones that return nothing.

    public void mousePressed(int x, int y) {
        int h = hit(x, y);
        if (lov != null) {
            if (h >= 500 && h < 590) { lovSel = h - 500; pickLov(); }
            else if (h == 590) pickLov();
            else if (h == 591 || h == -1) lov = null;
        } else if (h >= 3000) {
            focusField(fields.get(h - 3000));
            openLov();
        } else if (h >= 1000) {
            F f = fields.get(h - 1000);
            if (!f.ro) {
                focusField(f);
                String v = get(f);
                int tx = textX(f, v), best = 0; // caret goes to the nearest character boundary
                for (int i = 1; i <= v.length(); i++)
                    if (Math.abs(tx + tw(v.substring(0, i)) - x) < Math.abs(tx + tw(v.substring(0, best)) - x)) best = i;
                caret = best;
            }
        } else if (h == 400) approve();
        else if (h == 401) deleteLine();
        else if (h > 300) msg = "The " + TABS[h - 300] + " tab is not part of this demo.";
        else if (h >= 200 && h < 300) msg = "The " + MENUS[h - 200] + " menu is not part of this demo.";
        else if (h >= 100 && h < 200) tool(h - 100);
        blink = true;
    }

    // Returns 0 if nothing changed, otherwise repaint and show cursor 1 (default) or 2 (text).
    public int mouseMoved(int x, int y) {
        int h = hit(x, y);
        if (h == hover) return 0;
        hover = h;
        return h >= 1000 && h < 3000 && !fields.get(h - 1000).ro ? 2 : 1;
    }

    // k is a DOM keyCode. Returns true if the key was handled: the caller then repaints and
    // cancels the browser's default action, and doesn't pass the key on to keyTyped.
    public boolean keyPressed(int k, boolean ctrl, boolean shift) {
        if (lov != null) {
            if (k == K_UP) lovSel = Math.max(0, lovSel - 1);
            else if (k == K_DOWN) lovSel = Math.min(lov.lov.length - 1, lovSel + 1);
            else if (k == K_ENTER) pickLov();
            else if (k == K_ESCAPE) lov = null;
            else return k == K_TAB; // keep the focus in the form
            return true;
        }
        String v = get(focus);
        if (ctrl && k == K_S) save();
        else if (k == K_F9 || ctrl && k == K_L) openLov();
        else if (k == K_TAB) move(shift ? -1 : 1);
        else if (k == K_ENTER) move(1);
        else if ((k == K_UP || k == K_DOWN) && focus.row >= 0) {
            int r = focus.row + (k == K_UP ? -1 : 1);
            if (r >= 0 && r < ROWS) focusField(field(r, focus.col));
        } else if (k == K_LEFT) caret = Math.max(0, caret - 1);
        else if (k == K_RIGHT) caret = Math.min(v.length(), caret + 1);
        else if (k == K_HOME) caret = 0;
        else if (k == K_END) caret = v.length();
        else if (k == K_BACK_SPACE) {
            if (caret > 0 && editable()) { set(focus, v.substring(0, caret - 1) + v.substring(caret)); caret--; }
        } else if (k == K_DELETE) {
            if (caret < v.length() && editable()) set(focus, v.substring(0, caret) + v.substring(caret + 1));
        } else return false;
        blink = true;
        return true;
    }

    // One typed character (not called for keys keyPressed handled, or with Ctrl held).
    public void keyTyped(char ch) {
        if (lov != null || ch < 32 || ch == 127) return;
        if (focus.num && (ch < '0' || ch > '9') && ch != '.') msg = "This field only accepts numbers.";
        else if (!inTable(ch)) msg = "Only plain ASCII characters can be typed in this demo.";
        else if (get(focus).length() < 60 && editable()) {
            String v = get(focus);
            set(focus, v.substring(0, caret) + ch + v.substring(caret));
            caret++;
            msg = "";
        }
        blink = true;
    }

    // ---- browser ----------------------------------------------------------------------------

    // The browser entry point: puts the form on the page and runs its event loop.
    public static void main(String[] args) {
        // Draw at device resolution on HiDPI screens, so text and lines stay sharp.
        int scale = Web.devicePixelRatio() >= 1.5 ? 2 : 1;
        Forms f = new Forms(scale);
        Web.open(DW, DH, scale, KEYS, CTRL_KEYS);
        long nextBlink = System.currentTimeMillis() + 530;
        boolean changed = true;
        while (true) {
            // Handle everything that's already queued before drawing, so a burst of mouse moves
            // or keys costs one frame.
            String e = Web.nextEvent(0);
            if (e.length() == 0) {
                if (changed) { Web.present(f.frame()); changed = false; }
                e = Web.nextEvent((int) Math.max(1, nextBlink - System.currentTimeMillis()));
            }
            if (e.length() == 0) {
                f.tick();
                nextBlink += 530;
                changed = true;
                continue;
            }
            String[] p = e.split(" ");
            char type = p[0].charAt(0);
            if (type == 'd') {
                f.mousePressed(Integer.parseInt(p[1]), Integer.parseInt(p[2]));
                changed = true;
            } else if (type == 'm') {
                int c = f.mouseMoved(Integer.parseInt(p[1]), Integer.parseInt(p[2]));
                if (c != 0) { Web.setCursor(c == 2 ? "text" : "default"); changed = true; }
            } else if (type == 'k') {
                boolean ctrl = p[2].equals("1");
                int ch = Integer.parseInt(p[4]);
                if (!f.keyPressed(Integer.parseInt(p[1]), ctrl, p[3].equals("1")) && ch >= 0 && !ctrl) f.keyTyped((char) ch);
                changed = true;
            }
        }
    }
}
