<?php
declare(strict_types=1);

/***********************************************************************************************************************
 * bootstrap.php
 * ---------------------------------------------------------------------------------------------------------------------
 * A common configuration and initialization file for all included Plugin scripts.
 *
 * @author      Ryan Spaeth <rspaeth@mvqn.net>
 * @copyright   2019 Spaeth Technologies, Inc.
 */

//#region Request Manipulation

/* *********************************************************************************************************************
 * NOTES:
 * - This fixes the issues with the new vue-router mangling the request with the query string.
 * - We also drop ALL query params that may be incoming for the SPA, as they are irrelevant at this point!
 * - Only web requests will be handled here, as this section will be skipped when inclusion occurs by a CLI script.
 *
 * EXAMPLES:
 *   .../public.php?                => .../public.php
 *   .../public.php?/               => .../public.php
 *   .../public.php?/index.html     => .../public.php
 *   .../public.php?/index.html&... => .../public.php
 */
if (isset($_SERVER) && isset($_SERVER["REQUEST_URI"]))
{
    // Get the Plugin's name and base "production" URL.
    $pluginName = json_decode(file_get_contents(__DIR__ . "/../manifest.json"), true)["information"]["name"];
    $pluginBase = "/_plugins/${pluginName}/";

    // Strip the Plugin's base from the URI, so we have the actual request URI.
    $uri = preg_replace("#(/crm)?${pluginBase}#", "/", $_SERVER["REQUEST_URI"]);

    // NOTE: Here we only remove the base from the URI for examination, not from the actual request!

    // IF the request is any partial variation of the front-controller's root route...
    if ($uri === "/public.php?" ||
        $uri === "/public.php?/" ||
        $uri === "/public.php?/index.html" ||
        strpos($uri, "/public.php?/index.html") !== false)
    {
        // ...THEN we need to "clean" the URI, unset any query parameters...
        $uri = $_SERVER["REQUEST_URI"] = "/public.php";
        unset($_SERVER["QUERY_STRING"]);

        // ...AND redirect to the root route!
        header("Location: public.php");
        exit();
    }

    // NOW, we can let the front-controller handle the request directly...
}

//#endregion

//#region Autoloader & Aliases

require_once __DIR__ . "/vendor/autoload.php";

use MVQN\Localization\Translator;
use MVQN\Localization\Exceptions\TranslatorException;
use MVQN\REST\RestClient;
use MVQN\Twig\Extensions\SwitchExtension;

use UCRM\Common\Config;
use UCRM\Common\Log;
use UCRM\Common\Plugin;
use UCRM\HTTP\Twig\Extensions\PluginExtension;
use UCRM\HTTP\Slim\Middleware\QueryStringRouter;
use UCRM\HTTP\Slim\Middleware\PluginAuthentication;
use UCRM\Sessions\SessionUser;

use Slim\Container;
use Slim\Router;
use Slim\Http\Environment;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\Uri;
use Slim\Views\TwigExtension;

use App\Settings;

//#endregion

//#region Initialization

// Initialize the Plugin SDK using this directory as the plugin root and passing along any desired options.
/** @noinspection PhpUnhandledExceptionInspection */
Plugin::initialize(__DIR__ . "/../", [
    "modules" => [
        //Plugin::MODULE_HTTP, // Forces necessary configuration for the HTTP module.
        //Plugin::MODULE_SMTP, // Forces necessary configuration for the SMTP module.
        //Plugin::MODULE_REST, // Forces necessary configuration for the REST module.
    ]
]);

// Regenerate the Settings class, in case there are changes in the "manifest.json" file since the last script execution.
/** @noinspection PhpUnhandledExceptionInspection */
Plugin::createSettings("App", "Settings", __DIR__);

//#endregion

//#region Environment

// TODO: Move this into Plugin::initialize() ???

// IF an .env file exists in the project, THEN load it!
if(file_exists(__DIR__."/../.env"))
    (new \Dotenv\Dotenv(__DIR__."/../"))->load();

//#endregion

//#region REST Client

// TODO: Move this into Plugin::initialize() ???

// Generate the REST API URL from either an ENV variable (including from .env file), or fallback to localhost.
$restUrl =
    rtrim(
        getenv("HOST_URL") ?:                                                           // .env (or ENV variable)
        Settings::UCRM_LOCAL_URL ?:                                                     // ucrm.json
        (isset($_SERVER['HTTPS']) ? "https://localhost/" : "http://localhost/"),        // By initial request
    "/")."/api/v1.0";

// Configure the REST Client...
/** @noinspection PhpUnhandledExceptionInspection */
RestClient::setBaseUrl($restUrl);
RestClient::setHeaders([
    "Content-Type: application/json",
    "X-Auth-App-Key: " . Settings::PLUGIN_APP_KEY
]);

// Attempt to test the connection to the UCRM's REST API...
try
{
    // Get the Version from the REST API and log the information to the Plugin's logs.
    Log::info("Using REST URL:\n    '".$restUrl."'");
    $version = \UCRM\REST\Endpoints\Version::get();
    Log::info("REST API Test : '".$version."'");
}
catch(\Exception $e)
{
    // We should have resolved all existing conditions that previously prevented successful connections!
    /** @noinspection PhpUnhandledExceptionInspection */
    Log::error($e->getMessage());
}

//#endregion

//#region Localization

