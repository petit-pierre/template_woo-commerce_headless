<?php
add_filter('rest_index', function ($response) {
    $data = $response->get_data();
    $data['store_email'] = get_option('woocommerce_email_from_address');
    $data['store_name']  = get_option('woocommerce_email_from_name');
    $response->set_data($data);
    return $response;
});

add_filter('wp_mail_from', function ($original_email) {
    $wc_email = get_option('woocommerce_email_from_address');
    return !empty($wc_email) ? $wc_email : $original_email;
});

add_filter('wp_mail_from_name', function ($original_name) {
    $wc_name = get_option('woocommerce_email_from_name');

    return !empty($wc_name) ? $wc_name : get_bloginfo('name');
});
