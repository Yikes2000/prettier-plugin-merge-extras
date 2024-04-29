import type { SupportOptions } from 'prettier';
import { PreserveLine } from './preserve-line';

export const options: SupportOptions = {
    ...PreserveLine.options
};
