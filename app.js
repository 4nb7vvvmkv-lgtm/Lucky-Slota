const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

const symbols = [
  "🍒",
  "🍋",
  "⭐",
  "💎",
  "7️⃣"
];

const payouts = {
  "7️⃣": 500,
  "💎": 250,
  "⭐": 150,
  "🍒": 100,
  "🍋": 75
};

let balance = Number(
  localStorage.getItem("lucky_slota_balance") ?? 1000
);

let spinning = false;

const balanceElement = document.getElementById("balance");
const messageElement = document.getElementById("message");
const spinButton = document.getElementById("spin");

const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3")
];

function format(number) {
  return number.toLocaleString("nl-NL");
}

function save() {
  localStorage.setItem(
    "lucky_slota_balance",
    String(balance)
  );
}

function render() {
  balanceElement.textContent = format(balance);
}

function randomSymbol() {
  return symbols[
    Math.floor(Math.random() * symbols.length)
  ];
}

function spin() {
  if (spinning) return;

  if (balance < 10) {
    messageElement.textContent =
      "❌ Niet genoeg coins.";
    return;
  }

  spinning = true;

  balance -= 10;
  save();
  render();

  spinButton.disabled = true;

  messageElement.textContent =
    "De rollen draaien…";

  reels.forEach(reel => {
    reel.classList.add("spinning");
  });

  const result = [
    randomSymbol(),
    randomSymbol(),
    randomSymbol()
  ];

  setTimeout(() => {
    stopReel(0, result[0]);
  }, 650);

  setTimeout(() => {
    stopReel(1, result[1]);
  }, 950);

  setTimeout(() => {
    stopReel(2, result[2]);
  }, 1250);

  setTimeout(() => {
    finishSpin(result);
  }, 1350);
}

function stopReel(index, value) {
  reels[index].classList.remove("spinning");
  reels[index].textContent = value;
}

function finishSpin(result) {
  const [a, b, c] = result;

  let win = 0;

  if (a === b && b === c) {
    win = payouts[a];

    messageElement.textContent =
      `🎉 JACKPOT! +${win} coins`;

  } else if (
    a === b ||
    a === c ||
    b === c
  ) {
    win = 20;

    messageElement.textContent =
      "✨ Twee dezelfde! +20 coins";

  } else {
    messageElement.textContent =
      "Geen prijs — probeer nog eens!";
  }

  if (win > 0) {
    balance += win;
    save();
    render();
  }

  spinning = false;
  spinButton.disabled = false;
}

spinButton.addEventListener("click", spin);

document
  .getElementById("reset")
  .addEventListener("click", () => {

    balance = 1000;

    save();
    render();

    reels[0].textContent = "🍒";
    reels[1].textContent = "🍋";
    reels[2].textContent = "⭐";

    messageElement.textContent =
      "Coins gereset naar 1.000.";
  });

render();