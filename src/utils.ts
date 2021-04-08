import { Schema } from "amis/lib/types";
import { gNumber } from "../types/jsonSchema";

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