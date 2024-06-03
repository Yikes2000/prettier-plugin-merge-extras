import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--playwright-click-grouping';
const name = 'click grouping';

const clickGrouping = { playwrightClickGrouping: true };

const fixtures: Fixture[] = [
    {
        name: `${name} (1) off`,
        input: `\
//---------------------------------------- (1)
await test.step("Describe actions", async () => {
    await widgets[0].getApplyBtn.click();
    await expect("...");
    await expect("...");
    await widgets[0].getCancelBtn.click();
    await expect("...").toHaveText("...")
        .toHaveText("...");
    await widgets[0].nthGroup(2)
        .getCancelBtn.click();
    await expect("...");
    await widgets[0].getCancelBtn.click();
    await expect("...");
});
`,
    },
    {
        name: `${name} (2) activated`,
        options: clickGrouping,
        input: `\
//---------------------------------------- (2)
await test.step("Describe actions", async () => {
    await widgets[0].getApplyBtn.click();
    await expect("...");
    await expect("...");
    await widgets[0].getCancelBtn.click();
    await expect("...").toHaveText("...")
        .toHaveText("...");
    await widgets[0].nthGroup(2)
        .getCancelBtn.click();
    await expect("...");
    await widgets[0].getCancelBtn.click(); // use EOL '//' to avoid blank line //
    await expect("...");
});
`,
        output: `\
//---------------------------------------- (2)
await test.step("Describe actions", async () => {

    await widgets[0].getApplyBtn.click();
    await expect("...");
    await expect("...");

    await widgets[0].getCancelBtn.click();
    await expect("...").toHaveText("...")
        .toHaveText("...");

    await widgets[0].nthGroup(2)
        .getCancelBtn.click();
    await expect("...");
    await widgets[0].getCancelBtn.click(); // use EOL '//' to avoid blank line //
    await expect("...");
});
`
    },
];

runTestAlign({ desc, parser, fixtures });
