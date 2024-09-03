import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import {
  thisPlugin,
  noopPlugin,
  sortImportsPluginOptions,
  braceStylePluginOptions,
  classnamesPluginOptions,
  testEach,
} from '../adaptor';

const options = {
  ...baseOptions,
  parser: 'babel',
  returnParentheses: true,
};

const fixtures: Fixture[] = [
  {
    name: 'sort-imports plugin (1) - standalone use',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { useState } from "react";

import { CounterContainer } from "@/layouts";

import { CounterButton } from "./parts";

export default function Counter({ label = "Counter", onChange = undefined }) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['@trivago/prettier-plugin-sort-imports'],
      ...sortImportsPluginOptions,
    },
  },
  {
    name: 'sort-imports plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { useState } from "react";

import { CounterContainer } from "@/layouts";

import { CounterButton } from "./parts";

export default function Counter({ label = "Counter", onChange = undefined }) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['@trivago/prettier-plugin-sort-imports', thisPlugin],
      ...sortImportsPluginOptions,
    },
  },
  {
    name: 'brace-style plugin (1) - standalone use',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { useState } from "react";

export default function Counter({ label = "Counter", onChange = undefined })
{
  const [count, setCount] = useState(0);

  const incrementHandler = () =>
  {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-brace-style'],
      ...braceStylePluginOptions,
    },
  },
  {
    name: 'brace-style plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { useState } from "react";

export default function Counter({ label = "Counter", onChange = undefined })
{
  const [count, setCount] = useState(0);

  const incrementHandler = () =>
  {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-brace-style', thisPlugin],
      ...braceStylePluginOptions,
    },
  },
  {
    name: 'tailwindcss plugin (1) - standalone use',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { useState } from "react";

export default function Counter({ label = "Counter", onChange = undefined }) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="px-1 font-bold">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-tailwindcss'],
    },
  },
  {
    name: 'tailwindcss plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
import { CounterButton } from './parts';
import { CounterContainer } from '@/layouts';
import { useState } from 'react';

export default function Counter({
  label = 'Counter',
  onChange = undefined,
}) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="font-bold px-1">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    output: `import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { useState } from "react";

export default function Counter({ label = "Counter", onChange = undefined }) {
  const [count, setCount] = useState(0);

  const incrementHandler = () => {
    setCount((c) => c + 1);
    onChange?.(count + 1);
  };

  return (
    <CounterContainer>
      <span className="px-1">{label}</span>
      <span className="px-1 font-bold">{count}</span>
      <CounterButton onClick={incrementHandler} />
    </CounterContainer>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-tailwindcss', thisPlugin],
    },
  },
  {
    name: 'classnames plugin (1) - standalone use',
    input: `
export function Callout({ children }) {
  return (
    <div className="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl">
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
dark:border-neutral-500/30 px-4 py-4 rounded-xl"
    >
      {children}
    </div>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-classnames'],
      ...classnamesPluginOptions,
    },
  },
  {
    name: 'classnames plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
export function Callout({ children }) {
  return (
    <div className="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl">
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
dark:border-neutral-500/30 px-4 py-4 rounded-xl"
    >
      {children}
    </div>
  );
}
`,
    options: {
      plugins: ['prettier-plugin-classnames', thisPlugin],
      ...classnamesPluginOptions,
    },
  },
  {
    name: 'issue #31 (1) - standalone use',
    input: `
export function Callout({ children }) {
  return null;
}
`,
    output: `export function Callout({ children }) {\r\n  return null;\r\n}\r\n`,
    options: {
      plugins: [noopPlugin],
      endOfLine: 'crlf',
    },
  },
  {
    name: 'issue #31 (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
export function Callout({ children }) {
  return null;
}
`,
    output: `export function Callout({ children }) {\r\n  return null;\r\n}\r\n`,
    options: {
      plugins: [noopPlugin, thisPlugin],
      endOfLine: 'crlf',
    },
  },
];

testEach(fixtures, options);
