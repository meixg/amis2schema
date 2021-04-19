const {amis2JsonSchema} = require('../dist/index');

// const amis = { "title": "example.xsd", "type": "form", "mode": "horizontal", "controls": [{ "name": "DOCUMENT", "required": true, "validations": {}, "type": "combo", "controls": [{ "name": "item", "required": true, "validations": {}, "type": "array", "multiLine": true, "items": { "name": "", "required": false, "label": "标记每条信息的开始和结束", "validations": {}, "type": "combo", "controls": [{ "name": "key", "required": true, "label": "key关键词，目前一个key标签中只支持输入一个关键词，不支持罗列关键词。当用户在百度检索此关键词时，即可检索到", "validations": { "minLength": 1, "maxLength": 76 }, "type": "text" }, { "name": "display", "required": true, "label": "display表示盖关键词要显示的搜索结果信息，包含以下的url、title等标签。display标签中的文本长度上限为2", "validations": {}, "type": "combo", "controls": [{ "name": "url", "required": true, "label": "资源的链接地址", "validations": { "minLength": 1, "maxLength": 256, "matchRegexp": "(https?://)(.+)" }, "type": "text" }, { "name": "title", "required": false, "label": "模板标题", "validations": {}, "type": "text" }, { "name": "isSpecialType", "required": false, "label": "判断是否出现大图，存在该字段则出现大图（当前未使用）", "validations": {}, "type": "text" }, { "name": "listData", "required": true, "validations": {}, "type": "array", "multiLine": true, "items": { "name": "", "required": false, "label": "数据列表", "validations": {}, "type": "combo", "controls": [{ "name": "SubAbs", "required": true, "label": "内容简介描述", "validations": {}, "type": "text" }, { "name": "SubAbsHighlight", "required": false, "label": "描述所需飘红字段（当前未使用）", "validations": {}, "type": "text" }, { "name": "big_img_url", "required": true, "label": "大图url地址", "validations": {}, "type": "text" }, { "name": "delay", "required": false, "label": "未知字段（当前未使用）", "validations": {}, "type": "text" }, { "name": "footerLeftData", "required": true, "label": "数据来源", "validations": {}, "type": "text" }, { "name": "footerRightData", "required": true, "label": "发布时间", "validations": {}, "type": "text" }, { "name": "imgUrl", "required": false, "label": "图片地址（当前未使用）", "validations": {}, "type": "text" }, { "name": "ltj", "required": false, "label": "未知字段（当前未使用）", "validations": {}, "type": "text" }, { "name": "origin", "required": false, "label": "未知字段（当前未使用）", "validations": {}, "type": "text" }, { "name": "titleText", "required": true, "label": "二级标题", "validations": {}, "type": "text" }, { "name": "url", "required": true, "label": "二级标题跳转地址", "validations": {}, "type": "text" }, { "name": "url_is_mip", "required": true, "label": "是否是mip页", "validations": {}, "type": "text" }, { "name": "waplogo", "required": false, "label": "未知字段（当前未使用）", "validations": {}, "type": "text" }, { "name": "avatar", "required": false, "label": "来源icon地址，可选字段", "validations": {}, "type": "text" }], "multiLine": true } }, { "name": "resdispdata", "required": true, "label": "缓存备份数据", "validations": {}, "type": "combo", "controls": [{ "name": "SubTitleUrl0", "required": false, "label": "listData中index为0的二级标题url地址（数量同listData）", "validations": {}, "type": "text" }, { "name": "SubTitleUrl1", "required": false, "label": "listData中index为1的二级标题url地址", "validations": {}, "type": "text" }, { "name": "SubTitleUrl2", "required": false, "label": "listData中index为2的二级标题url地址", "validations": {}, "type": "text" }, { "name": "SubTitleUrl3", "required": false, "label": "listData中index为3的二级标题url地址", "validations": {}, "type": "text" }, { "name": "SubTitleUrl4", "required": false, "label": "listData中index为4的二级标题url地址", "validations": {}, "type": "text" }, { "name": "wise_big_pic0", "required": false, "label": "大图地址（当前未使用）", "validations": {}, "type": "text" }, { "name": "url_wise0", "required": false, "label": "第一条消息的方图资源", "validations": {}, "type": "text" }], "multiLine": true }, { "name": "sfUrl", "required": false, "label": "情景页跳转地址（当前未使用）", "validations": {}, "type": "text" }, { "name": "showLeftText", "required": true, "label": "模板底部来源", "validations": {}, "type": "text" }, { "name": "showRightText", "required": true, "label": "查看更多", "validations": {}, "type": "text" }, { "name": "showRightUrl", "required": false, "label": "查看更多链接（当前未使用）", "validations": {}, "type": "text" }, { "name": "card_title", "required": true, "label": "后端飘红title", "validations": {}, "type": "text" }, { "name": "down_url", "required": true, "label": "降级链接，用于六合异步降级时使用", "validations": {}, "type": "text" }, { "name": "list_type", "required": true, "label": "当list_type有且不为0的时候为横划样式，list_type === 1列表强样式展现3条，list_type === 2列表弱样式展现2条", "validations": {}, "type": "number" }], "multiLine": true }], "multiLine": true } }, { "name": "content_method", "required": false, "validations": {}, "type": "select", "options": ["full", "inc", "dec"] }], "multiLine": true }] }
const amis = {
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
                    "label": "ajax请求",
                    "type": "button",
                    "actionType": "ajax",
                    "api": "http://sammlung.bcc-bdbl.baidu.com:8010/operation/util/openresource?url=http%3A%2F%2Fmbd.baidu.com%2Fwebpage%3Ftype%3Dlive%26action%3Dliveshow%26live_type%3Dreview%26room_id%3D4097778274"
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
                },
                {
                    "type": "static-tpl",
                    "tpl": "生成的id为：${key}"
                },
                {
                    "label": "端内类型：",
                    "type": "select",
                    "name": "na_type",
                    "source": {
                        "method": "get",
                        "url": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/level2?a=2"
                    }
                },
                {
                    "type": "datetime",
                    "name": "datetime",
                    "label": "日期时间"
                },
                {
                    "type": "datetime-range",
                    "name": "datetimerange",
                    "label": "日期时间范围"
                },
                {
                    "type": "month",
                    "name": "month",
                    "label": "月份"
                },
                {
                    "type": "month-range",
                    "name": "mr",
                    "label": "月份范围"
                }
            ],
            "multiLine": true
        }
    ]
};

const res = amis2JsonSchema(amis);

console.log(JSON.stringify(res));