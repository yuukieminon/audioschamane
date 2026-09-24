const discordLinks = document.querySelectorAll("[data-discord-link]");
const hasDirectProfile = /^\d{16,22}$/.test(DISCORD_USER_ID);
const discordUrl = hasDirectProfile
  ? `https://discord.com/users/${DISCORD_USER_ID}`
  : "https://discord.com/app";

discordLinks.forEach((link) => {
  link.href = discordUrl;
  const label = link.querySelector("[data-discord-label]");
  if (label && hasDirectProfile) label.textContent = "Discord-Profil öffnen";
});
