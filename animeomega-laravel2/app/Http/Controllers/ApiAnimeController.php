<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ApiAnimeController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        // Cliente HTTP de Guzzle
        $client = new Client();
        $response = $client->request('GET', 'https://api.myanimelist.net/v2/anime', [
            'headers' => [
                'X-MAL-CLIENT-ID' => '1e50c2b459eab33fae40483098dbffc9'
            ],
            'query' => [
                'q' => $query,
                'limit' => 6
            ]
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        return response()->json($data);
    }
}
