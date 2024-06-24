import { alignObjectProperties } from "./align-obj-props";

interface AlignOptions {
    alignObjectProperties?: string;
    alignSingleProperty?: boolean;
}

const validOptions = ["colon", "value", "none"];
let alignObjPropBy = "colon";
let alignSingleProperty = false;

function setOptions(options: AlignOptions) {
    alignObjPropBy = options.alignObjectProperties ?? alignObjPropBy;

    if (!validOptions.includes(alignObjPropBy)) {
        [alignObjPropBy] = validOptions;
    }

    alignSingleProperty = !!options.alignSingleProperty;
}

export function postprocess(code: string, options: any): string {
    setOptions(options);
    if (alignObjPropBy === "none") {
        return code;
    }

    return alignObjectProperties(code, { alignObjPropBy, alignSingleProperty });
}
