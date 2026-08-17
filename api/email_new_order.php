<?php
// Plantilla HTML del correo de "nuevo pedido". Devuelve HTML apto para
// clientes de correo (tablas + estilos en línea, sin CSS moderno).

function _mv_abs_url(string $path, string $siteUrl): string
{
    if ($path === '' || preg_match('#^https?://#i', $path)) {
        return $path;
    }
    return rtrim($siteUrl, '/') . '/' . ltrim($path, '/');
}

function _mv_e(?string $v): string
{
    return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
}

function _mv_money($v): string
{
    return '$' . number_format((float) $v, 0, '.', ',') . ' MXN';
}

function render_new_order_email(array $order, array $config): string
{
    $siteUrl = rtrim((string) ($config['site_url'] ?? ''), '/');
    $fecha = date('d/m/Y H:i');

    $dir = trim(
        ($order['street'] ?? '') . ' ' . ($order['ext_no'] ?? '')
        . (!empty($order['int_no']) ? ', Int. ' . $order['int_no'] : '')
    );
    $ciudad = implode(', ', array_filter([$order['city'] ?? '', $order['state'] ?? '']));

    // Filas de productos
    $itemsHtml = '';
    foreach ($order['items'] as $i) {
        $img = $siteUrl !== '' ? _mv_abs_url((string) ($i['product_image'] ?? ''), $siteUrl) : '';
        $imgTag = $img !== ''
            ? '<img src="' . _mv_e($img) . '" width="52" height="72" alt="" style="display:block;width:52px;height:72px;object-fit:cover;border-radius:8px;border:1px solid #e5e2dd;">'
            : '';
        $optionsLine = !empty($i['options_text'])
            ? '<br><span style="color:#8a6a3c;font-size:12px;">' . _mv_e($i['options_text']) . '</span>'
            : '';
        $itemsHtml .= '
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #efece7;" width="64">' . $imgTag . '</td>
          <td style="padding:10px 12px;border-bottom:1px solid #efece7;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2e3338;">
            <strong>' . _mv_e($i['product_name']) . '</strong>' . $optionsLine . '<br>
            <span style="color:#8a8f94;font-size:13px;">' . (int) $i['quantity'] . ' × ' . _mv_e(_mv_money($i['unit_price'])) . '</span>
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #efece7;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#2e3338;white-space:nowrap;">'
            . _mv_e(_mv_money($i['line_total'])) . '</td>
        </tr>';
    }

    $instalacion = !empty($order['needs_installation'])
        ? '<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Instalación</td>
             <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f7a3d;font-weight:bold;">✔ Requiere instalación en muro</td></tr>'
        : '<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Instalación</td>
             <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">No</td></tr>';

    $referencias = !empty($order['references_notes'])
        ? '<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;vertical-align:top;" width="110">Referencias</td>
             <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e($order['references_notes']) . '</td></tr>'
        : '';

    $instalacionFila = $order['installation_fee'] > 0
        ? '<tr><td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;">Instalación</td>
             <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e(_mv_money($order['installation_fee'])) . '</td></tr>'
        : '';

    $panelBtn = $siteUrl !== ''
        ? '<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:24px auto 0;">
             <tr><td bgcolor="#1e2124" style="border-radius:10px;">
               <a href="' . _mv_e($siteUrl . '/admin/pedidos') . '" target="_blank"
                  style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:0.04em;">
                  VER EN EL PANEL</a>
             </td></tr>
           </table>'
        : '';

    return '<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f3f1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f3f1">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Encabezado -->
        <tr><td align="center" style="padding-bottom:20px;">
          <span style="font-family:Georgia,serif;font-size:26px;color:#2e3338;letter-spacing:0.02em;">Lore District</span><br>
          <span style="display:inline-block;margin-top:8px;background:#f8eada;color:#8a6a3c;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.08em;padding:5px 14px;border-radius:999px;">NUEVO PEDIDO</span>
        </td></tr>

        <!-- Tarjeta principal -->
        <tr><td bgcolor="#ffffff" style="border-radius:16px;padding:28px;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;">
                <span style="font-size:20px;font-weight:bold;color:#2e3338;">Pedido #' . (int) $order['id'] . '</span><br>
                <span style="font-size:13px;color:#8a8f94;">' . _mv_e($fecha) . ' · Pago contra entrega</span>
              </td>
              <td align="right" style="font-family:Arial,Helvetica,sans-serif;">
                <span style="font-size:13px;color:#8a8f94;">Total a cobrar</span><br>
                <span style="font-size:24px;font-weight:bold;color:#2e3338;">' . _mv_e(_mv_money($order['total'])) . '</span>
              </td>
            </tr>
          </table>

          <hr style="border:none;border-top:1px solid #efece7;margin:20px 0;">

          <!-- Cliente -->
          <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.08em;color:#8a8f94;">CLIENTE</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Nombre</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;font-weight:bold;">' . _mv_e($order['customer_name']) . '</td></tr>
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Teléfono</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                  <a href="tel:' . _mv_e(preg_replace('/\s+/', '', (string) ($order['customer_phone'] ?? ''))) . '" style="color:#2e3338;text-decoration:none;font-weight:bold;">' . _mv_e($order['customer_phone'] ?? '—') . '</a></td></tr>
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Correo</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e($order['customer_email'] ?? '—') . '</td></tr>
          </table>

          <!-- Entrega -->
          <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.08em;color:#8a8f94;">ENTREGA</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;vertical-align:top;" width="110">Dirección</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;font-weight:bold;">' . _mv_e($dir) . '</td></tr>
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Alcaldía</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e($order['alcaldia'] ?? ($order['neighborhood'] ?? '—')) . '</td></tr>
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">Ciudad</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e($ciudad !== '' ? $ciudad : '—') . '</td></tr>
            <tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;" width="110">C.P.</td>
                <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e($order['postal_code'] ?? '—') . '</td></tr>
            ' . $referencias . '
            ' . $instalacion . '
          </table>

          <!-- Productos -->
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.08em;color:#8a8f94;">PRODUCTOS</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $itemsHtml . '</table>

          <!-- Totales -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
            <tr><td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;">Subtotal</td>
                <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e(_mv_money($order['subtotal'])) . '</td></tr>
            <tr><td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8f94;">Envío</td>
                <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2e3338;">' . _mv_e(_mv_money($order['shipping_fee'])) . '</td></tr>
            ' . $instalacionFila . '
            <tr><td style="padding:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#2e3338;">Total</td>
                <td align="right" style="padding:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#2e3338;">' . _mv_e(_mv_money($order['total'])) . '</td></tr>
          </table>

          ' . $panelBtn . '
        </td></tr>

        <!-- Pie -->
        <tr><td align="center" style="padding:20px 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#a4a8ac;">
          Este pedido también quedó registrado en el panel de administración.<br>Lore District · Pedidos
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';
}

