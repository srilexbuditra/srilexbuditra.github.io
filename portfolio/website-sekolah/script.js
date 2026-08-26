const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>nav.classList.remove('open'));
});

const filters=document.querySelectorAll('.filter');
const cards=document.querySelectorAll('.card');
filters.forEach(button=>{
  button.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    button.classList.add('active');
    const filter=button.dataset.filter;
    cards.forEach(card=>{
      card.style.display=(filter==='all'||card.dataset.category===filter)?'block':'none';
    });
  });
});