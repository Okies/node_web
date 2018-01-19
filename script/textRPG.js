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
}

document.getElementById('menu_battle').onsubmit = function(e) {
  var input = document.getElementById('input_battle');
  var option = input.value;
  e.preventDefault();
  input.value = '';
}
