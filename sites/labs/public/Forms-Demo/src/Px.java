import java.util.Arrays;

// A tiny software renderer over an int[] framebuffer: exactly the operations Forms draws with.
// It replaces AWT, so the browser build never loads java.awt (~4.5 MB of runtime and ~0.5 s).
// Pixels are stored as 0xAABBGGRR, which is the byte order of an HTML canvas' ImageData on
// little-endian machines, so the page can copy the frame without converting it.
// Colors passed in are 0xRRGGBB, or 0xAARRGGBB with alpha < 255 for blending.
// Coordinates are in form pixels; the framebuffer has s x s device pixels for each of them
// (s = 2 on HiDPI screens), and everything but mask() scales to it.
final class Px {
    final int w, h, s; // w and h in form pixels
    final int dw;      // row length in device pixels
    final int[] px;
    int color = 0xFF000000; // 0xAABBGGRR
    // Clip rectangle in device pixels, as [cx0, cx1) x [cy0, cy1).
    int cx0, cy0, cx1, cy1;
    // Linear gradient for fillRect, set by gradient(), cleared by setColor().
    boolean grad;
    int gx, gy, gc1, gc2;
    double gdx, gdy;

    Px(int w, int h, int s) {
        this.w = w; this.h = h; this.s = s;
        dw = w * s;
        px = new int[dw * h * s];
        unclip();
    }

    static int abgr(int argb) {
        int a = argb >>> 24 == 0 ? 0xFF : argb >>> 24;
        return a << 24 | (argb & 0xFF) << 16 | (argb & 0xFF00) | (argb >> 16 & 0xFF);
    }

    void setColor(int argb) { color = abgr(argb); grad = false; }

    // Like GradientPaint(x1, y1, c1, x2, y2, c2): acyclic, opaque colors.
    void gradient(int x1, int y1, int c1, int x2, int y2, int c2) {
        double len2 = (double) (x2 - x1) * (x2 - x1) + (double) (y2 - y1) * (y2 - y1);
        gx = x1; gy = y1; gc1 = abgr(c1); gc2 = abgr(c2);
        gdx = (x2 - x1) / len2; gdy = (y2 - y1) / len2;
        grad = true;
    }

    void clip(int x, int y, int cw, int ch) {
        cx0 = Math.max(cx0, x * s); cy0 = Math.max(cy0, y * s);
        cx1 = Math.min(cx1, (x + cw) * s); cy1 = Math.min(cy1, (y + ch) * s);
    }

    void unclip() { cx0 = 0; cy0 = 0; cx1 = dw; cy1 = h * s; }

    static int lerp(int c1, int c2, double t) {
        int r = 0;
        for (int sh = 0; sh < 24; sh += 8) {
            int a = c1 >> sh & 0xFF, b = c2 >> sh & 0xFF;
            r |= (int) (a + (b - a) * t + 0.5) << sh;
        }
        return 0xFF000000 | r;
    }

    // Source-over of src (0xAABBGGRR) with alpha a onto an opaque pixel.
    static int blend(int dst, int src, int a) {
        if (a >= 255) return src;
        int na = 255 - a, r = 0;
        for (int sh = 0; sh < 24; sh += 8)
            r |= ((src >> sh & 0xFF) * a + (dst >> sh & 0xFF) * na + 127) / 255 << sh;
        return 0xFF000000 | r;
    }

    // One device pixel.
    void dot(int i, int j) {
        if (i < cx0 || i >= cx1 || j < cy0 || j >= cy1) return;
        int k = j * dw + i, a = color >>> 24;
        px[k] = a == 0xFF ? color : blend(px[k], color, a);
    }

    void fillRect(int x, int y, int rw, int rh) {
        int x0 = Math.max(x * s, cx0), y0 = Math.max(y * s, cy0), x1 = Math.min((x + rw) * s, cx1), y1 = Math.min((y + rh) * s, cy1);
        int a = color >>> 24;
        for (int j = y0; j < y1; j++) {
            int row = j * dw;
            if (grad) {
                for (int i = x0; i < x1; i++) {
                    double t = ((i + 0.5) / s - gx) * gdx + ((j + 0.5) / s - gy) * gdy;
                    px[row + i] = lerp(gc1, gc2, t < 0 ? 0 : t > 1 ? 1 : t);
                }
            } else if (a == 0xFF) {
                if (x1 > x0) Arrays.fill(px, row + x0, row + x1, color);
            } else {
                for (int i = x0; i < x1; i++) px[row + i] = blend(px[row + i], color, a);
            }
        }
    }

    // Like Graphics.drawRect: the outline covers (rw + 1) x (rh + 1) pixels.
    void drawRect(int x, int y, int rw, int rh) {
        fillRect(x, y, rw + 1, 1);
        fillRect(x, y + rh, rw + 1, 1);
        fillRect(x, y + 1, 1, rh - 1);
        fillRect(x + rw, y + 1, 1, rh - 1);
    }

    // One-pixel line including both end points: Bresenham at 1x, a 1-pixel-wide stroke above.
    void drawLine(int x0, int y0, int x1, int y1) {
        if (s > 1) { drawLine(x0, y0, x1, y1, 1); return; }
        int dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
        while (true) {
            dot(x0, y0);
            if (x0 == x1 && y0 == y1) return;
            int e2 = 2 * e;
            if (e2 >= dy) { e += dy; x0 += sx; }
            if (e2 <= dx) { e += dx; y0 += sy; }
        }
    }

    // Like drawLine with BasicStroke(lw): square caps, device pixels whose centres fall inside the
    // stroke. The stroke is centred on the end points' pixel centres, like Java2D's.
    void drawLine(int x0, int y0, int x1, int y1, double lw) {
        double ax = (x0 + 0.5) * s, ay = (y0 + 0.5) * s, dx = (x1 - x0) * s, dy = (y1 - y0) * s;
        double len = Math.sqrt(dx * dx + dy * dy), hw = lw * s / 2, ux = len == 0 ? 1 : dx / len, uy = len == 0 ? 0 : dy / len;
        int m = (int) Math.ceil(hw) + 1;
        for (int j = (int) Math.min(ay, ay + dy) - m; j <= (int) Math.max(ay, ay + dy) + m; j++)
            for (int i = (int) Math.min(ax, ax + dx) - m; i <= (int) Math.max(ax, ax + dx) + m; i++) {
                double qx = i + 0.5 - ax, qy = j + 0.5 - ay;
                double along = qx * ux + qy * uy, across = Math.abs(qx * uy - qy * ux);
                if (along >= -hw && along < len + hw && across < hw) dot(i, j);
            }
    }

    // Blends an mw x mh alpha mask (alpha[off + y * mw + x], 0..255) in the current color, with
    // its top-left corner at device pixel (dx, dy).
    void mask(byte[] alpha, int off, int mw, int mh, int dx, int dy) {
        for (int y = 0; y < mh; y++) {
            int j = dy + y;
            if (j < cy0 || j >= cy1) continue;
            for (int x = 0; x < mw; x++) {
                int i = dx + x, a = alpha[off + y * mw + x] & 0xFF;
                if (a == 0 || i < cx0 || i >= cx1) continue;
                px[j * dw + i] = blend(px[j * dw + i], color, a);
            }
        }
    }
}
