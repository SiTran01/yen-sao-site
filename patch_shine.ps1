$file = 'd:\CODEs\tamthuy\yen-sao-site\src\css\style.css'
$text = [System.IO.File]::ReadAllText($file)

# 1. Remove stale inline comment about animation
$text = $text -replace '    /\* Animation is applied via \.hero-word-reveal rule below \(both reveal \+ shine\) \*/\r\n', ''

# 2. Remove old "Run BOTH" comment
$text = $text -replace '/\* Run BOTH word-reveal \(one-shot\) AND shine-sweep \(infinite\) together \*/\r\n', ''

# 3. Replace multi-animation with single word-reveal
$oldAnim = "    animation:`r`n        word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,`r`n        shine-sweep 4s 1.9s linear infinite;"
$newAnim = "    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;"
$text = $text.Replace($oldAnim, $newAnim)

# 4. Inject ::after rule and the ::after animation rule after the closing brace of .hero-word-reveal block
# Find the word-reveal block and append ::after rules after it
$wordRevealBlock = "#hero-main-title.hero-title-animate .hero-word-reveal {`r`n    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;`r`n    /* animation-delay for word-reveal is set via inline style */`r`n}"
$wordRevealBlockWithAfter = "#hero-main-title.hero-title-animate .hero-word-reveal {`r`n    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;`r`n    /* animation-delay for word-reveal is set via inline style */`r`n}`r`n`r`n/* Light-streak fires on ::after every 6s — long pause gives a luxury feel */`r`n#hero-main-title.hero-title-animate .hero-word-reveal::after {`r`n    animation: shine-sweep 6s 2.4s ease-in-out infinite;`r`n}"

$text = $text.Replace($wordRevealBlock, $wordRevealBlockWithAfter)

# 5. Add ::after pseudo-element block after .hero-shine-text closing brace
$shineTextClose = ".hero-shine-text {`r`n    position: relative;`r`n    overflow: hidden;`r`n    background: linear-gradient("
$hasAfter = $text.Contains('.hero-shine-text::after')

if (-not $hasAfter) {
    # Find end of .hero-shine-text block and insert ::after after it
    $shineEnd = "    transform: translateX(-12px);`r`n}`r`n`r`n/* Word reveal"
    $shineEndWithAfter = "    transform: translateX(-12px);`r`n}`r`n`r`n/* Light-streak overlay via ::after pseudo-element */`r`n.hero-shine-text::after {`r`n    content: '';`r`n    position: absolute;`r`n    top: 0;`r`n    left: 0;`r`n    width: 45%;`r`n    height: 100%;`r`n    background: linear-gradient(`r`n        105deg,`r`n        transparent 20%,`r`n        rgba(255, 253, 230, 0.50) 50%,`r`n        transparent 80%`r`n    );`r`n    pointer-events: none;`r`n    transform: translateX(-110%) skewX(-20deg);`r`n    opacity: 0;`r`n}`r`n`r`n/* Word reveal"
    $text = $text.Replace($shineEnd, $shineEndWithAfter)
}

[System.IO.File]::WriteAllText($file, $text, [System.Text.Encoding]::UTF8)
Write-Host "Patch applied successfully"
