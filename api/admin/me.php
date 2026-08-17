<?php
require __DIR__ . '/../bootstrap.php';

respond(['is_admin' => !empty($_SESSION['is_admin'])]);
