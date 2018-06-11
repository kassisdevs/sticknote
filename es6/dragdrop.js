
const filledBoxes = document.querySelectorAll('.fill');
const emptyBoxes = document.querySelectorAll('.empty');

for (const empty of emptyBoxes) {
  empty.addEventListener('dragover', dragOver)
  empty.addEventListener('dragenter', dragEnter)
  empty.addEventListener('dragleave', dragLeave)
  empty.addEventListener('drop', dragDrop)
}
let target;
for (const f of filledBoxes) {
  f.addEventListener('dragstart', dragStart);
  f.addEventListener('dragend', dragEnd);

}

function dragStart(){
target = this;
this.className += ' hold';
setTimeout(() => {this.className = 'invisible'}, 0)
}

function dragEnd(){
  this.className = 'fill';
}

function dragOver(e){
  e.preventDefault()
}
function dragEnter(e){
  this.className += ' hovered'
  e.preventDefault()
}
function dragLeave(){
  this.className = 'empty'
}
function dragDrop(){
  this.className = 'empty'
  this.append(target)
}