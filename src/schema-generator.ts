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
    },

    createLocation() {
        return {
            type: 'object',
            properties: {
                address: schemaGenerator.createString(),
                lat: schemaGenerator.createNumber(),
                lng: schemaGenerator.createNumber(),
                city: schemaGenerator.createString(),
                vendor: schemaGenerator.createString()
            },
            required: []
        } as gObject;
    },

    createMatrix() {
        return {
            type: 'array',
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        checked: schemaGenerator.createBoolean(),
                        label: schemaGenerator.createString()
                    }
                }
            }
        } as gArray;
    }
}

// 有一些类型有候选值，根据候选值的类型来设置 schema 类型
// 只判断第一个候选值，不支持候选值类型不同的情况
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