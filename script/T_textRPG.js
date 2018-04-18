function logMessage(msg, color) {
  if (!color) {
    color = 'black';
  }
  var div = document.createElement('div');
  div.innerHTML = msg;
  div.style.color = color;
  document.getElementById('log').appendChild(div);
}

logMessage('게임을 시작합니다!');

var gameover = false;
var battle = false;

function Character(name, hp, atk) {
  this.name = name;
  this.hp = hp;
  this.atk = atk;
}

Character.prototype.attacked = function(damage) {
  this.hp -= damage;
  logMessage(this.name + '의 체력이 ' + this.hp + '가 되었습니다.');
  if(this.hp <= 0) {
    battle = false;
  }
};

Character.prototype.attack = function(target) {
  logMessage(this.name + '이(가) ' + target.name + '을(를) 공격합니다!');
  target.attacked(this.atk);
};

//Character 상속
function Hero(name, hp, atk, lv, xp) {
  Character.apply(this, arguments);
  this.lv = lv || 1;
  this.xp = xp || 0;
}
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.attacked = function(damage) {
  this.hp -= damage;
  logMessage(this.name + '의 체력이 ' + this.hp + '가 되었습니다.');
  if(this.hp <= 0) {
    logMessage(this.name + '님이 사망하셨습니다. (Lv : ' + this.lv + ')', 'red');
    battle = false;
    gameover = true;
  }
};

Hero.prototype.attack = function(target) {
  logMessage(this.name + '님이 ' + target.name + '을(를) 공격합니다!');
  target.attacked(this.atk);
  if(target.hp <= 0) {
    this.win(target);
  }
};

Hero.prototype.win = function(target) {
  logMessage('전투에서 승리하여 ' + target.xp + '의 경험치를 획득합니다(Lv : ' + this.lv + ' HP : ' + this.hp + ' ATK : ' + this.atk + ')', 'blue');
  this.xp += target.xp;

  if(this.xp >= 100 + 10 * this.lv) {
    this.lv++;
    logMessage(this.lv + '레벨이 되었습니다.', 'blue');
    this.hp = 100 + 10 * this.lv;
    this.xp -= 100 + 10 * this.lv;
    this.atk++;
  }
};

function Monster(name, hp, atk, lv, xp) {
  Character.apply(this, arguments);
  this.lv = lv || 1;
  this.xp = xp || 10;
}
Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

function encounter() {
  var monsterArray = [
    ['토끼', 25, 3, 1, 35],
    ['늑대', 50, 6, 2, 50],
    ['고블린', 80, 4, 3, 75],
    ['해골', 120, 9, 4, 110],
    ['디아블로', 500, 25, 6, 250]
  ];

  var monster = monsterArray[Math.floor(Math.random() * 5)];
  return new Monster(monster[0], monster[1], monster[2], monster[3], monster[4]);
}

function startGame() {
  var hero = new Hero(prompt('이름을 입력해주세요'), 100, 10);
  logMessage(hero.name + '님이 모험을 시작합니다!');

  while(!gameover) {
    var monster = encounter();

    logMessage(monster.name + '을(를) 마주쳤습니다. 전투를 시작합니다!', 'green');
    battle = true;

    while(battle) {
      hero.attack(monster);
      if(monster.hp > 0)
        monster.attack(hero);
    }
  }
}
