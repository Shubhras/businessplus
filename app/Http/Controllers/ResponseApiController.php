<?php

namespace App\Http\Controllers;

use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Response;
use \Illuminate\Http\Response as Res;
use Validator;

/**
 * Class ApiController
 * @package App\Modules\Api\Lesson\Controllers
 */
class ResponseApiController extends SwaggerController
{
    protected $responseCode = 200;
    protected $apiResponse = array(
        'status_code' => 200,
        'message' => [],
    );
    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->beforeFilter('auth', ['on' => 'post']);
    }
    /**
     * @var int
     */

    protected $statusCode = Res::HTTP_OK;
    /**
     * @return mixed
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }
    protected function sendResponse()
    {
        //echo gettype($this->apiResponse['message']);die;
        if (gettype($this->apiResponse['message']) == 'string') {
            $this->apiResponse['message'] = $this->apiResponse['message'];
        }
        //        print_r($this->apiResponse);die;
        //        array_walk_recursive($this->apiResponse, function (&$item, $key) {
        //            $item = null === $item ? '' : $item;
        //        });
        $this->apiResponse['status_code'] = $this->responseCode;
        return response()
            ->json($this->apiResponse, $this->responseCode)
            ->header('X-Powered-By', 'Digiprima')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Content-Type-Options', 'nosniff')
            ->header('Content-type', 'application/json,text/json, text/xml,text/html,application/xml, text/plain')
            ->header('Access-Control-Allow-Headers', 'Access-Control-Request-Method,Access-Control-Request-Headers,User-Agent,Origin,Referer,Access-Control-Allow-Origin, Content-Type, x-xsrf-token, text/html, text/html; charset=UTF-8, x_csrftoken, text/plain, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding, host, Accept-Language,Connection,')
            ->header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    }

    protected function sendResponse2()
    {
        //echo gettype($this->apiResponse['message']);die;
        if (gettype($this->apiResponse['message']) == 'string') {
            $this->apiResponse['message'] = $this->apiResponse['message'];
        }
        //        print_r($this->apiResponse);die;
        //        array_walk_recursive($this->apiResponse, function (&$item, $key) {
        //            $item = null === $item ? '' : $item;
        //        });
        $this->apiResponse['status_code'] = 300;
        return response()
            ->json($this->apiResponse, $this->responseCode)
            ->header('X-Powered-By', 'Digiprima')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Content-Type-Options', 'nosniff')
            ->header('Content-type', 'application/json,text/json, text/xml,text/html,application/xml, text/plain')
            ->header('Access-Control-Allow-Headers', 'Access-Control-Request-Method,Access-Control-Request-Headers,User-Agent,Origin,Referer,Access-Control-Allow-Origin, Content-Type, x-xsrf-token, text/html, text/html; charset=UTF-8, x_csrftoken, text/plain, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding, host, Accept-Language,Connection,')
            ->header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    }
    /**
     * @param $message
     * @return json response
     */
    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function respondCreated($message, $data = null)
    {
        return $this->respond([
            'status' => 'success',
            'status_code' => Res::HTTP_CREATED,
            'message' => $message,
            'data' => $data
        ]);
    }

    /**
     * @param Paginator $paginate
     * @param $data
     * @return mixed
     */
    protected function respondWithPagination(Paginator $paginate, $data, $message)
    {
        $data = array_merge($data, [
            'paginator' => [
                'total_count'  => $paginate->total(),
                'total_pages' => ceil($paginate->total() / $paginate->perPage()),
                'current_page' => $paginate->currentPage(),
                'limit' => $paginate->perPage(),
            ]
        ]);
        return $this->respond([
            'status' => 'success',
            'status_code' => Res::HTTP_OK,
            'message' => $message,
            'data' => $data
        ]);
    }

    public function respondNotFound($message = 'Not Found!')
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_NOT_FOUND,
            'message' => $message,
        ]);
    }


    public function respond_dept_name_unique($message = 'Department name is already exist!')
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_NOT_FOUND,
            'message' => $message,
        ]);
    }
    public function respond_uom_name_unique($message = 'UOM is already exist!')
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_NOT_FOUND,
            'message' => $message,
        ]);
    }
    
    public function respondInternalError($message)
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_INTERNAL_SERVER_ERROR,
            'message' => $message,
        ]);
    }
    public function respondValidationError($message, $errors)
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_UNPROCESSABLE_ENTITY,
            'message' => $message,
            'data' => $errors
        ]);
    }
    public function respond($data, $headers = [])
    {
        return Response::json($data, $this->getStatusCode(), $headers)->header('X-Powered-By', 'Digiprima')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Content-type', 'application/json, text/html, text/plain')
            ->header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, x-xsrf-token, text/html, x_csrftoken')
            ->header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');;
    }
    public function respondWithError($message)
    {
        return $this->respond([
            'status' => 'error',
            'status_code' => Res::HTTP_UNAUTHORIZED,
            'message' => $message,
        ]);
    }

    public function checkValidation($AllRequestParam, $rules)
    {

        $validator = Validator::make($AllRequestParam, $rules);
        if ($validator->fails()) {
            $message = $validator->errors()->all();
            return $message;
        } else {
            return false;
        }
    }
}
