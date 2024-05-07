import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'ternary';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) new style`,
        input: `\
//---------------------------------------- (1)
    if (success) {
        isObject(count)
            ? resolve({
                  success: true,
                  response: \`Successfully...\`
              })
            : resolve({
                  success: false,
                  response: \`You do not...\`
              });
    }
`,
        output: `\
//---------------------------------------- (1)
if (success) {
    isObject(count)
        ? resolve({
              success  : true,
              response : \`Successfully...\`,
          })
        : resolve({
              success  : false,
              response : \`You do not...\`,
          });
}
`,
    },
];

runTestAlign({ desc, parser, fixtures });