// Versión de texto plano (respaldo para clientes sin HTML).
function render_new_order_email_text(array $order): string
{
    $lines = [];
    $lines[] = 'NUEVO PEDIDO #' . $order['id'] . ' — Lore District';
    $lines[] = 'Total a cobrar: ' . _mv_money($order['total']) . ' (pago contra entrega)';
    $lines[] = '';
    $lines[] = 'Cliente: ' . ($order['customer_name'] ?? '');
    $lines[] = 'Teléfono: ' . ($order['customer_phone'] ?? '');
    $lines[] = 'Correo: ' . ($order['customer_email'] ?? '');
    $lines[] = '';
    $dir = trim(($order['street'] ?? '') . ' ' . ($order['ext_no'] ?? '') . (!empty($order['int_no']) ? ', Int. ' . $order['int_no'] : ''));
    $lines[] = 'Dirección: ' . $dir;
    $lines[] = 'Alcaldía: ' . ($order['alcaldia'] ?? '');
    $lines[] = 'C.P.: ' . ($order['postal_code'] ?? '');
    if (!empty($order['references_notes'])) {
        $lines[] = 'Referencias: ' . $order['references_notes'];
    }
    $lines[] = 'Instalación: ' . (!empty($order['needs_installation']) ? 'Sí' : 'No');
    $lines[] = '';
    foreach ($order['items'] as $i) {
        $lines[] = $i['quantity'] . ' × ' . $i['product_name'] . ' — ' . _mv_money($i['line_total']);
        if (!empty($i['options_text'])) {
            $lines[] = '   ' . $i['options_text'];
        }
    }
    $lines[] = 'Envío — ' . _mv_money($order['shipping_fee']);
    if ($order['installation_fee'] > 0) {
        $lines[] = 'Instalación — ' . _mv_money($order['installation_fee']);
    }
    $lines[] = 'TOTAL — ' . _mv_money($order['total']);
    return implode("\n", $lines);
}
