/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@simpaddock/config/tailwind")],
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
};
