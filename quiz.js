/* quiz.js — quiz logic (persistence, navigation, scoring, badge) */
(function(){
  const storageKey = 'owlQuiz_v1';
  const quizData = [
    { q: "Where do screech owls nest?", choices:["Dreys; old squirrel nests","Cavities; old woodpecker nests","Platforms; stick nests in high canopy","Burrows; nests dug in the ground"], answer:1 },
    { q: "What do screech owls primarily eat?", choices:["Fish","Small mammals & insects","Berries","Seeds"], answer:1 },
    { q: "What are color morphs?", choices:["Owls within one species can be different in color","Two different species under one name","Male and female are different colors","Owls change color with the seasons"], answer:0 },
    { q: "Which best describes how screech owls call?", choices:["A low coo","A high trill","A loud bark","A soft click"], answer:1 },
    { q: "How can you help owls?", choices:["Advocate for habitat protections","Protect habitat & provide nesting boxes","Plant native plants","Avoid using pesticides","All of the above"], answer:4 }
  ];
  const quizEl = document.getElementById('quiz');
  const questionEls = Array.from(quizEl.querySelectorAll('.question'));
  const prevBtn = document.getElementById('q-prev');
  const nextBtn = document.getElementById('q-next');
  const scoreEl = document.getElementById('quiz-score');
  const badgeEl = document.getElementById('quiz-badge');
  const restartBtn = document.getElementById('quiz-restart');
  const congratsEl = document.getElementById('quiz-congrats');
  const badgeTop = document.getElementById('quiz-logo');
  let current = 0;
  const selected = new Array(quizData.length).fill(null);
  const correct = new Array(quizData.length).fill(false);

  badgeTop.hidden = true;
  badgeEl.classList.remove('show');

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ selected, current })); } catch(e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (Array.isArray(obj.selected)) {
        obj.selected.forEach((val, idx) => {
          if (val === null || val === undefined) return;
          if (typeof val === 'number') {
            selected[idx] = val;
            const qEl = questionEls[idx];
            qEl.querySelectorAll('.options button').forEach((b, bi) => {
              if (bi === quizData[idx].answer) b.classList.add('correct');
              if (bi === val && bi !== quizData[idx].answer) b.classList.add('incorrect');
            });
            correct[idx] = (val === quizData[idx].answer);
          }
        });
      }
      if (typeof obj.current === 'number' && obj.current >=0 && obj.current < quizData.length) current = obj.current;
    } catch(e) {
      // ignore
    }
  }

  function updateResultsIfPerfect(){
    const total = correct.reduce((s,c)=> s + (c?1:0), 0);
    scoreEl.textContent = `You got ${total} out of ${quizData.length}.`;
          const downloadBtn = document.getElementById('download-badge');
          const shareBtn = document.getElementById('share-site-url');
          const igBtn = document.getElementById('share-instagram');
          const fbBtn = document.getElementById('share-facebook');
          const badgeUrl = 'https://peytonh60.github.io/project-owl-warrior/media/badge.gif';
          const igBadgeUrl = 'https://peytonh60.github.io/project-owl-warrior/media/ig.jpg';
          const fbBadgeUrl = 'https://peytonh60.github.io/project-owl-warrior/media/fb.jpg';
          const pageUrl = location.href;

          if (total === quizData.length) {
            badgeEl.classList.add('show');
            quizEl.classList.add('completed');
            badgeTop.hidden = false;

            // show congrats panel
            if (congratsEl) {
              congratsEl.hidden = false;
              // set download link
              if (downloadBtn) downloadBtn.href = igBadgeUrl;
              // set share links
              const text = `I scored 5/5 on the Owl Quiz! 🦉 Congratulations Owl Warrior!`;
              // Instagram doesn't support a share intent like Twitter; open the badge image so users can save/share on Instagram manually
              if (igBtn) { igBtn.href = igBadgeUrl; igBtn.title = 'Open badge image'; }
              if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fbBadgeUrl)}`;
              // copy handler
              if (shareBtn) shareBtn.onclick = async ()=>{ try { await navigator.clipboard.writeText(pageUrl); shareBtn.textContent='Copied!'; setTimeout(()=>shareBtn.textContent='Copy Site URL',1200); } catch(e){ alert('Copy failed; site URL: '+siteUrl); } };
            }

            // Let the pop animation run then focus and bring the quiz into view
            setTimeout(()=>{
              try { badgeEl.focus({preventScroll:true}); } catch(e){ badgeEl.focus(); }
              try { quizEl.scrollIntoView({behavior:'smooth', block:'center'}); } catch(e){}
            }, 260);
          } else {
            badgeTop.hidden = true;
            badgeEl.classList.remove('show');
            quizEl.classList.remove('completed');
            if (congratsEl) congratsEl.hidden = true;
          }
        }

  function showQuestion(index){
    questionEls.forEach((el,i)=> el.classList.toggle('active', i===index));
    prevBtn.disabled = index===0;
    nextBtn.textContent = index===quizData.length-1 ? 'Show Results' : 'Next ➜';
    current = index; save();
  }

  // Hook up option buttons for immediate feedback and persistence
  questionEls.forEach((qEl, idx)=>{
    qEl.querySelectorAll('.options button').forEach((btn, i)=>{
      btn.addEventListener('click', ()=>{
        selected[idx] = i;
        const isRight = i === quizData[idx].answer;
        correct[idx] = isRight;
        qEl.querySelectorAll('.options button').forEach((b, bi)=>{
          b.classList.toggle('correct', bi === quizData[idx].answer);
          b.classList.toggle('incorrect', bi !== quizData[idx].answer && bi === i);
        });
        save();
        updateResultsIfPerfect();
      });
    });
  });

  prevBtn.addEventListener('click', ()=>{ if (current>0){ current--; showQuestion(current); } });
  nextBtn.addEventListener('click', ()=>{
    if (current < quizData.length-1){ current++; showQuestion(current); }
    else { // Show results
      updateResultsIfPerfect();
    }
  });

  restartBtn.addEventListener('click', ()=>{
      quizEl.classList.remove('completed');
      
      for (let i = 0; i < selected.length; i++) selected[i] = null;
      for (let i = 0; i < correct.length; i++) correct[i] = false;

      questionEls.forEach(qEl =>
        qEl.querySelectorAll('.options button')
          .forEach(b => b.classList.remove('correct','incorrect'))
      );

      if (congratsEl) congratsEl.hidden = true;
      badgeEl.classList.remove('show');
      badgeTop.hidden = true;
      scoreEl.textContent = '';

      current = 0;
      localStorage.removeItem(storageKey);
      save();
      showQuestion(0);
});

  // Initialize
  load();
  updateResultsIfPerfect();
  showQuestion(current);
}());