<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;

use Illuminate\Foundation\Inspiring;
//use Illuminate\Support\Facades/DB;
use DB;

class Inspire extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'minute:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will clean db table';

    /**
     * Execute the console command.
     *
     */
    public function handle()
    {

        /* $client = new GuzzleHttp\Client();
        $request = $client->get('http://localhost/businessplus/public/index.php/api-view-poject-dashboard');
        $response = $request->getBody()->getContents();
        $cake = json_decode($response, true); */

        // $this->comment(PHP_EOL.Inspiring::quote().PHP_EOL);
    }
}
