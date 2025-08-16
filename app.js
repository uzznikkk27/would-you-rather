const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const state = {
  questions: [],
  index: 0,
  order: [],
};

const els = {
  question: $("#question"),
  optionA: $("#optionA"),
  optionB: $("#optionB"),
  counter: $("#counter"),
  nextBtn: $("#nextBtn"),
  prevBtn: $("#prevBtn"),
  shuffleBtn: $("#shuffleBtn"),
  shareBtn: $("#shareBtn"),
  year: $("#year"),
  card: $("#card"),
};
els.year.textContent = new Date().getFullYear();

async function loadQuestions(){
  const res = await fetch("/questions", { cache: "no-store" });
  if(!res.ok) throw new Error("Failed to load questions");
  const data = await res.json();
  if(!Array.isArray(data)) throw new Error("Questions must be an array");
  state.questions = data;
  state.order = data.map((_, i) => i);
  shuffle(state.order);
  state.index = 0;
  render();
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function current(){
  const i = state.order[state.index];
  return state.questions[i];
}

function render(){
  const q = current();
  els.question.textContent = q.question;
  els.optionA.textContent = q.optionA;
  els.optionB.textContent = q.optionB;
  els.counter.textContent = `${state.index+1}/${state.questions.length}`;
  els.card.classList.remove("fade-in");
  void els.card.offsetWidth; // restart animation
  els.card.classList.add("fade-in");
  updateNav();
}

function updateNav(){
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.disabled = state.index >= state.questions.length - 1;
}

function next(){
  if(state.index < state.questions.length - 1){
    state.index++;
    render();
  }
}
function prev(){
  if(state.index > 0){
    state.index--;
    render();
  }
}

// Share current question via Web Share API or clipboard
async function share(){
  const q = current();
  const text = `Would you rather… ${q.question}\nA) ${q.optionA}\nB) ${q.optionB}`;
  try{
    if(navigator.share){
      await navigator.share({ title: "Would You Rather", text });
    }else{
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }catch(e){
    console.warn(e);
  }
}

// When selecting an option, jump to next
function onSelect(){
  next();
}

els.nextBtn.addEventListener("click", next);
els.prevBtn.addEventListener("click", prev);
els.shuffleBtn.addEventListener("click", () => {
  shuffle(state.order);
  state.index = 0;
  render();
});
els.shareBtn.addEventListener("click", share);
els.optionA.addEventListener("click", onSelect);
els.optionB.addEventListener("click", onSelect);

loadQuestions().catch(err => {
  console.error(err);
  els.question.textContent = "Failed to load questions. Please try again later.";
  els.optionA.style.display = "none";
  els.optionB.style.display = "none";
  els.nextBtn.disabled = true;
  els.prevBtn.disabled = true;
});
