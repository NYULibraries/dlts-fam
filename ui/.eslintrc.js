module.exports = {
    root          : true,
    env           : {
        node : true
    },
    extends       : [
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/base.js
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/essential.js
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/strongly-recommended.js
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/recommended.js
        'plugin:vue/recommended',
        '@vue/standard'
    ],
    parserOptions : {
        parser : 'babel-eslint'
    },
    rules         : {
        'no-console'  : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger' : process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    overrides     : [
        {
            files : [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env   : {
                jest : true
            }
        }
    ]
}
