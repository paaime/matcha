// Emoji, space, and 1-20 letters. Example: "🍔 Burger" or "📸 Photographe"
export const interestRegex = /^[\u{1F000}-\u{1FFFF}\u{2000}-\u{2BFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]\s[a-zA-Z]{1,20}$/u;