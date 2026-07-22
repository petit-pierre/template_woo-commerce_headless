<?php
/*
Plugin Name: Custom Headless Stripe Checkout
Description: Route custom API pour créer une session Stripe Checkout
*/

use Stripe\Stripe;
use Stripe\Checkout\Session;

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/create-stripe-session', [
        'methods'             => 'POST',
        'callback'            => 'custom_headless_stripe_session',
        'permission_callback' => function () {
            return is_user_logged_in(); // Requiert le Token JWT
        },
    ]);
});

function custom_headless_stripe_session($request)
{
    $user_id = get_current_user_id();
    $params  = $request->get_json_params();

    // 🔑 Mets ta vraie clé secrète Stripe (sk_test_...)
    \Stripe\Stripe::setApiKey('sk_test_VOTRE_CLE_SECRETE_STRIPE');

    // 1. Création de la commande WooCommerce
    $order = wc_create_order(['customer_id' => $user_id]);

    if (!empty($params['items'])) {
        foreach ($params['items'] as $item) {
            $order->add_product(get_product($item['product_id']), $item['quantity']);
        }
    }

    if (!empty($params['shipping'])) {
        $order->set_address($params['shipping'], 'shipping');
        $order->set_address($params['shipping'], 'billing');
    }

    $order->calculate_totals();
    $order->save();

    $client_origin = $params['redirect_origin'] ?? 'http://localhost:5173';

    try {
        // 2. Création de la session chez Stripe
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency'     => strtolower($order->get_currency()),
                    'product_data' => [
                        'name' => 'Commande #' . $order->get_order_number(),
                    ],
                    'unit_amount'  => round($order->get_total() * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $client_origin . '/order-success?order_id=' . $order->get_id(),
            'cancel_url'  => $client_origin . '/cart',
            'metadata'    => [
                'order_id' => $order->get_id(),
            ],
        ]);

        return new WP_REST_Response([
            'success'      => true,
            'checkout_url' => $session->url,
        ], 200);
    } catch (Exception $e) {
        return new WP_Error('stripe_error', $e->getMessage(), ['status' => 500]);
    }
}
