<?php

$frontend_url = FRONTEND_URL;

/**
 * Plugin Name: L'Araignee - Headless Bridge & Mail Config
 * Description: Centralise l'identité des e-mails, les redirections front-end et l'API de réinitialisation de mot de passe.
 */

// ==========================================
// 2. REDIRECTIONS DES LIENS WOOCOMMERCE
// ==========================================

// Rediriger le lien de visualisation d'une commande (dans les e-mails et les comptes)
add_filter('woocommerce_get_view_order_url', function ($url, $order) use ($frontend_url) {

    return sprintf('%s/profile', $frontend_url);
}, 10, 2);

// Rediriger le lien global de la page "Mon compte"
add_filter('woocommerce_get_my_account_url', function ($url) use ($frontend_url) {
    return $frontend_url . '/profile';
});

// 2. Intercepter également le permalien brut de la page WooCommerce "myaccount" si elle est appelée directement
add_filter('page_link', function ($url, $post_id) use ($frontend_url) {
    // Récupère l'ID de la page "Mon compte" configurée dans WooCommerce
    $myaccount_page_id = wc_get_page_id('myaccount');

    if ($post_id == $myaccount_page_id) {
        return $frontend_url . '/profile';
    }

    return $url;
}, 10, 2);


// ==========================================
// 3. IDENTITÉ DES E-MAILS (WP_MAIL)
// ==========================================

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


// ==========================================
// 4. ROUTES REST API (MOT DE PASSE)
// ==========================================

add_action('rest_api_init', function () use ($frontend_url) {

    // Route de demande de réinitialisation
    register_rest_route('custom/v1', '/reset-password', [
        'methods'             => 'POST',
        'callback'            => function ($request) use ($frontend_url) {
            return headless_reset_password($request, $frontend_url);
        },
        'permission_callback' => '__return_true',
    ]);

    // Route de validation du nouveau mot de passe
    register_rest_route('custom/v1', '/new-password', [
        'methods'             => 'POST',
        'callback'            => 'headless_new_password',
        'permission_callback' => '__return_true',
    ]);
});

function headless_reset_rate_limit_check()
{
    $ip  = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $key = 'reset_pwd_ip_' . md5($ip);

    $attempts = (int) get_transient($key);

    // Limite à 3 demandes maximum par fenêtre de 15 minutes par IP
    if ($attempts >= 3) {
        return false;
    }

    set_transient($key, $attempts + 1, 15 * MINUTE_IN_SECONDS);
    return true;
}

function headless_reset_password($request, $frontend_url)
{

    if (!headless_reset_rate_limit_check()) {
        return new WP_Error(
            'too_many_requests',
            'Trop de demandes de réinitialisation effectuées depuis cette adresse. Veuillez patienter 15 minutes.',
            ['status' => 429]
        );
    }

    $email = sanitize_email($request->get_param('email'));

    if (empty($email)) {
        return new WP_Error('missing_email', 'Email requis.', ['status' => 400]);
    }

    $user = get_user_by('email', $email);

    if (!$user) {
        return new WP_Error('user_not_found', 'Aucun compte trouvé avec cet email.', ['status' => 404]);
    }

    $key = get_password_reset_key($user);

    if (is_wp_error($key)) {
        return new WP_Error('key_error', 'Erreur lors de la génération du lien.', ['status' => 500]);
    }

    $reset_link = esc_url_raw("{$frontend_url}/new-password?login=" . rawurlencode($user->user_login) . "&key=" . rawurlencode($key));

    $lost_password_endpoint = get_option(
        'woocommerce_myaccount_lost_password_endpoint',
        'lost-password'
    );

    $reset_url_filter = function ($url, $endpoint) use ($lost_password_endpoint, $reset_link) {
        if ($endpoint === $lost_password_endpoint) {
            return $reset_link;
        }

        return $url;
    };

    add_filter('woocommerce_get_endpoint_url', $reset_url_filter, 99, 2);

    try {
        $mailer = function_exists('WC') ? WC()->mailer() : null;
        $emails = $mailer ? $mailer->get_emails() : [];
        $reset_email = $emails['WC_Email_Customer_Reset_Password'] ?? null;

        if ($reset_email) {
            $reset_email->trigger($user->user_login, $key);
        } else {
            error_log("L'e-mail WooCommerce « Réinitialisation du mot de passe » est indisponible.");
        }
    } finally {
        remove_filter('woocommerce_get_endpoint_url', $reset_url_filter, 99);
    }


    return rest_ensure_response(['message' => 'Email de réinitialisation envoyé.']);
}

function headless_new_password($request)
{
    $key      = $request->get_param('key');
    $login    = $request->get_param('login');
    $password = $request->get_param('password');

    if (empty($key) || empty($login) || empty($password)) {
        return new WP_Error('missing_fields', 'Tous les champs sont requis.', ['status' => 400]);
    }

    $user = check_password_reset_key($key, $login);

    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', 'Lien invalide ou expiré.', ['status' => 400]);
    }

    reset_password($user, $password);

    return rest_ensure_response(['message' => 'Mot de passe modifié avec succès.']);
}
