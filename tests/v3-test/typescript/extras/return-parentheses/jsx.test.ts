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

    /*****************************************
     *  Arrow Function: () => ...
     *****************************************/
    {
        name: `${name} (2) arrow body one-line shorthand`,
        input: `\
//---------------------------------------- (2)

export default () => <div>ABC</div>;
`,
    },
    {
        name: `${name} (2.1) arrow body one-line strips extra parens`,
        input: `\
//---------------------------------------- (2.1)

export default () => (<div>ABC</div>);
`,
        output: `\
//---------------------------------------- (2.1)

export default () => <div>ABC</div>;
`,
    },
    {
        name: `${name} off (-2): arrow body one-line shorthand`,
        options: {returnParentheses: true},
        input: `\
//---------------------------------------- (-2)

export default () => <div>ABC</div>;
`,
    },
    {
        name: `${name} (3) arrow body multi-line, no parens`,
        input: `\
//---------------------------------------- (3)

export default () => <div>
    TESTING WITH A MUCH LONGER SENTENCE TO TRIGGER LINE WRAPPING, WHICH
    BREAKS IT INTO MULTIPLE LINES.
</div>;
`,
    },
    {
        name: `${name} off (-3): arrow body multi-line`,
        options: {returnParentheses: true},
        input: `\
//---------------------------------------- (-3)

export default () => <div>
    TESTING WITH A MUCH LONGER SENTENCE TO TRIGGER LINE WRAPPING, WHICH
    BREAKS IT INTO MULTIPLE LINES.
</div>;
`,
        output: `\
//---------------------------------------- (-3)

export default () => (
    <div>
        TESTING WITH A MUCH LONGER SENTENCE TO TRIGGER LINE WRAPPING, WHICH
        BREAKS IT INTO MULTIPLE LINES.
    </div>
);
`,
    },

];

runTestAlign({ desc, parser, fixtures });
