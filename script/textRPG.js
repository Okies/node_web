var Game = (function() {
  var instance;
  var init = function(hero_name) {
    var hero = {
      name : hero_name,
      lv : 1,
      maxHp : 100,
      hp : 100,
      maxXp : 100,
      xp : 0,
      atk : 10
    };

    var monsters = [{
      name: '슬라임',
      hp: 25 + hero.lv * 3,
      atk: 10 + hero.lv,
      xp: 10 + hero.lv,
    }, {
      name: '스켈레톤',
      hp: 50 + hero.lv * 5,
      atk: 15 + hero.lv * 2,
      xp: 20 + hero.lv * 2,
    }, {
      name: '악마',
      hp: 100 + hero.lv * 10,
      atk: 25 + hero.lv * 5,
      xp: 50 + hero.lv * 5,
    }];

    var monster = null;
    var turn = true;

    return {
      showName : function() {
        document.getElementById('hero_name').innerHTML = hero.name;
        return this;
      },
      showLevel : function() {
        document.getElementById('hero_level').innerHTML = 'lv.' + hero.lv;
        return this;
      },
      showHp : function() {
        if(hero.hp <= 0) {
          return this.gameOver();
        }
        document.getElementById('hero_hp').innerHTML = 'HP : ' + hero.hp + '/' + hero.maxHp;
        return this;
      },
      showXp : function() {
        var self = this;

        if(hero.xp >= hero.maxXp) {
          hero.xp -= hero.maxXp;
          hero.maxHp += 10;
          hero.hp = hero.maxHp;
          hero.atk += hero.lv++;
          window.setTimeout(function() {
            self.setMessage('레벨업!');
          }, 1000);
        }

        document.getElementById('hero_xp').innerHTML = 'XP : ' + hero.xp + '/' + hero.maxXp;
        return this;
      },
      showAtk : function() {
        document.getElementById('hero_atk').innerHTML = 'ATK : ' + hero.atk;
        return this;
      },
      showHeroStat : function() {
        return this.showName().showLevel().showHp().showXp().showAtk();
      },
      setMessage : function(msg) {
        document.getElementById('message').innerHTML = msg + '</br>';
        return this;
      },
      messageAppend : function(msg) {
        document.getElementById('message').innerHTML += msg + '</br>';
        return this;
      },
      showGameScreen : function() {
        document.getElementById('menu_battle').style.display = 'none';
        document.getElementById('menu_game').style.display = 'block';
        document.getElementById('input_menu').focus();
        return this;
      },
      showBattleScreen : function() {
        document.getElementById('menu_game').style.display = 'none';
        document.getElementById('menu_battle').style.display = 'block';
        document.getElementById('input_battle').focus();
        return this;
      },
      toggleMenu : function() {
        //this.showHeroStat();
        document.getElementById('screen_start').style.display = 'none';

        if(document.getElementById('menu_game').style.display === 'block') {
          this.showBattleScreen();
        } else {
          this.showGameScreen();
        }
        return this;
      },
      encounter : function() {
        monster = JSON.parse(JSON.stringify(monsters[Math.floor(Math.random() * monsters.length)]));
        console.log(monsters);
        console.log(monster);
        document.getElementById('monster_name').innerHTML = monster.name;
        document.getElementById('monster_hp').innerHTML = 'HP : ' + monster.hp + '/' + monster.hp;
        document.getElementById('monster_atk').innerHTML = 'ATK : ' + monster.atk;

        this.setMessage(monster.name + '을(를) 마주쳤습니다.');
        return this.toggleMenu();
      },
      menuInput : function(input) {
        if(input == '1') {
          return this.encounter();
        } else if (input == '2') {
          hero.hp = hero.maxHp;
          return this.showHeroStat().setMessage('체력을 회복했습니다.');
        } else if(input == '3') {
          return this.exit();
        } else {
          alert('잘못된 입력');
        }
      },
      battleInput : function(input) {
        if(input == '1') {
          return this.attackMonster();
        } else if(input == '2') {
          if(hero.hp + hero.lv * 20 < hero.maxHp) {
            hero.hp += hero.lv * 20;
          } else {
            hero.hp = hero.maxHp;
          }

          return this.showHp().setMessage('체력을 회복했습니다.').nextTurn();

        } else if(input == '3') {
          return this.clearMonster().setMessage('도망쳤습니다.');
        } else {
          alert('잘못된 입력');
        }
      },
      attackMonster : function() {
        monster.hp -= hero.atk;

        document.getElementById('monster_hp').innerHTML = 'HP : ' + monster.hp;
        if(monster.hp > 0) {
          return this.setMessage(hero.atk + '의 피해를 입혔습니다.').nextTurn();
        }

        return this.battleWin();
      },
      attackHero : function() {
        hero.hp -= monster.atk;
        return this.showHp();
      },
      nextTurn : function() {
        var self = this;

        turn = !turn;
        document.getElementById('button_battle').disabled = true;

        if(!turn) { //몬스터 턴
          setTimeout(function() {
            self.messageAppend(monster.name + '의 차례입니다.');
            setTimeout(function() {
              document.getElementById('button_battle').disabled = false;
              if(self.attackHero()) {
                self.messageAppend(monster.atk + '의 피해를 입혔습니다.');
                setTimeout(function() {
                  self.messageAppend(hero.name + '의 차례입니다.');
                }, 1000);
              }
            }, 1000);
          }, 1000);
          return this.nextTurn();
        }
        return this;
      },
      battleWin : function() {
        this.setMessage(monster.name + '을(를) 물리쳤습니다. 경험치 ' + monster.xp + '을 얻었습니다.');
        hero.xp += monster.xp;
        return this.showXp().clearMonster();
      },
      clearMonster : function() {
        monster = null;
        document.getElementById('monster_name').innerHTML = '';
        document.getElementById('monster_hp').innerHTML = '';
        document.getElementById('monster_atk').innerHTML = '';

        return this.toggleMenu();
      },
      gameOver : function() {
        this.setMessage('사망하셨습니다.');
      },
      exit : function() {
        document.getElementById('screen_start').innerHTML = '새로 시작하려면 새로고침';
      }
    };
  };
  return {
    getinstance : function(name) {
      if(!instance) {
        instance = init(name);
      }
      return instance;
    }
  };
})();

document.getElementById('screen_start').onsubmit = function(e) {
  var name = document.getElementById('input_name').value;
  e.preventDefault();

  if(name && name.trim() && confirm(name + '으로 하시겠습니까?')) {
    Game.getinstance(name).showHeroStat().toggleMenu();
  } else {
    alert('이름을 입력해주세요');
  }
}

document.getElementById('menu_game').onsubmit = function(e) {
  var input = document.getElementById('input_menu');
  var option = input.value;
  e.preventDefault();
  input.value = '';
  Game.getinstance().menuInput(option);
}

document.getElementById('menu_battle').onsubmit = function(e) {
  var input = document.getElementById('input_battle');
  var option = input.value;
  e.preventDefault();
  input.value = '';
  Game.getinstance().battleInput(option);
}
