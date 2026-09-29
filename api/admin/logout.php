<?php
require __DIR__ . '/../bootstrap.php';

unset($_SESSION['is_admin']);

respond(['ok' => true]);
