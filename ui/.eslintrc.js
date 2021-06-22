module.exports = {
    root          : true,
    env           : {
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/base.js
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
        // https://github.com/vuejs/eslint-plugin-vue/blob/800182c70fa20df858a46f949313f80e03a0f2ac/lib/configs/base.js
        parser : 'babel-eslint'
    },
    rules         : {
        // Haven't reviewed all the rules for vue/recommended.  It could be some
        // of these rules are redundant and don't need to be explicitly set here.
        'array-bracket-spacing'                   : [ 'error', 'always' ],
        'comma-dangle'                            : [ 'error', 'always-multiline' ],
        'computed-property-spacing'               : [ 'error', 'always' ],
        // allow async-await
        'generator-star-spacing'                  : 'off',
        indent                                  : [ 'warn', 4 ],
        'key-spacing'                             : [
            'error',
            {
                beforeColon : true,
                afterColon  : true,
                mode        : 'minimum',
                align       : {
                    beforeColon : true,
                    afterColon  : true,
                    on          : 'colon',
                    mode        : 'minimum',
                },
            },
        ],
        'keyword-spacing'                         : [
            'error',
            {
                overrides : {
                    catch : { after : false },
                },
            },
        ],
        'no-console'                              : process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow debugger during development
        'no-debugger'                             : process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-multi-spaces'                         : 'off',
        // https://github.com/babel/babel-eslint/issues/517
        'no-use-before-define'                    : 'off',
        'one-var'                                 : [ 'error', { var : 'always' } ],
        // Always terminate statements with semi-colons
        semi                                    : [ 'error', 'always' ],
        'space-before-function-paren'             : [
            'error',
            {
                anonymous  : 'always',
                named      : 'never',
                asyncArrow : 'always',
            },
        ],
        'space-in-parens'                         : [ 'error', 'always' ],
        'space-unary-ops'                         : [
            'error',
            {
                words     : true,
                nonwords  : false,
                overrides : {
                    '!' : true,
                },
            },
        ],
        'template-curly-spacing'                  : [ 'error', 'always' ],
        'standard/computed-property-even-spacing' : [ 'error', 'always' ],
        'vue/attributes-order'                    : 'error',
        'vue/html-end-tags'                       : 'error',
        'vue/html-indent'                         : [
            'error', 4, {
                attribute                 : 1,
                closeBracket              : 0,
                alignAttributesVertically : true,
                ignores                   : [],
            },
        ],
        'vue/html-self-closing'                   : [
            'error', {
                html : {
                    void      : 'never',
                    normal    : 'never',
                    component : 'always',
                },
                svg  : 'always',
                math : 'always',
            },
        ],
        'vue/html-quotes'                         : 'error',
        'vue/max-attributes-per-line'             : 'error',
        'vue/mustache-interpolation-spacing'      : 'error',
        'vue/name-property-casing'                : 'error',
        'vue/no-v-html'                           : 'off',
        'vue/require-default-prop'                : 'error',
        'vue/require-prop-types'                  : 'error',
        'vue/v-bind-style'                        : 'error',
        'vue/v-on-style'                          : 'error',
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
