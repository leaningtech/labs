import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;

// Runs Forms in a desktop AWT window, for development (java -jar forms.jar).
// The browser build doesn't use this class, so it never loads AWT.
public class FormsDesktop extends Canvas implements Runnable {
    final Forms forms = new Forms();
    final BufferedImage img = new BufferedImage(Forms.DW, Forms.DH, BufferedImage.TYPE_INT_RGB);
    final int[] rgb = new int[Forms.DW * Forms.DH];

    FormsDesktop() {
        setPreferredSize(new Dimension(Forms.DW, Forms.DH));
        setFocusTraversalKeysEnabled(false); // Forms wants Tab itself
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) { requestFocus(); forms.mousePressed(e.getX(), e.getY()); repaint(); }
        });
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseMoved(MouseEvent e) {
                int c = forms.mouseMoved(e.getX(), e.getY());
                if (c == 0) return;
                setCursor(Cursor.getPredefinedCursor(c == 2 ? Cursor.TEXT_CURSOR : Cursor.DEFAULT_CURSOR));
                repaint();
            }
        });
        addKeyListener(new KeyAdapter() {
            public void keyPressed(KeyEvent e) {
                if (forms.keyPressed(domKey(e.getKeyCode()), e.isControlDown(), e.isShiftDown())) { e.consume(); repaint(); }
            }
            public void keyTyped(KeyEvent e) {
                if (e.isConsumed() || e.isControlDown()) return;
                forms.keyTyped(e.getKeyChar());
                repaint();
            }
        });
    }

    // AWT's key codes match the DOM's except for these two.
    static int domKey(int vk) {
        return vk == KeyEvent.VK_ENTER ? Forms.K_ENTER : vk == KeyEvent.VK_DELETE ? Forms.K_DELETE : vk;
    }

    public void run() {
        while (true) {
            try { Thread.sleep(530); } catch (InterruptedException e) { return; }
            forms.tick();
            repaint();
        }
    }

    public void update(Graphics g) { paint(g); } // skip the default clear, we draw every pixel

    public void paint(Graphics g) {
        int[] px = forms.frame();
        for (int i = 0; i < px.length; i++) { int c = px[i]; rgb[i] = (c & 0xFF) << 16 | (c & 0xFF00) | (c >> 16 & 0xFF); }
        img.setRGB(0, 0, Forms.DW, Forms.DH, rgb, 0, Forms.DW);
        g.drawImage(img, 0, 0, null);
    }

    public static void main(String[] args) {
        Frame f = new Frame("CheerpJ forms demo");
        FormsDesktop c = new FormsDesktop();
        f.add(c);
        f.pack();
        f.setResizable(false);
        f.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) { System.exit(0); }
        });
        f.setVisible(true);
        c.requestFocus();
        new Thread(c).start();
    }
}
