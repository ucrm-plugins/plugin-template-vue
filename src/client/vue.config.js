

const path = require("path");
const fs = require("fs");

function pluginName()
{
    return path.basename(path.resolve(__dirname, "../../"));
}


function publicPath()
{
    switch(process.env.NODE_ENV)
    {
        case "production"   : return "/_plugins/" + pluginName() + "/public/";
        case "development"  : return "/public/";
        default             : return "/public/"; // NOTE: This would catch modes like "test"...
    }
}


module.exports = {

    publicPath: publicPath(),

    indexPath: "../index.html",
    //assetsDir: "../app/",
    outputDir: "../public/",


    chainWebpack: function(config)
    {
        config.plugin("html")
            .tap(args => {
                args[0].template = "index.html";
                return args;
            });
    },


    devServer: {

        host: "0.0.0.0",
        port: 3000,
        hot: true,
        disableHostCheck: true,
        //historyApiFallback: true,

        proxy: {

            // ---------------------------------------------------------------------------------------------------------
            // REMOTE ASSETS
            // ---------------------------------------------------------------------------------------------------------
            // Here we proxy requests for '/assets' and '/dist' to a valid UCRM server, so that we can use Ubiquiti's
            // built-in assets during development.  This includes fonts, icons, images, stylesheets, scripts and more.
            //
            // NOTE: Feel free to continue using my own UCRM development server for this purpose, or add your own!

            "/assets": {
                target: "https://ucrm.dev.mvqn.net/",
                changeOrigin: true
            },

            "/dist" : {
                target: "https://ucrm.dev.mvqn.net/",
                changeOrigin: true
            },

            // ---------------------------------------------------------------------------------------------------------
            // STATIC ASSETS
            // ---------------------------------------------------------------------------------------------------------
            // NOTE: These are only to make the development experience more consistent and user-friendly!

            // Rewrite all requests for "/public" to "/", so that the PHP Web Server does not also need to be running
            // alongside webpack-dev-server during development.  This will simulate the "/public" experience in the
            // UCRM front-end.

            /*
            "^/public$": {
                target: "http://localhost:3000/",
                changeOrigin: false,
                pathRewrite: {
                    "^/public$": "/public/"
                }
            },
            */






            // Proxy requests for the server-side front-controller from the Webpack Development Server to the PHP Web
            // Server as needed.  The PHP Web Server will need to be running, unless only the root "/public.php?/" URL
            // is requested.

            "/public.php": {
                target: "http://localhost:80/",
                changeOrigin: false,

                bypass: function(req, res, proxyOptions) {

                    // IF the requested URL is the server-side front-controller "/public.php?/"...
                    if(req.url === "/public.php?/")
                    // ...THEN serve the client-side "/index.html" as if it were served by the server.
                        return "/index.html";

                    // IF the requested URL is a variant of the server-side front-controller "/public.php[?]"...
                    if(req.url === "/public.php" || req.url === "/public.php?")
                    // ...THEN redirect to the "prettified" server-side "/public.php?/", then the above will match!
                        res.redirect("/public.php?/")

                    // OTHERWISE, proxy the specific request and let the server-side code handle it!
                },

            },




        }


    },

};
