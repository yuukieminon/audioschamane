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

const heroImage = document.querySelector(".hero-visual img");
const desktopHero = window.matchMedia("(min-width: 901px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroMoveDuration = 760;
const downwardScrollKeys = new Set(["ArrowDown", "PageDown", " ", "End"]);
let heroIsAside = window.scrollY > 1;
let heroIsMoving = false;
let heroHasLeftTop = window.scrollY > 1;
let heroMoveTimer = 0;

function heroMotionIsEnabled() {
  return Boolean(heroImage && desktopHero.matches && !reducedMotion.matches);
}

function getMaximumHeroShift() {
  const heroWidth = Math.min(1280, window.innerWidth - 48);
  const outerGutter = Math.max(0, (window.innerWidth - heroWidth) / 2);
  return Math.min(160, Math.max(56, outerGutter + 40));
}

function applyHeroPosition() {
  if (!heroMotionIsEnabled()) {
    heroImage?.style.removeProperty("--hero-image-shift");
    return;
  }

  const shift = heroIsAside ? getMaximumHeroShift() : 0;
  heroImage.style.setProperty("--hero-image-shift", `${shift.toFixed(1)}px`);
}

function finishHeroMove() {
  window.clearTimeout(heroMoveTimer);
  heroMoveTimer = 0;
  heroIsMoving = false;
  document.documentElement.classList.remove("hero-motion-locked");
}

function moveHeroAside() {
  if (!heroMotionIsEnabled() || heroIsAside || heroIsMoving) return;

  heroIsAside = true;
  heroIsMoving = true;
  document.documentElement.classList.add("hero-motion-locked");
  applyHeroPosition();
  heroMoveTimer = window.setTimeout(finishHeroMove, heroMoveDuration);
}

function handleHeroWheel(event) {
  if (!heroMotionIsEnabled() || window.scrollY > 1) return;

  if (heroIsMoving) {
    event.preventDefault();
    return;
  }

  if (!heroIsAside && event.deltaY > 0) {
    event.preventDefault();
    moveHeroAside();
  }
}

function handleHeroKeydown(event) {
  if (!heroMotionIsEnabled() || !downwardScrollKeys.has(event.key)) return;
  if (
    event.target instanceof Element &&
    event.target.closest("a, button, input, textarea, select, [contenteditable]")
  ) return;

  if (heroIsMoving) {
    event.preventDefault();
    return;
  }

  if (window.scrollY <= 1 && !heroIsAside) {
    event.preventDefault();
    moveHeroAside();
  }
}

function handleHeroScroll() {
  if (!heroMotionIsEnabled()) return;

  if (window.scrollY > 1) {
    heroHasLeftTop = true;
    if (!heroIsAside) {
      heroIsAside = true;
      applyHeroPosition();
    }
    return;
  }

  if (heroHasLeftTop && !heroIsMoving) {
    heroHasLeftTop = false;
    heroIsAside = false;
    applyHeroPosition();
  }
}

function syncHeroMotion() {
  if (!heroMotionIsEnabled()) {
    finishHeroMove();
    heroIsAside = false;
    heroHasLeftTop = window.scrollY > 1;
    heroImage?.style.removeProperty("--hero-image-shift");
    return;
  }

  if (window.scrollY > 1) {
    heroIsAside = true;
    heroHasLeftTop = true;
  }

  applyHeroPosition();
}

heroImage?.addEventListener("transitionend", (event) => {
  if (event.propertyName === "transform" && heroIsMoving) finishHeroMove();
});

window.addEventListener("wheel", handleHeroWheel, { passive: false });
window.addEventListener("keydown", handleHeroKeydown);
window.addEventListener("scroll", handleHeroScroll, { passive: true });
window.addEventListener("resize", syncHeroMotion);
desktopHero.addEventListener("change", syncHeroMotion);
reducedMotion.addEventListener("change", syncHeroMotion);
syncHeroMotion();
