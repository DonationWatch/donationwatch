import cp from "child_process";

import { promptCountries } from "../utils";

const countries = await promptCountries("What country to generate images for?");

const runCommand = `pnpm og-images --hideSkippedTests --testNamePattern "(${countries.join("|")}|renders root page image)"`;

cp.spawn(runCommand, {
  shell: true,
  stdio: "inherit",
});
