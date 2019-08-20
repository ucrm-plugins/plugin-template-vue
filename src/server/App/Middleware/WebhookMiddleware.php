<?php
declare(strict_types=1);

namespace App\Middleware;


use Slim\App;
use Slim\Http\Request;
use Slim\Http\Response;
use UCRM\Common\Log;
use UCRM\Common\Plugin;
use UCRM\REST\Endpoints\WebhookEvent;
use UCRM\REST\Endpoints\Version;

define("ENTITY_WEBHOOK", "webhook");

class WebhookMiddleware
{
    private $app = null;

    public function __construct(App $app)
    {
        $this->app = $app;
    }

    public function __invoke(Request $request, Response $response, $next)
    {
        if($request->getMethod() === "POST" && $request->getUri()->getHost() === "localhost")
        {
            $body = $request->getParsedBody();

            if (array_key_exists("uuid",        $body) &&
                array_key_exists("changeType",  $body) &&
                array_key_exists("entity",      $body) &&
                array_key_exists("entityId",    $body) &&
                array_key_exists("eventName",   $body) &&
                array_key_exists("extraData",   $body))
            {
                $uuid = WebhookEvent::getByUuid($body["uuid"]);

                if($uuid->getUuid() === $body["uuid"])
                {
                    $entity = $body["entity"];
                    $eventName = $body["eventName"];

                    //$webhooksRoot = realpath(__DIR__ . "/../../webhooks/");
                    //$webhooksPath = realpath("$webhooksRoot/$entity/");
                    //$webhooksFile = realpath("$webhooksPath/$eventName.php");

                    $class = "App\\Handlers\\Webhooks\\". ucfirst($entity) . "Handler";

                    //if($webhooksRoot && $webhooksPath && $webhooksFile)
                    if(class_exists($class))
                    {
                        $object = new $class($body);

                        if(method_exists($object, $eventName))
                        {
                            $object->$eventName();
                            exit();
                        }

                    }

                    http_response_code(501);
                    die("A webhook handler for '$entity.$eventName' could not be found!");

                }

                http_response_code(400);
                die("The UUID of the received webhook event is invalid!");

            }

        }

        return $next($request, $response);
    }

}
