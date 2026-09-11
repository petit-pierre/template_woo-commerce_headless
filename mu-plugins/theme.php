<?php

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/theme-settings', [
        'methods'             => 'GET',
        'callback'            => function () {
            return rest_ensure_response(wp_get_global_settings());
        },
        'permission_callback' => '__return_true',
    ]);
});
