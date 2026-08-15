<?php require 'config.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars(ucfirst($config['name'])) ?> | Links</title>
    <meta name="description" content="<?= htmlspecialchars($config['tagline']) ?> – Temukan semua link <?= htmlspecialchars($config['name']) ?> di sini.">

    <!-- Preload Fonts -->
    <link rel="preload" href="fonts/Rasedia-Regular.otf" as="font" type="font/otf" crossorigin>
    <link rel="preload" href="fonts/Olivera_Demo.ttf" as="font" type="font/ttf" crossorigin>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
    <!-- SVG gradient untuk Instagram icon -->
    <svg width="0" height="0" style="position:absolute">
        <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#f09433"/>
                <stop offset="25%"  stop-color="#e6683c"/>
                <stop offset="50%"  stop-color="#dc2743"/>
                <stop offset="75%"  stop-color="#cc2366"/>
                <stop offset="100%" stop-color="#bc1888"/>
            </linearGradient>
        </defs>
    </svg>
</head>
<body>

<div class="container">

    <!-- ===== HEADER ===== -->
    <header class="header">
        <?php if (!empty($config['avatar'])): ?>
        <div class="avatar-wrap">
            <img class="avatar"
                 src="<?= htmlspecialchars($config['avatar']) ?>"
                 alt="Avatar <?= htmlspecialchars($config['name']) ?>">
        </div>
        <?php else: ?>
        <div class="avatar-wrap">
            <div class="avatar-placeholder">
                <!-- user silhouette icon -->
                <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            </div>
        </div>
        <?php endif; ?>

        <h1 class="site-name"><?= htmlspecialchars($config['name']) ?></h1>
        <p  class="site-tagline"><?= htmlspecialchars($config['tagline']) ?></p>
        <hr class="divider">
        <?php if (!empty($config['bio'])): ?>
        <p  class="site-bio"><?= $config['bio'] ?></p>
        <?php endif; ?>
    </header>

    <!-- ===== LINK CARDS ===== -->
    <nav class="links" aria-label="Social links">
        <?php foreach ($config['links'] as $link): ?>
        <a class="link-card"
           href="<?= htmlspecialchars($link['url']) ?>"
           data-platform="<?= htmlspecialchars($link['icon']) ?>"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="<?= htmlspecialchars($link['label']) ?>">

            <span class="link-icon" aria-hidden="true">
                <?= $icons[$link['icon']] ?? $icons['web'] ?>
            </span>

            <span class="link-label"><?= htmlspecialchars($link['label']) ?></span>

            <!-- arrow icon -->
            <svg class="link-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
        </a>
        <?php endforeach; ?>
    </nav>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
        &copy; <?= date('Y') ?> <?= htmlspecialchars($config['name']) ?>
    </footer>

</div>

<!-- JELLY / BUBBLE OVERSCROLL PHYSICS -->
<script>
    const container = document.querySelector('.container');
    let stretchAcc = 0;
    let stretchTimeout;

    const applyBuble = (deltaY, isTop, isMouse) => {
        // Sensitivitas tarikan dibedakan: mouse PC (0.015) vs touch HP (0.05)
        const sensitivity = isMouse ? 0.015 : 0.05;
        stretchAcc += Math.abs(deltaY) * sensitivity; 
        
        // Batas maksimal melar HANYA 4% saja biar sangat soft & nggak lebay
        if (stretchAcc > 40) stretchAcc = 40; 

        const intensity = stretchAcc / 1000; // max ~0.04 (4% melar)
        
        container.style.transition = 'none';
        container.style.transformOrigin = isTop ? 'top center' : 'bottom center';
        // Squeeze X dibuat lebih kecil (0.2) agar lebarnya gak terlalu mengerut aneh 
        container.style.transform = `scale(${1 - intensity * 0.15}, ${1 + intensity})`;

        clearTimeout(stretchTimeout);
        // Lepas kembali ke ukuran asli (dipercepat responnya)
        stretchTimeout = setTimeout(() => {
            container.style.transition = 'transform 0.25s cubic-bezier(0.25, 1.2, 0.5, 1)'; // Animasi snapback lebih cepat (snappy)
            container.style.transform = 'scale(1, 1)';
            stretchAcc = 0;
        }, 40); 
    };

    // MATIKAN Sensor Untuk Mouse PC/Laptop (Wheel)
    // window.addEventListener('wheel', ... dihapus sesuai request

    // Sensor Untuk Sentuhan Layar HP/Tab (Touch)
    let lastTouchY = 0;
    window.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
    }, {passive: true});

    window.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchY - currentY; 
        lastTouchY = currentY;

        if(window.scrollY <= 0 && deltaY < 0) {
            applyBuble(deltaY, true, false);
        } else if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight && deltaY > 0) {
            applyBuble(deltaY, false, false);
        }
    }, {passive: true});
</script>

</body>
</html>
