import { createApp } from "vue";

import { createAsciiThemePlugin, useAsciiTheme } from "@abvx/ascii-theme/vue";
import "@abvx/ascii-theme/style.css";

const app = createApp({
  setup() {
    const theme = useAsciiTheme();
    return { theme };
  },
  template: `
    <section>
      <button type="button" @click="theme.toggleStyle()">Toggle style</button>
      <button type="button" @click="theme.setTheme('sepia')">Sepia</button>
      <button type="button" @click="theme.setTheme('matrix')">Matrix</button>
      <p>{{ theme.style }} / {{ theme.theme }} / {{ theme.mode }}</p>
    </section>
  `,
});

app.use(
  createAsciiThemePlugin({
    managedMode: true,
    defaultStyle: "default",
    defaultTheme: "light",
  }),
);

app.mount("#app");
