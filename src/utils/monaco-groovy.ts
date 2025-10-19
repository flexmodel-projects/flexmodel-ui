// Groovy语言配置 for Monaco Editor
export const groovyLanguageConfig = {
  id: 'groovy',
  extensions: ['.groovy', '.gvy', '.gy', '.gsh'],
  aliases: ['Groovy', 'groovy'],
  mimetypes: ['text/x-groovy-source', 'text/x-groovy'],
};

export const groovyMonarchTokensProvider = {
  defaultToken: '',
  tokenPostfix: '.groovy',

  keywords: [
    // 基本关键字
    'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'def', 'default', 'do', 'else', 'enum', 'extends', 'final', 'finally',
    'for', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'interface',
    'native', 'new', 'package', 'private', 'protected', 'public', 'return',
    'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw',
    'throws', 'transient', 'try', 'void', 'volatile', 'while',
    
    // Groovy特有关键字
    'as', 'trait', 'in', 'it', 'delegate', 'owner', 'thisObject',
    
    // 类型关键字
    'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short',
    'String', 'Object', 'List', 'Map', 'Set', 'Closure', 'Range',
    
    // 布尔值
    'true', 'false', 'null'
  ],

  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%=', '<<=', '>>=', '>>>=', '?.', '?[', '?(',
    '<=>', '===', '!==', '=~', '==~'
  ],

  symbols: /[=><!~?:&|+\-*/^%]+/,

  tokenizer: {
    root: [
      // 标识符和关键字
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],

      // 数字
      [/\d*\.\d+([eE][-+]?\d+)?[fFdD]?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+[Ll]?/, 'number.hex'],
      [/0[0-7]+[Ll]?/, 'number.octal'],
      [/\d+[Ll]?/, 'number'],

      // 字符串
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // 非终止字符串
      [/"/, 'string', '@string_double'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],   // 非终止字符串
      [/'/, 'string', '@string_single'],

      // 多行字符串
      [/"""/, 'string', '@string_triple_double'],
      [/'''/, 'string', '@string_triple_single'],

      // 注释
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],

      // 正则表达式
      [/\/[^/*]/, 'regexp', '@regexp'],

      // 操作符
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],

      // 分隔符
      [/[{}()[\]\\]/, '@brackets'],
      [/[;,.]/, 'delimiter'],

      // 空白字符
      [/\s+/, 'white']
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'/, 'string', '@pop']
    ],

    string_triple_double: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"""/, 'string', '@pop']
    ],

    string_triple_single: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'''/, 'string', '@pop']
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],

    regexp: [
      [/[^\\/\n]+/, 'regexp'],
      [/\\./, 'regexp.escape'],
      [/\/[gimuy]*/, 'regexp', '@pop']
    ]
  }
};

export const groovyCompletionProvider = {
  provideCompletionItems: () => {
    const suggestions = [
      // 基本关键字
      {
        label: 'class',
        kind: 5, // Keyword
        insertText: 'class ${1:ClassName} {\n    ${2}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '定义类',
        sortText: '01'
      },
      {
        label: 'interface',
        kind: 5, // Keyword
        insertText: 'interface ${1:InterfaceName} {\n    ${2}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '定义接口',
        sortText: '02'
      },
      {
        label: 'trait',
        kind: 5, // Keyword
        insertText: 'trait ${1:TraitName} {\n    ${2}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '定义特征',
        sortText: '03'
      },
      {
        label: 'def',
        kind: 5, // Keyword
        insertText: 'def ${1:variableName} = ${2:value}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '定义变量',
        sortText: '04'
      },
      {
        label: 'if',
        kind: 5, // Keyword
        insertText: 'if (${1:condition}) {\n    ${2}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '条件语句',
        sortText: '05'
      },
      {
        label: 'for',
        kind: 5, // Keyword
        insertText: 'for (${1:item} in ${2:collection}) {\n    ${3}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '循环语句',
        sortText: '06'
      },
      {
        label: 'while',
        kind: 5, // Keyword
        insertText: 'while (${1:condition}) {\n    ${2}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: 'while循环',
        sortText: '07'
      },
      {
        label: 'try',
        kind: 5, // Keyword
        insertText: 'try {\n    ${1}\n} catch (${2:Exception} ${3:e}) {\n    ${4}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '异常处理',
        sortText: '08'
      },
      {
        label: 'switch',
        kind: 5, // Keyword
        insertText: 'switch (${1:value}) {\n    case ${2:case1}:\n        ${3}\n        break\n    default:\n        ${4}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: 'switch语句',
        sortText: '09'
      },
      {
        label: 'return',
        kind: 5, // Keyword
        insertText: 'return ${1:value}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '返回值',
        sortText: '10'
      },

      // 常用方法
      {
        label: 'println',
        kind: 3, // Function
        insertText: 'println(${1:message})',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '打印输出',
        sortText: '11'
      },
      {
        label: 'print',
        kind: 3, // Function
        insertText: 'print(${1:message})',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '打印输出（不换行）',
        sortText: '12'
      },

      // 集合操作
      {
        label: 'List',
        kind: 7, // Class
        insertText: 'List<${1:Type}> ${2:listName} = []',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '创建列表',
        sortText: '13'
      },
      {
        label: 'Map',
        kind: 7, // Class
        insertText: 'Map<${1:KeyType}, ${2:ValueType}> ${3:mapName} = [:]',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '创建映射',
        sortText: '14'
      },
      {
        label: 'Set',
        kind: 7, // Class
        insertText: 'Set<${1:Type}> ${2:setName} = [] as Set',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '创建集合',
        sortText: '15'
      },

      // 闭包
      {
        label: 'Closure',
        kind: 7, // Class
        insertText: 'Closure ${1:closureName} = { ${2:params} ->\n    ${3}\n}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '创建闭包',
        sortText: '16'
      },

      // 范围
      {
        label: 'Range',
        kind: 7, // Class
        insertText: '${1:start}..${2:end}',
        insertTextRules: 4, // InsertAsSnippet
        documentation: '创建范围',
        sortText: '17'
      }
    ];

    return { suggestions };
  }
};

// 注册Groovy语言到Monaco Editor
export const registerGroovyLanguage = (monaco: any) => {
  // 注册语言
  monaco.languages.register(groovyLanguageConfig);
  
  // 设置语法高亮
  monaco.languages.setMonarchTokensProvider('groovy', groovyMonarchTokensProvider);
  
  // 设置代码补全
  monaco.languages.registerCompletionItemProvider('groovy', groovyCompletionProvider);
};
