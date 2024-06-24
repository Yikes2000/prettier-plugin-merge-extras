/**
 * For Playwright tests, insert a blank line between 'await expect(...)' and 'await ...click()' to signify
 * a new group of test steps.
 *
 * Examples:
 *
 *     await test.step('Describe actions', async () => {
 *
 *         await widgets[0].getApplyBtn.click();
 *         await expect(...);
 *         await expect(...);
 *
 *         await widgets[0].getCancelBtn.click();
 *         await expect(...).toHaveText(...)
 *             .toHaveText(...);
 *
 *         await widgets[0].nthGroup(2)
 *             .getCancelBtn.click();
 *         await expect(...);
 *         await widgets[0].getCancelBtn.click(); // use EOL '//' to avoid blank line //
 *         await expect(...);
 *     });
 */

interface PlaywrightOptions {
    playwrightClickGrouping?: boolean;
}

let pwClickGrouping = false;

function setOptions(options: PlaywrightOptions) {
    pwClickGrouping = !!options.playwrightClickGrouping;
}

const RE_CLICK = /\.click\(\)/;

export function postprocess(code: string, options: any): string {
    setOptions(options);

    // Skip if turned off, or no '.click()' detected
    if (!pwClickGrouping || !RE_CLICK.test(code)) {
        return code;
    }

    if (pwClickGrouping) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-param-reassign
        code = groupByClickCalls(code);
    }

    return code;
}

// ---------------------------------------------------------------------------------------------------- @ignore

const RE_GROUP_CLICK_CALL =
    /(?<=\{\n|\s*await expect\([^\n]+?(?:\n[ ]*\.[^\n]+?)*;\n)([ ]*await [^\n]+(?:\n\s*\.[^\n]+?)*\s*\.click\([^\n]*\);\n)/g;
//   (?<=\{\n|\s*await expect\([^\n]+?                    ;\n)
//                                    (?:\n[ ]*\.[^\n]+?)*    ([ ]*await [^\n]+                   \s*\.click\([^\n]*\);\n)
//                                                                             (?:\n\s*\.[^\n]+?)*

function groupByClickCalls(code: string): string {
    //
    if (!pwClickGrouping || !RE_GROUP_CLICK_CALL.test(code)) {
        return code;
    }

    return code.replace(RE_GROUP_CLICK_CALL, "\n$1");
}
