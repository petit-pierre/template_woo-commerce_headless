<?php

$frontend_url = FRONTEND_URL;

add_filter('wp_sitemaps_posts_entry', function ($entry, $post, $post_type) use ($frontend_url) {
    if ('product' === $post_type) {
        $entry['loc'] = $frontend_url . '/' . $post->post_name . '/';
    }
    if ('post' === $post_type) {
        $entry['loc'] = $frontend_url . '/' . $post->post_name . '/';
    }

    return $entry;
}, 10, 3);
