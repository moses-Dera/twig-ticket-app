<?php
require_once __DIR__ . '/../vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false,
]);

// Basic router based on REQUEST_URI
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove trailing slashes (except root)
if ($path !== '/' && substr($path, -1) === '/') {
    header("Location: " . rtrim($path, '/'));
    exit;
}

switch ($path) {
    case '/':
        echo $twig->render('landing.twig');
        break;
    case '/auth/login':
        echo $twig->render('auth/login.twig');
        break;
    case '/auth/signup':
        echo $twig->render('auth/signup.twig');
        break;
    case '/dashboard':
        echo $twig->render('dashboard.twig');
        break;
    case '/tickets':
        echo $twig->render('tickets.twig');
        break;
    default:
        // 404 -> fall back to landing
        http_response_code(404);
        echo $twig->render('landing.twig', ['notFound' => true]);
        break;
}
