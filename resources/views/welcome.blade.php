<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeConnect - Find your next home</title>
    <!-- Include Vite Assets -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
</head>
<body class="antialiased" style="background: #eef2f6;">
    <div id="blade-test" style="text-align: center; padding: 20px; font-family: sans-serif; display: none;">
        <h1>If you see this, Blade is working but React is NOT loading.</h1>
    </div>
    <div id="root">
        <h2 style="text-align: center; margin-top: 50px; font-family: sans-serif;">Loading Canvas App...</h2>
    </div>

    <script>
        // Fallback script to show the blade-test div if React fails to mount within 3 seconds
        setTimeout(() => {
            const root = document.getElementById('root');
            if (root && root.innerHTML.includes('Loading Canvas App')) {
                document.getElementById('blade-test').style.display = 'block';
            }
        }, 3000);
    </script>
</body>
</html>
