import {
    JSONSchema4
} from "json-schema";

export interface gObject extends JSONSchema4 {
    type: 'object';
    properties: {[k: string]: JSONSchema4};
    required: string[];
}

export interface gArray extends JSONSchema4 {
    type: 'array';
    items: JSONSchema4;
    minItems?: number;
    maxItems?: number;
}

export interface gString extends JSONSchema4 {
    type: 'string';
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    format?: string;
}

export interface gBoolean extends JSONSchema4 {
    type: 'boolean';
}
export interface gNumber extends JSONSchema4 {
    type: 'number';
    minimum: number;
    maximum: number;
}

export interface gAny extends JSONSchema4 {
    type: ['integer', 'string', 'number', 'boolean', 'null', 'array', 'object'];
}

