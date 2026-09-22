const expoConfig = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // react-hooks/immutability flags `sharedValue.value = ...` as an illegal
    // mutation, but that assignment is the documented, correct way to update
    // a Reanimated SharedValue from an event handler (not a React state
    // mutation during render). This app uses that pattern throughout its
    // press/transition animations, so the rule is disabled project-wide.
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);
