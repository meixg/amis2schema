# amis2schema

根据 [amis](https://github.com/baidu/amis) 表单部分的 json，产出表格数据对应的 json schema。

例如：

```json
{
    "title": "",
    "type": "form",
    "controls": [
        {
            "name": "a",
            "required": true,
            "validations": {},
            "type": "combo",
            "controls": [
                {
                    "name": "item",
                    "required": true,
                    "validations": {},
                    "type": "array",
                    "multiLine": true,
                    "items": {
                        "name": "",
                        "required": false,
                        "label": "",
                        "validations": {},
                        "type": "combo",
                        "controls": [
                            {
                                "name": "key",
                                "required": true,
                                "label": "",
                                "validations": {
                                    "minLength": 1,
                                    "maxLength": 76
                                },
                                "type": "text"
                            }
                        ],
                        "multiLine": true
                    }
                },
                {
                    "name": "content_method",
                    "required": false,
                    "validations": {},
                    "type": "select",
                    "options": [
                        "full",
                        "inc",
                        "dec"
                    ]
                }
            ],
            "multiLine": true
        }
    ]
}
```

得到

```json
{
    "title": "",
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "a": {
            "type": "object",
            "properties": {
                "item": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "key": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "key"
                        ]
                    }
                },
                "content_method": {
                    "type": "string"
                }
            },
            "required": [
                "item"
            ]
        }
    },
    "required": [
        "a"
    ]
}
```

## 使用方式

```javascript
const {amis2JsonSchema} = require('../dist/index');

const amis = {
    type: 'form' // 必须是一个 form
    // ...
};

const res = amis2JsonSchema(amis);
```