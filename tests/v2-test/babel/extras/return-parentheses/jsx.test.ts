import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--return-parentheses';
const name = 'return parentheses';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic JSX`,
        input: `\
//---------------------------------------- (1)

class JSXDemo extends React.Component {
    render() {
        return <div>
            <div>Hello world!</div>
        </div>;
    }
}

ReactDOM.render(<JSXDemo />, document.getElementById("root"));
`,
    },
    {
        name: `${name} (-1) off`,
        options: {returnParentheses: true},
        input: `\
//---------------------------------------- (-1)

class JSXDemo extends React.Component {
    render() {
        return <div>
            <div>Hello world!</div>
        </div>;
    }
}

ReactDOM.render(<JSXDemo />, document.getElementById("root"));
`,
        output: `\
//---------------------------------------- (-1)

class JSXDemo extends React.Component {
    render() {
        return (
            <div>
                <div>Hello world!</div>
            </div>
        );
    }
}

ReactDOM.render(<JSXDemo />, document.getElementById("root"));
`
    },
];

runTestAlign({ desc, parser, fixtures });
