// The page's side of the screen in the browser: one <canvas> and its DOM events. These are
// CheerpJ natives, implemented by the page (main.js) as thin bindings to the DOM; Java decides
// what to draw, when to draw it, and what every event does (see Forms.main).
final class Web {
    // window.devicePixelRatio: device pixels per CSS pixel.
    static native double devicePixelRatio();

    // Puts a canvas of w x h CSS pixels on the page, with scale x scale device pixels for each
    // of them, and focuses it. The page cancels the browser's default action for keyCodes in
    // keys, for keyCodes in ctrlKeys when Ctrl is held, and for printable characters typed
    // without Ctrl, and passes those events on; it leaves every other key alone.
    static native void open(int w, int h, int scale, int[] keys, int[] ctrlKeys);

    // Shows a frame: (w * scale) x (h * scale) pixels of 0xAABBGGRR (see Px). The first one
    // also takes down the page's loader.
    static native void present(int[] px);

    // A CSS cursor name for the canvas, e.g. "text".
    static native void setCursor(String cursor);

    // Waits up to timeoutMs (0: don't wait) for the next event and returns it, or "" if none came:
    //   "d x y"                       mouse button pressed at form pixel (x, y), i.e. CSS pixel
    //   "m x y"                       mouse moved
    //   "k keyCode ctrl shift char"   key pressed: DOM keyCode, ctrl/shift 0 or 1,
    //                                 char the typed character's UTF-16 code or -1 if none
    // CheerpJ counts a thread waiting here as busy (like I/O), so its idleCallback doesn't fire
    // while Forms waits for input; the first present() is the "form is up" signal instead.
    // (JS can't push events into a Java queue instead: CheerpJ refuses library calls into
    // Java while main() runs.)
    static native String nextEvent(int timeoutMs);
}
