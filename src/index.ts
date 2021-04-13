import type {
    JSONSchema4
} from 'json-schema';
import type {SchemaNode as AmisSchema, Schema} from 'amis/lib/types';
import {createByValueType, schemaGenerator} from './schema-generator';
import { addRange, isIgnoreType } from './utils';

class Amis2JsonSchemaCompiler {
    run(schema: Schema): Pick<JSONSchema4, 'properties' | 'required'>{
        return this.compileFormOrCombo(schema);
    }

    // 这些 type 都是容器，例如：
    // 有些 controls 内部使用 FieldSet 等套了一层
    // 需要把他们打平
    flatControls(controls: Schema[]) {
        const res = controls.slice();
        let i = 0;
        while (i < res.length) {
            const control = res[i];

            // 直接把里面的 controls 展开
            if (
                control.type === 'fieldSet'
                || control.type === 'group'
                || control.type === 'input-group'
                || control.type === 'panel'
            ) {
                const c = this.flatControls(control.controls);
                res.splice(i, 1, ...c);
                i += c.length;
                continue;
            }

            // 直接把里面的 columns 展开
            if (
                control.type === 'grid'
                || control.type === 'hbox'
            ) {
                const c = this.flatControls(control.columns);
                res.splice(i, 1, ...c);
                i += c.length;
                continue;
            }

            // 删除
            if (isIgnoreType(control.type)) {
                res.splice(i, 1);
                continue;
            }

            // 合并 tabs 下面的所有 controls
            if (control.type === 'tabs') {
                const c = [];
                control.tabs.forEach(item => {
                    c.push(...this.flatControls(item.controls));
                });
                res.splice(i, 1, ...c);
                i += c.length;
                continue;
            }
            i++;
        }
        return res;
    }

    // TODO：
    // formula 用到的变量内容，提交的时候不会包含
    // 需要在这里遍历一边 controls，遇到 formula 之后
    // 解析表达式，找到所有变量，删除这些变量
    processFormula(controls: Schema[]) {

    }

    compileFormOrCombo(schema: Schema): Pick<JSONSchema4, 'properties' | 'required'>{
        let controls = schema.controls;
        if (!controls) {
            return {};
        }

        const res = schemaGenerator.createObject();

        // 预处理
        controls = this.flatControls(controls);
        // this.processFormula(controls);

        controls.forEach((item: Schema) => {
            if (item.required) {
                res.required.push(item.name);
            }

            res.properties[item.name] = this.control2property(item);
        });

        return res;
    }

    control2property(control: Schema): JSONSchema4 {

        switch (control.type) {
            case 'array': {
                return this.compileArray(control);
            }
            case 'checkbox': {
                return this.compileCheckbox(control);
            }
            case 'combo': {
                return this.compileFormOrCombo(control);
            }

            // 容器
            case 'container': {
                return this.control2property(control.body);
            }

            // 字符串
            case 'checkboxes':
            case 'city':
            case 'color':
            case 'chained-select':
            case 'date':
            case 'date-range':
            case 'editor':
            case 'image':
            case 'nested-select':
            case 'options':
            case 'picker':
            case 'repeat':
            case 'richText': 
            case 'transfer':
            case 'tag':
            case 'tabs-transfer':
            case 'textarea':
            case 'text':
            case 'tree-select':
            case 'tree': {
                return this.compileToString(control);
            }
            case 'hidden': {
                return this.compileHidden(control);
            }
            case 'list': {
                return this.compileList(control);
            }
            case 'location': {
                return schemaGenerator.createLocation();
            }
            case 'matrix': {
                return schemaGenerator.createMatrix();
            }
            case 'number': {
                return this.compileNumber(control);
            }
            case 'radios': {
                const value = typeof control.options[0] === 'object'
                    ? control.options[0].value
                    : control.options[0];
                return createByValueType(control.options[0].value);
            }
            case 'range': {
                return this.compileRange(control);
            }
            case 'rating': {
                return this.compileToNumber(control);
            }
            case 'select': {
                if (!control.options) {
                    return this.compileToAny(control);
                }
                const value = typeof control.options[0] === 'object'
                    ? control.options[0].value
                    : control.options[0];
                return createByValueType(value);
            }
            case 'static': {
                return createByValueType(control.value);
            }
            case 'switch': {
                return this.compileSwitch(control);
            }
            case 'table': {
                return this.compileTable(control);
            }
        }

        throw Error(control.type + ' is not handled!');
    }

    compileArray(schema: Schema) {
        const res = schemaGenerator.createArray();

        const items = schema.items;
        
        if (Array.isArray(items)) {
            throw Error('Array items is not support in array type.');
        }
        if (!items) {
            throw Error('Array item is not specified.');
        }

        res.items = this.control2property(items);

        return res;
    }

    compileCheckbox(schema: Schema) {
        if (schema.trueValue && schema.falseValue) {
            return createByValueType(schema.trueValue);
        }

        return this.compileToBoolean(schema);
    }

    compileList(schema: Schema) {
        return createByValueType(schema.options[0].value);
    }

    compileNumber(schema: Schema) {
        const s = schemaGenerator.createNumber();
        addRange(s, schema);
        return s;
    }

    compileHidden(schema: Schema) {
        return createByValueType(schema.value);
    }

    compileRange(schema: Schema) {
        if (schema.multiple) {
            return schemaGenerator.createString();
        }

        const s = schemaGenerator.createNumber();
        addRange(s, schema);
        return s;
    }

    compileSwitch(schema: Schema) {
        if (schema.trueValue && schema.falseValue) {
            return createByValueType(schema.trueValue);
        }

        return this.compileToBoolean(schema);
    }

    compileTable(schema: Schema) {
        const s = schemaGenerator.createArray();
        s.items = schemaGenerator.createObject();
        
        if (schema.columns) {
            schema.columns.forEach(item => {
                s.items.properties[item.name] = schemaGenerator.createString();
            });
        }

        return s;
    }

    // 下面的是一些通用逻辑，有些类型不需要单独处理
    // 只生成对应类型的 schema 就行了
    compileToString(schema: Schema) {
        return schemaGenerator.createString();
    }

    compileToNumber(schema: Schema) {
        return schemaGenerator.createNumber();
    }

    compileToBoolean(schema: Schema) {
        return schemaGenerator.createBoolean();
    }

    compileToAny(schema: Schema) {
        return schemaGenerator.createAny();
    }
}

export function amis2JsonSchema(schema: AmisSchema): JSONSchema4 {
    if (typeof schema !== 'object' || Array.isArray(schema)) {
        throw new Error('amis2JsonSchema 只支持 object 转换');
    }

    if (schema.type !== 'form') {
        throw new Error('根节点的类型需要为 form');
    }

    const compiler = new Amis2JsonSchemaCompiler();

    const {properties, required} = compiler.run(schema);

    return {
        title: schema.title,
        $schema: 'http://json-schema.org/schema#',
        type: 'object',
        properties,
        required
    };
}
