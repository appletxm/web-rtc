module.exports = {
    "presets": [
      ["@babel/preset-env"
        // {
        //   "useBuiltIns": "usage",
        //   "corejs": 3
        // }
      ]
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime",
        {
          "modules": false,
          "corejs": 3,
          "proposals": true
        }
      ],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-object-rest-spread", { "legacy": true }]
    ],
    "env": {
      "test": {},
      "development": {},
      "mock": {}
    }
}
