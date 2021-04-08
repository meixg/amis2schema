import type {
    JSONSchema4
} from 'json-schema';
import type {SchemaNode as AmisSchema, Schema} from 'amis/lib/types';
import {createByValueType, schemaGenerator} from './schema-generator';
import { addRange } from './utils';

class AmisSchema2JsonSchemaCompiler {
    run(schema: Schema): Pick<JSONSchema4, 'properties' | 'required'>{
        return this.compileFormOrCombo(schema);
    }

    // 有些 controls 内部使用 FieldSet 等套了一层
    // 需要把他们打平
    flatControls(controls: Schema[]) {
        const res = controls.slice();
        let i = 0;
        while (i < res.length) {
            const control = res[i];
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
            if (
                control.type === 'grid'
                || control.type === 'hbox'
            ) {
                const c = this.flatControls(control.columns);
                res.splice(i, 1, ...c);
                i += c.length;
                continue;
            }
            if (control.type === 'divider') {
                res.splice(i, 1);
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
            case 'Image': {
                return this.compileToString(control);
            }
            case 'hidden': {
                return this.compileHidden(control);
            }
            case 'list': {
                return this.compileList(control);
            }
            case 'Location': {
                return schemaGenerator.createLocation();
            }
            case 'Matrix': {
                return schemaGenerator.createMatrix();
            }
            case 'NestedSelect': {
                return this.compileToString(control);
            }
            case 'Number': {
                return this.compileNumber(control);
            }
            case 'Options': {
                return this.compileToString(control);
            }
            case 'Picker': {
                return this.compileToString(control);
            }
            case 'Radios': {
                return createByValueType(control.options[0].value);
            }
            case 'Range': {
                return this.compileRange(control);
            }
            case 'Rating': {
                return this.compileToNumber(control);
            }
            case 'Repeat': {
                return this.compileToString(control);
            }
            case 'RichText': {
                return this.compileToString(control);
            }
            case 'Select': {
                return createByValueType(control.options[0].value);
            }
            case 'Static': {
                return createByValueType(control.value);
            }
            case 'Switch': {
                return this.compileSwitch(control);
                break;
            }
            case 'Table': {
                break;
            }
            case 'TabsTransfer': {
                break;
            }
            case 'Tabs': {
                break;
            }
            case 'Tag': {
                break;
            }
            case 'Textarea': {
                break;
            }
            case 'Text': {
                break;
            }
            case 'Transfer': {
                break;
            }
            case 'TreeSelect': {
                break;
            }
            case 'Tree': {
                break;
            }
        }

        throw Error(control.type + 'is not handled!');
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
}

export function amisSchema2JsonSchema(schema: AmisSchema): JSONSchema4 {
    if (typeof schema !== 'object' || Array.isArray(schema)) {
        throw new Error('amisSchema2JsonSchema 只支持 object 转换');
    }

    if (schema.type !== 'form') {
        throw new Error('根节点的类型需要为 form');
    }

    const compiler = new AmisSchema2JsonSchemaCompiler();

    const {properties, required} = compiler.run(schema);

    return {
        title: schema.title,
        $schema: 'http://json-schema.org/schema#',
        type: 'object',
        properties,
        required
    };
}
