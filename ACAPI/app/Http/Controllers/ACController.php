<?php

namespace App\Http\Controllers;

use ActiveCollab\SDK\Authenticator;
use Dingo\Api\Http\Request;
use Dingo\Api\Http\Response\Format\Json;
use Dingo\Api\Routing\Helpers;

use App\Http\Requests;

use \ActiveCollab\SDK\Client as AcClient;
use \ActiveCollab\SDK\Authenticator\SelfHosted as AcAuth;
use \ActiveCollab\SDK\TokenInterface as AcToken;

class ACController extends Controller
{
    use Helpers;

    private $apiUrl;

    function ACRequest(Request $request)
    {
        $this->apiUrl = "http://ac.firefly.cc/";

        $authenticator = new AcAuth("Firefly Digital", "AC Web Timer", "august@fireflydigital.com", "&11Rebma", $this->apiUrl);

        $token = $authenticator->issueToken();

        if($token instanceof AcToken)
        {
            $client = new AcClient($token);

            $params = $request->all();
            $request_type = $params['request_type'];
            $call = $params['path_info'];
            unset($params['path_info'], $params['request_type']);

            $response = $client->$request_type($call, $params);

            print json_encode($response->getJson());
        }
    }
}
