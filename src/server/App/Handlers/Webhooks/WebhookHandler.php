<?php
declare(strict_types=1);

namespace App\Handlers\Webhooks;


final class WebhookHandler
{
    private $data = [];

    /**
     * Constructor.
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }


    public function test()
    {
        //var_dump($_SERVER);

        //echo file_get_contents("${_SERVER['REQUEST_SCHEME']}://${_SERVER['HTTP_HOST']}${_SERVER['REQUEST_URI']}?/example");

        //header("Location: ${_SERVER['REQUEST_SCHEME']}://${_SERVER['HTTP_HOST']}${_SERVER['REQUEST_URI']}?/example");

        echo "Success from handler!";

        //var_dump($this->data);
    }



}