// TODO: Move this into Plugin::initialize() ???

// Attempt to set the dictionary directory and "default" locale...
try
{
    Translator::setDictionaryDirectory(__DIR__ . "/translations/");
    /** @noinspection PhpUnhandledExceptionInspection */
    Translator::setCurrentLocale(str_replace("_", "-", Config::getLanguage()) ?: "en-US", true);
}
catch (TranslatorException $e)
{
    // TODO: Determine if we should simply fallback to "en-US" in the case of failure.
    Log::http("No dictionary could be found!");
}

//#endregion

//#region Routing & Dependency Injection (Slim)

// Create Slim Framework Application, given the provided settings.
$app = new \Slim\App([
    "settings" => [
        "displayErrorDetails" => true,
        "addContentLengthHeader" => false,
        "determineRouteBeforeAppMiddleware" => true,
    ],
]);

// Get a reference to the DI Container included with the Slim Framework.
$container = $app->getContainer();

//#endregion

//#region Templating & Rendering (Twig)

// Configure the Slim/Twig Renderer...
$container["twig"] = function (Container $container)
{
    // Create a new instance of the Twig template renderer and configure the default options...
    $twig = new \Slim\Views\Twig(
        [
            __DIR__ . "/App/Views/",
        ],
        [
            //'cache' => 'path/to/cache'
            "debug" => true,
        ]
    );

    // Get the current Slim Router and initialize some defaults from the Environment.
    /** @var Router $router */
    $router = $container->get("router");
    $uri = Uri::createFromEnvironment(new Environment($_SERVER));

    // Now add the standard TwigExtension to the specialized Slim/Twig view system.
    $twig->addExtension(new TwigExtension($router, $uri));

    // TODO: Determine if there is a replacement to this deprecated extension!
    /** @noinspection PhpDeprecationInspection */
    $twig->addExtension(new Twig_Extension_Debug());

    // Add our custom SwitchExtension for using {% switch/case/default %} tokens in the Twig templates.
    $twig->addExtension(new SwitchExtension());

    // Add our custom PluginExtension for using some Plugin-specific globals, functions and filters.
    $twig->addExtension(new PluginExtension(Settings::class));

    // Finally, return the newly configured Slim/Twig Renderer.
    return $twig;
};

// Override the default 404 page...
$container['notFoundHandler'] = function (Container $container)
{
    return function(Request $request, Response $response) use ($container): Response
    {
        // Get the current Slim Router.
        /** @var Router $router */
        $router = $container->get("router");

        // Setup some debugging information to pass along to the template...
        $data = [
            "vRoute" => $request->getAttribute("vRoute"),
            "router" => $router,
        ];

        // Finally, render our custom 404 page!
        /** @noinspection PhpUndefinedFieldInspection */
        return $container->twig->render($response,"404.html.twig", $data);
    };
};

//#endregion

//#region Middleware (Slim)

// NOTE: Middleware is handled in ascending order, starting with the last middleware added!

// Add context information here for use by the Logging system for ALL requests...
$app->add(function (Request $request, Response $response, $next) use ($app) {
    Log::debug(
        $request->getAttribute("vRoute"), Log::HTTP, [
        "route" => $request->getAttribute("vRoute"),
        "query" => $request->getAttribute("vQuery"),
        "user"  => $request->getAttribute("sessionUser"),
    ]);
    return $next($request, $response);
});

$allowedGroups = [ "Admin Group" ];

if(file_exists(__DIR__ . "/../data/permissions.json"))
{
    $json = json_decode(file_get_contents(__DIR__ . "/../data/permissions.json"), true);

    if(json_last_error() === JSON_ERROR_NONE)
    {
        $allowedGroups = $json["groups"];
    }
}

// Handle Plugin-wide Authentication using our custom PluginAuthentication middleware...
$app->add(new PluginAuthentication($container,
    function(SessionUser $user) use ($allowedGroups)
    {
        // NOTE: Apply your own logic here and return TRUE/FALSE to authenticate successfully/unsuccessfully!
        return in_array(
            $user->getUserGroup(),
            $allowedGroups
            /*
            [
                "Admin Group",
            ]
            */
        );
    }
));

// Use our custom QueryStringRouter middleware to route our Plugin URLs, setting the default URL...
$app->add(new QueryStringRouter("/../index.html"));

/**
 * WARNING: The above QueryStringRouter middleware bypasses the current restrictions that UCRM places on Plugins with
 * multiple pages and should be used at he developer's discretion!
 *
 * The QueryStringRouter handles URLs as follows:
 * - The Plugin's 'public.php' script acts as a front-controller that parses the query-string for the requested URL.
 *
 *
 * EXAMPLE URLs:
 * - /public.php                                            => Loads the default route, as configured above.
 * - /public.php?/                                          => Same as the previous.
 * - /public.php?/index.html                                => Same as the previous, fully qualified URL.
 * - /public.php?/index.html&param1=1&param2=two            => Same as the previous, including some GET parameters.
 *
 * - /public.php?[route][&param=value...]                   => All other suffixes are handled by Slim Framework routes.
 *
 * - /public.php?/#/                                        => Our VueJS 'index.html' page and using vue-router syntax.
 *
 *
 * Visit https://github.com/mvqn/ucrm-plugin-sdk for additional information on my extended UCRM SDK.
 */

//#endregion
