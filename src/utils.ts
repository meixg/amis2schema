import { Schema } from "amis/lib/types";
import { gNumber } from "../types/jsonSchema";

const ignoreType = new Set(['button', 'divider', 'tpl']);

/**
 * 增加最大值和最小值
 */
export function addRange(target: gNumber,schema: Schema) {
    if (schema.min) {
        target.minimum = schema.min;
    }
    if (schema.max) {
        target.maximum = schema.max;
    }
}

export function isIgnoreType(type?: string): boolean {
    if (type && ignoreType.has(type)) {
        return true;
    }
    if (type && type.indexOf('static') > -1) {
        return true;
    }

    return false;
}

