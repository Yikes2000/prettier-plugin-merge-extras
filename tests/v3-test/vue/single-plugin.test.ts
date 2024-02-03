import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const sortImportsPluginOptions = {
  importOrder: ['<THIRD_PARTY_MODULES>', '^@[^/]+/(.*)$', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
};
const braceStylePluginOptions = {
  braceStyle: 'allman',
};
const classnamesPluginOptions = {
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'sort-imports plugin (1) - standalone use',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { ref } from "vue";

import { CounterContainer } from "@/layouts";

import { CounterButton } from "./parts";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton
      @click="
        () => {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['@trivago/prettier-plugin-sort-imports'],
      ...sortImportsPluginOptions,
    },
  },
  {
    name: 'sort-imports plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { ref } from "vue";

import { CounterContainer } from "@/layouts";

import { CounterButton } from "./parts";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton
      @click="
        () => {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['@trivago/prettier-plugin-sort-imports', thisPlugin],
      ...sortImportsPluginOptions,
    },
  },
  {
    name: 'brace-style plugin (1) - standalone use',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { ref } from "vue";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton
      @click="
        () =>
        {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['prettier-plugin-brace-style'],
      ...braceStylePluginOptions,
    },
  },
  {
    name: 'brace-style plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { ref } from "vue";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton
      @click="
        () =>
        {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['prettier-plugin-brace-style', thisPlugin],
      ...braceStylePluginOptions,
    },
  },
  {
    name: 'tailwindcss plugin (1) - standalone use',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { ref } from "vue";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="px-1 font-bold">{{ count }}</span>
    <CounterButton
      @click="
        () => {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['prettier-plugin-tailwindcss'],
    },
  },
  {
    name: 'tailwindcss plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
<script setup lang="ts">
import { CounterButton } from './parts'
import { CounterContainer } from '@/layouts'
import { ref } from 'vue'

withDefaults(defineProps<{
  label?: string;
}>(), {
  label: 'Counter',
})

const count = ref(0)
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="font-bold px-1">{{ count }}</span>
    <CounterButton @click="() => { count += 1 }" />
  </CounterContainer>
</template>
`,
    output: `<script setup lang="ts">
import { CounterButton } from "./parts";
import { CounterContainer } from "@/layouts";
import { ref } from "vue";

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Counter",
  },
);

const count = ref(0);
</script>

<template>
  <CounterContainer>
    <span class="px-1">{{ label }}</span>
    <span class="px-1 font-bold">{{ count }}</span>
    <CounterButton
      @click="
        () => {
          count += 1;
        }
      "
    />
  </CounterContainer>
</template>
`,
    options: {
      plugins: ['prettier-plugin-tailwindcss', thisPlugin],
    },
  },
  {
    name: 'classnames plugin (1) - standalone use',
    input: `
<template>
  <div class="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    class="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
dark:border-neutral-500/30 px-4 py-4 rounded-xl"
  >
    <slot></slot>
  </div>
</template>
`,
    options: {
      plugins: ['prettier-plugin-classnames'],
      ...classnamesPluginOptions,
    },
  },
  {
    name: 'classnames plugin (2) - a combination of a single plugin and a merge plugin also has no effect',
    input: `
<template>
  <div class="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    class="bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
dark:border-neutral-500/30 px-4 py-4 rounded-xl"
  >
    <slot></slot>
  </div>
</template>
`,
    options: {
      plugins: ['prettier-plugin-classnames', thisPlugin],
      ...classnamesPluginOptions,
    },
  },
];

describe('vue/single-plugin', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
