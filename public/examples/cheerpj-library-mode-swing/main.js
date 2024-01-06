await cheerpjInit();
cheerpjCreateDisplay(-1, -1);
const lib = await cheerpjRunLibrary("/app/");

const JFrame = await lib.javax.swing.JFrame;
const JLabel = await lib.javax.swing.JLabel;
const Font = await lib.java.awt.Font;
const Dimension = await lib.java.awt.Dimension;

let f = await new JFrame("Swing example");
await f.setPreferredSize(await new Dimension(200, 100));

let l = await new JLabel("Hello, library mode!");
await l.setFont(await new Font("Sans", Font.PLAIN, 18));

await f.add(l);
await f.pack();
await f.setLocationRelativeTo(null);
await f.setVisible(true);

document.getElementById("name").addEventListener("input", async (evt) => {
	await l.setText("Hello, " + evt.target.value + "!");
});
