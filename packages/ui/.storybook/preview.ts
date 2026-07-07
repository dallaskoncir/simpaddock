import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0f172a" },
      ],
    },
  },
};

export default preview;
