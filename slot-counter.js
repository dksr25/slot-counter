class SlotCounter {
  constructor(el, options) {
    this.el = el;
    this.args = {
      style : {
        size : {
          property: '--counter-font-size',
          value: options.size
        },
        color : {
          property: '--counter-color',
          value: options.color
        },
        bgColor : {
          property: '--counter-bg-color',
          value: options.bgColor
        } 
      },
      rollLength: options.rollLength || 20,
      run : options.run
    };
    
    this.args.counter = document.querySelectorAll(this.el).length > 1 ?
      document.querySelectorAll(this.el)[0] : 
      document.querySelector(this.el);
    
    this.args.number = this.args.counter.innerText;
    this.args.numberSplit = this.args.number.split('');
    
    if (this.args.run !== false) {
      this.init()
      window.addEventListener('load',()=>{
        this.run()
      })
    } else {
      this.init()
    }
  }

  preBuild() {
    let cssTextArray = [];

    Object.keys(this.args.style).forEach(key => {
      typeof this.args.style[key]['value'] !== 'undefined' ?
        cssTextArray.push(`${this.args.style[key]['property']}:${this.args.style[key]['value']}`) : null
    })

    cssTextArray.length > 0 ?
      this.args.counter.style.cssText = cssTextArray.join(';') : null
  }
  
  build() {
    this.args.numberSplit.forEach((numberItem,i) => {
      let slot;
      let numberset;
      let transitionDuration = 1 + (0.15 * (this.args.number.length - (1 + i)));

      if (!isNaN(Number(numberItem))) {
        slot = document.createElement('div')
        numberset = new Array(this.args.rollLength).fill().map(() => (numberItem++) % 10)
      } else if (numberItem === '.' || numberItem === ',') {
        slot = document.createElement('q');
        numberset = new Array(this.args.rollLength).fill(numberItem)
      } else {
        throw new Error('Unexpected string in parameter "number"');
      }

      slot.classList.add('counter-slot');
      slot.innerHTML = '<span class="counter-roll" />'
      let roll = slot.querySelector('.counter-roll');
      
      numberset.forEach((number,i) => {
        let rollItem = document.createElement('span');
        rollItem.innerHTML = number;
        
        roll.setAttribute('style',`transition-duration: ${transitionDuration}s`);
        roll.append(rollItem);
      })

      i === 0 ?
        this.args.counter.innerHTML = '' : null;
      this.args.counter.append(slot);
    })
  }

  run() {
    let slots = this.args.counter.querySelectorAll('.counter-slot');
    
    slots.forEach((slot,i) => {
      slot.classList.add('is-rolling');
      slot.querySelector('.counter-roll').addEventListener('transitionend',() => {
        slot.classList.replace('is-rolling','is-end');
        slot.querySelectorAll('.counter-roll span').forEach((item,j) => {
          j > 0 ? item.remove() : null;
          
          // if (i === 0) {
          //   slots.forEach(slot => {
          //     slot.remove();
          //     this.args.counter.innerText = this.args.number;
          //   })
          // }
        })
      },{ once: true })
    })
  }

  init() {
    this.preBuild();
    this.build();
  }
}
