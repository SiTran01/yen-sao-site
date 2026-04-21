tailwind.config = {
    theme: {
        extend: {
            colors: {
                'brand-brown': '#613613', // Extracted from reference
                'brand-red': '#FA1111',   // Extracted from reference
                'brand-cream': '#fff5e8', // Light organic background (Updated by user)
                'brand-gold': '#C5A059',
            },
            fontFamily: {
                sans: ['"Montserrat"', 'sans-serif'],
                body: ['"Be Vietnam Pro"', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 20px -2px rgba(97, 54, 19, 0.1)',
                'hover': '0 10px 40px -5px rgba(97, 54, 19, 0.15)',
            }
        }
    }
}
