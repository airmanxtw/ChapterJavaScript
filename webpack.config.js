const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'main.0.0.1.js',
        path:'C:/Users/airmanx/source/repos/Chapter/Chapter/Scripts/dist'
        //path: path.resolve(__dirname, 'dist')

    },
    mode: 'development',
    //mode:'production',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,                
                loader: 'babel-loader'                
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                'style-loader',
                'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                  'style-loader',
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    // Requires sass-loader@^7.0.0
                    options: {
                      implementation: require('sass'),
                      indentedSyntax: true // optional
                    },
                    // Requires sass-loader@^8.0.0
                    options: {
                      implementation: require('sass'),
                      sassOptions: {
                        indentedSyntax: true // optional
                      },
                    },
                  },
                ],
            },

        ]
    },
    plugins: [        
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(), 
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,        
            contextRegExp: /moment$/,        
        }),           
    ],
    resolve: { 
        extensions: ['.js', '.vue'],
        alias: { 
        'vue': 'vue/dist/vue.js' 
        } 
    }
};