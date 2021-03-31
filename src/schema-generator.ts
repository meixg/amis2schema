import {
    gObject,
    gArray,
    gString,
    gBoolean,
    gNumber
} from '../types/jsonSchema';

export const schemaGenerator = {
    createObject() {
        return {
            type: 'object',
            properties: {},
            required: []
        } as gObject;
    },

    createArray() {
        return {
            type: 'array'
        } as gArray;
    },

    createString() {
        return {
            type: 'string'
        } as gString;
    },

    createBoolean() {
        return {
            type: 'boolean'
        } as gBoolean
    },

    createNumber() {
        return {
            type: 'number'
        } as gNumber
    }
}

export function createByValueType(value: any) {
    let type = typeof value;

    if (type === 'string') {
        return schemaGenerator.createString();
    }
    else if (type === 'number') {
        return schemaGenerator.createNumber();
    }
    else if (type === 'boolean') {
        return schemaGenerator.createBoolean();
    }

    throw Error('Unsupported checkbox value type: ' + type);
}