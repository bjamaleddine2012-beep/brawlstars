// Shared brawler data - used by both server and client
const BRAWLER_DATA = [
  // ===== COMMON =====
  { name:'Shelly', role:'Fighter', color:'#e84393', hp:5600, speed:2.8, damage:420, range:280, reload:1.2, projSpeed:9, projCount:5, spread:0.45, rarity:'common', icon:'shotgun', hat:'bandana', hair:'brown', skin:'#f0c8a0' },
  { name:'Nita', role:'Fighter', color:'#00b894', hp:5000, speed:2.8, damage:800, range:260, reload:1.3, projSpeed:8, projCount:1, spread:0, rarity:'common', icon:'bear', hat:'bear-hood', hair:'black', skin:'#d4a574' },
  { name:'Colt', role:'Sharpshooter', color:'#0984e3', hp:3600, speed:3.0, damage:360, range:380, reload:1.0, projSpeed:12, projCount:6, spread:0.15, rarity:'common', icon:'pistol', hat:'none', hair:'red', skin:'#f0c8a0' },
  { name:'Bull', role:'Tank', color:'#d63031', hp:7000, speed:2.6, damage:520, range:200, reload:1.4, projSpeed:8, projCount:5, spread:0.5, rarity:'common', icon:'shotgun', hat:'cap', hair:'black', skin:'#8d5524' },
  { name:'Brock', role:'Sharpshooter', color:'#6c5ce7', hp:3200, speed:2.8, damage:1100, range:400, reload:1.8, projSpeed:10, projCount:1, spread:0, rarity:'common', icon:'rocket', hat:'shades', hair:'black', skin:'#8d5524' },
  { name:'El Primo', role:'Tank', color:'#e17055', hp:8000, speed:2.7, damage:450, range:120, reload:0.6, projSpeed:0, projCount:4, spread:0.6, rarity:'common', icon:'fist', hat:'mask', hair:'none', skin:'#d4a574' },
  { name:'Barley', role:'Thrower', color:'#a29bfe', hp:3400, speed:2.6, damage:800, range:340, reload:1.8, projSpeed:7, projCount:1, spread:0, rarity:'common', icon:'bottle', hat:'bowtie', hair:'none', skin:'#cccccc' },
  { name:'Poco', role:'Healer', color:'#00cec9', hp:5000, speed:2.8, damage:700, range:300, reload:1.4, projSpeed:7, projCount:1, spread:0, rarity:'common', icon:'guitar', hat:'sombrero', hair:'none', skin:'#e8e8e8' },

  // ===== RARE =====
  { name:'Rosa', role:'Tank', color:'#27ae60', hp:7200, speed:2.7, damage:460, range:140, reload:0.7, projSpeed:0, projCount:3, spread:0.4, rarity:'rare', icon:'fist', hat:'goggles', hair:'green', skin:'#d4a574' },
  { name:'Rico', role:'Sharpshooter', color:'#9b59b6', hp:3200, speed:2.8, damage:320, range:360, reload:1.0, projSpeed:11, projCount:5, spread:0.12, rarity:'rare', icon:'gumball', hat:'none', hair:'none', skin:'#cccccc' },
  { name:'Darryl', role:'Tank', color:'#e67e22', hp:6800, speed:2.6, damage:480, range:180, reload:1.3, projSpeed:9, projCount:4, spread:0.4, rarity:'rare', icon:'shotgun', hat:'barrel', hair:'none', skin:'#8B4513' },
  { name:'Penny', role:'Sharpshooter', color:'#f39c12', hp:3800, speed:2.8, damage:900, range:340, reload:1.6, projSpeed:8, projCount:1, spread:0, rarity:'rare', icon:'cannon', hat:'pirate', hair:'orange', skin:'#f0c8a0' },
  { name:'Carl', role:'Fighter', color:'#3498db', hp:5200, speed:2.8, damage:900, range:300, reload:1.5, projSpeed:9, projCount:1, spread:0, rarity:'rare', icon:'pickaxe', hat:'helmet', hair:'none', skin:'#cccccc' },
  { name:'Jacky', role:'Tank', color:'#e74c3c', hp:6800, speed:2.6, damage:1200, range:140, reload:1.6, projSpeed:0, projCount:1, spread:0, rarity:'rare', icon:'drill', hat:'hardhat', hair:'purple', skin:'#f0c8a0' },

  // ===== SUPER RARE =====
  { name:'Jessie', role:'Support', color:'#fdcb6e', hp:4200, speed:2.8, damage:900, range:320, reload:1.6, projSpeed:8, projCount:1, spread:0, rarity:'super-rare', icon:'turret', hat:'cap', hair:'red', skin:'#f0c8a0' },
  { name:'Dynamike', role:'Thrower', color:'#c0392b', hp:3400, speed:2.6, damage:760, range:320, reload:1.7, projSpeed:6, projCount:2, spread:0.3, rarity:'super-rare', icon:'dynamite', hat:'mining', hair:'white', skin:'#f0c8a0' },
  { name:'Tick', role:'Thrower', color:'#2c3e50', hp:2800, speed:2.6, damage:640, range:360, reload:2.0, projSpeed:6, projCount:3, spread:0.5, rarity:'super-rare', icon:'mine', hat:'none', hair:'none', skin:'#4a6fa5' },
  { name:'8-Bit', role:'Sharpshooter', color:'#2ecc71', hp:5200, speed:2.2, damage:440, range:380, reload:1.0, projSpeed:10, projCount:6, spread:0.1, rarity:'super-rare', icon:'laser', hat:'screen', hair:'none', skin:'#333' },
  { name:'Emz', role:'Fighter', color:'#8e44ad', hp:4400, speed:2.8, damage:500, range:260, reload:0.5, projSpeed:5, projCount:1, spread:0, rarity:'super-rare', icon:'spray', hat:'none', hair:'purple', skin:'#98d4a0' },
  { name:'Stu', role:'Fighter', color:'#f1c40f', hp:3600, speed:3.2, damage:560, range:280, reload:0.8, projSpeed:10, projCount:2, spread:0.2, rarity:'super-rare', icon:'fire', hat:'helmet', hair:'none', skin:'#cccccc' },

  // ===== EPIC =====
  { name:'Piper', role:'Sharpshooter', color:'#ff69b4', hp:2800, speed:2.8, damage:1500, range:420, reload:2.2, projSpeed:11, projCount:1, spread:0, rarity:'epic', icon:'umbrella', hat:'parasol', hair:'pink', skin:'#f0c8a0' },
  { name:'Pam', role:'Healer', color:'#16a085', hp:5600, speed:2.6, damage:260, range:300, reload:0.8, projSpeed:8, projCount:9, spread:0.5, rarity:'epic', icon:'scrap', hat:'none', hair:'brown', skin:'#d4a574' },
  { name:'Frank', role:'Tank', color:'#34495e', hp:8400, speed:2.4, damage:1600, range:180, reload:2.0, projSpeed:0, projCount:1, spread:0, rarity:'epic', icon:'hammer', hat:'none', hair:'black', skin:'#98d4a0' },
  { name:'Bibi', role:'Fighter', color:'#e91e63', hp:5000, speed:2.8, damage:1400, range:160, reload:1.6, projSpeed:0, projCount:1, spread:0, rarity:'epic', icon:'bat', hat:'bubble', hair:'black', skin:'#f0c8a0' },
  { name:'Bea', role:'Sharpshooter', color:'#ffd700', hp:3200, speed:2.8, damage:1100, range:380, reload:1.4, projSpeed:10, projCount:1, spread:0, rarity:'epic', icon:'bee', hat:'antennae', hair:'yellow', skin:'#f0c8a0' },
  { name:'Nani', role:'Sharpshooter', color:'#00bcd4', hp:3200, speed:2.8, damage:1000, range:360, reload:1.6, projSpeed:9, projCount:3, spread:0.15, rarity:'epic', icon:'orb', hat:'none', hair:'none', skin:'#e0e0e0' },
  { name:'Edgar', role:'Assassin', color:'#212121', hp:3600, speed:3.0, damage:700, range:120, reload:0.5, projSpeed:0, projCount:2, spread:0.3, rarity:'epic', icon:'scarf', hat:'hoodie', hair:'red-black', skin:'#f0c8a0' },
  { name:'Griff', role:'Fighter', color:'#4caf50', hp:4400, speed:2.8, damage:320, range:300, reload:1.0, projSpeed:9, projCount:5, spread:0.35, rarity:'epic', icon:'coin', hat:'visor', hair:'none', skin:'#f0c8a0' },
  { name:'Grom', role:'Thrower', color:'#795548', hp:3800, speed:2.6, damage:1100, range:360, reload:1.8, projSpeed:7, projCount:1, spread:0, rarity:'epic', icon:'bomb', hat:'box', hair:'none', skin:'#ddd' },
  { name:'Bonnie', role:'Sharpshooter', color:'#e040fb', hp:4000, speed:2.8, damage:1400, range:380, reload:1.8, projSpeed:10, projCount:1, spread:0, rarity:'epic', icon:'cannon', hat:'ribbon', hair:'purple', skin:'#f0c8a0' },

  // ===== MYTHIC =====
  { name:'Mortis', role:'Assassin', color:'#4a0080', hp:4200, speed:3.2, damage:1050, range:160, reload:1.8, projSpeed:0, projCount:1, spread:0, rarity:'mythic', icon:'shovel', hat:'tophat', hair:'black', skin:'#c8a8d8' },
  { name:'Tara', role:'Fighter', color:'#7b1fa2', hp:4200, speed:2.8, damage:440, range:300, reload:1.4, projSpeed:8, projCount:3, spread:0.2, rarity:'mythic', icon:'cards', hat:'hood', hair:'none', skin:'#d4a574' },
  { name:'Gene', role:'Support', color:'#00897b', hp:4200, speed:2.8, damage:1000, range:340, reload:1.6, projSpeed:7, projCount:1, spread:0, rarity:'mythic', icon:'lamp', hat:'none', hair:'none', skin:'#64b5f6' },
  { name:'Max', role:'Support', color:'#ffeb3b', hp:3800, speed:3.2, damage:360, range:320, reload:0.8, projSpeed:12, projCount:4, spread:0.15, rarity:'mythic', icon:'energy', hat:'helmet', hair:'yellow', skin:'#f0c8a0' },
  { name:'Mr.P', role:'Support', color:'#1565c0', hp:3800, speed:2.8, damage:900, range:340, reload:1.6, projSpeed:8, projCount:1, spread:0, rarity:'mythic', icon:'suitcase', hat:'tophat', hair:'none', skin:'#333' },
  { name:'Sprout', role:'Thrower', color:'#69f0ae', hp:3200, speed:2.8, damage:900, range:320, reload:1.8, projSpeed:6, projCount:1, spread:0, rarity:'mythic', icon:'seed', hat:'plant', hair:'none', skin:'#81c784' },
  { name:'Byron', role:'Healer', color:'#880e4f', hp:3200, speed:2.8, damage:400, range:380, reload:1.2, projSpeed:10, projCount:1, spread:0, rarity:'mythic', icon:'syringe', hat:'monocle', hair:'grey', skin:'#f0c8a0' },
  { name:'Squeak', role:'Thrower', color:'#84ffff', hp:3600, speed:2.8, damage:1000, range:320, reload:1.8, projSpeed:7, projCount:1, spread:0, rarity:'mythic', icon:'blob', hat:'none', hair:'none', skin:'#84ffff' },
  { name:'Ash', role:'Tank', color:'#616161', hp:6400, speed:2.6, damage:900, range:180, reload:1.6, projSpeed:0, projCount:1, spread:0, rarity:'mythic', icon:'broom', hat:'none', hair:'grey', skin:'#aaa' },
  { name:'Fang', role:'Assassin', color:'#ff5722', hp:4200, speed:2.8, damage:1200, range:200, reload:1.4, projSpeed:0, projCount:1, spread:0, rarity:'mythic', icon:'shoe', hat:'headband', hair:'black', skin:'#d4a574' },
  { name:'Eve', role:'Sharpshooter', color:'#ce93d8', hp:3200, speed:2.8, damage:400, range:360, reload:1.0, projSpeed:8, projCount:3, spread:0.2, rarity:'mythic', icon:'egg', hat:'alien', hair:'none', skin:'#ce93d8' },
  { name:'Janet', role:'Sharpshooter', color:'#ec407a', hp:3800, speed:2.8, damage:1000, range:360, reload:1.4, projSpeed:10, projCount:1, spread:0, rarity:'mythic', icon:'mic', hat:'none', hair:'blonde', skin:'#f0c8a0' },
  { name:'Otis', role:'Support', color:'#26c6da', hp:4000, speed:2.8, damage:480, range:280, reload:0.8, projSpeed:8, projCount:3, spread:0.2, rarity:'mythic', icon:'paint', hat:'beret', hair:'none', skin:'#26c6da' },
  { name:'Sam', role:'Fighter', color:'#ef5350', hp:5600, speed:2.6, damage:520, range:200, reload:1.2, projSpeed:8, projCount:4, spread:0.35, rarity:'mythic', icon:'knuckle', hat:'none', hair:'brown', skin:'#d4a574' },
  { name:'Gus', role:'Healer', color:'#b39ddb', hp:3400, speed:2.8, damage:800, range:300, reload:1.4, projSpeed:8, projCount:1, spread:0, rarity:'mythic', icon:'ghost', hat:'none', hair:'none', skin:'#e8e0f0' },
  { name:'Chester', role:'Fighter', color:'#ff8f00', hp:3800, speed:3.0, damage:800, range:300, reload:1.2, projSpeed:9, projCount:1, spread:0, rarity:'mythic', icon:'hat-trick', hat:'jester', hair:'red', skin:'#f0c8a0' },
  { name:'Gray', role:'Support', color:'#78909c', hp:3600, speed:2.8, damage:700, range:320, reload:1.4, projSpeed:8, projCount:1, spread:0, rarity:'mythic', icon:'portal', hat:'fedora', hair:'grey', skin:'#e0e0e0' },
  { name:'Mandy', role:'Sharpshooter', color:'#f48fb1', hp:3200, speed:2.8, damage:1300, range:400, reload:2.0, projSpeed:12, projCount:1, spread:0, rarity:'mythic', icon:'candy', hat:'bow', hair:'pink', skin:'#f0c8a0' },
  { name:'Maisie', role:'Sharpshooter', color:'#ffcc02', hp:3600, speed:2.8, damage:1000, range:360, reload:1.6, projSpeed:10, projCount:1, spread:0, rarity:'mythic', icon:'badge', hat:'police', hair:'brown', skin:'#f0c8a0' },
  { name:'Hank', role:'Tank', color:'#558b2f', hp:6200, speed:2.6, damage:300, range:240, reload:0.6, projSpeed:7, projCount:8, spread:0.6, rarity:'mythic', icon:'blowfish', hat:'none', hair:'none', skin:'#a5d6a7' },
  { name:'Pearl', role:'Fighter', color:'#ff7043', hp:4000, speed:2.8, damage:500, range:300, reload:1.0, projSpeed:9, projCount:3, spread:0.2, rarity:'mythic', icon:'flame', hat:'none', hair:'orange', skin:'#f0c8a0' },
  { name:'Larry', role:'Thrower', color:'#8d6e63', hp:3800, speed:2.6, damage:600, range:340, reload:1.6, projSpeed:6, projCount:2, spread:0.3, rarity:'mythic', icon:'bird', hat:'none', hair:'brown', skin:'#f0c8a0' },
  { name:'Angelo', role:'Sharpshooter', color:'#ab47bc', hp:3000, speed:2.8, damage:600, range:380, reload:1.2, projSpeed:11, projCount:1, spread:0, rarity:'mythic', icon:'bow', hat:'wings', hair:'white', skin:'#e8d0f0' },
  { name:'Berry', role:'Support', color:'#e91e63', hp:4200, speed:2.8, damage:700, range:280, reload:1.2, projSpeed:8, projCount:1, spread:0, rarity:'mythic', icon:'berry', hat:'leaf', hair:'pink', skin:'#f8bbd0' },
  { name:'Shade', role:'Assassin', color:'#37474f', hp:3800, speed:3.0, damage:900, range:200, reload:1.2, projSpeed:0, projCount:1, spread:0, rarity:'mythic', icon:'shadow', hat:'hood', hair:'none', skin:'#546e7a' },
  { name:'Moe', role:'Fighter', color:'#ffab40', hp:4600, speed:2.8, damage:850, range:260, reload:1.3, projSpeed:8, projCount:1, spread:0, rarity:'mythic', icon:'diner', hat:'chef', hair:'black', skin:'#d4a574' },

  // ===== LEGENDARY =====
  { name:'Spike', role:'Fighter', color:'#55efc4', hp:3200, speed:2.8, damage:560, range:320, reload:1.6, projSpeed:8, projCount:6, spread:0.9, rarity:'legendary', icon:'cactus', hat:'none', hair:'none', skin:'#55efc4' },
  { name:'Crow', role:'Assassin', color:'#212121', hp:3200, speed:3.2, damage:400, range:340, reload:1.2, projSpeed:10, projCount:3, spread:0.3, rarity:'legendary', icon:'dagger', hat:'none', hair:'none', skin:'#1a1a2e' },
  { name:'Leon', role:'Assassin', color:'#ff9800', hp:3600, speed:3.0, damage:500, range:300, reload:1.2, projSpeed:9, projCount:4, spread:0.25, rarity:'legendary', icon:'shuriken', hat:'chameleon', hair:'none', skin:'#a5d6a7' },
  { name:'Sandy', role:'Support', color:'#ffcc80', hp:4400, speed:2.8, damage:1000, range:240, reload:1.4, projSpeed:0, projCount:1, spread:0, rarity:'legendary', icon:'sand', hat:'none', hair:'sandy', skin:'#d4a574' },
  { name:'Amber', role:'Fighter', color:'#ff5722', hp:3800, speed:2.8, damage:280, range:260, reload:0.3, projSpeed:10, projCount:1, spread:0.05, rarity:'legendary', icon:'flame', hat:'none', hair:'fire', skin:'#f0c8a0' },
  { name:'Meg', role:'Tank', color:'#e040fb', hp:3400, speed:2.8, damage:300, range:300, reload:0.6, projSpeed:9, projCount:3, spread:0.15, rarity:'legendary', icon:'mech', hat:'glasses', hair:'purple', skin:'#f0c8a0' },
  { name:'Surge', role:'Fighter', color:'#2196f3', hp:4200, speed:2.6, damage:1200, range:300, reload:1.8, projSpeed:9, projCount:1, spread:0, rarity:'legendary', icon:'juice', hat:'visor', hair:'none', skin:'#64b5f6' },
  { name:'Chester', role:'Fighter', color:'#ff6f00', hp:3800, speed:3.0, damage:800, range:300, reload:1.2, projSpeed:9, projCount:1, spread:0, rarity:'legendary', icon:'jester', hat:'jester', hair:'red', skin:'#f0c8a0' },
  { name:'Willow', role:'Support', color:'#7c4dff', hp:3800, speed:2.8, damage:600, range:340, reload:1.4, projSpeed:8, projCount:1, spread:0, rarity:'legendary', icon:'puppet', hat:'none', hair:'purple', skin:'#d1c4e9' },
  { name:'Doug', role:'Healer', color:'#ff8a65', hp:4800, speed:2.6, damage:400, range:200, reload:0.8, projSpeed:0, projCount:1, spread:0, rarity:'legendary', icon:'hotdog', hat:'chef', hair:'none', skin:'#ffcc80' },
  { name:'Chuck', role:'Support', color:'#fdd835', hp:4200, speed:3.0, damage:700, range:300, reload:1.2, projSpeed:9, projCount:1, spread:0, rarity:'legendary', icon:'train', hat:'conductor', hair:'none', skin:'#fdd835' },
  { name:'Melodie', role:'Assassin', color:'#f06292', hp:3800, speed:3.0, damage:700, range:260, reload:1.0, projSpeed:9, projCount:1, spread:0, rarity:'legendary', icon:'note', hat:'headphones', hair:'pink', skin:'#f0c8a0' },
  { name:'Lily', role:'Assassin', color:'#1b5e20', hp:3600, speed:3.0, damage:1100, range:220, reload:1.6, projSpeed:0, projCount:1, spread:0, rarity:'legendary', icon:'thorn', hat:'none', hair:'green', skin:'#c8e6c9' },
  { name:'Clancy', role:'Fighter', color:'#0277bd', hp:4400, speed:2.8, damage:400, range:300, reload:1.0, projSpeed:9, projCount:4, spread:0.3, rarity:'legendary', icon:'crab', hat:'none', hair:'none', skin:'#0288d1' },
  { name:'Mico', role:'Assassin', color:'#6d4c41', hp:4000, speed:3.0, damage:900, range:200, reload:1.2, projSpeed:0, projCount:1, spread:0, rarity:'legendary', icon:'banana', hat:'none', hair:'brown', skin:'#8d6e63' },
  { name:'Kenji', role:'Assassin', color:'#b71c1c', hp:4400, speed:3.0, damage:1000, range:180, reload:1.4, projSpeed:0, projCount:1, spread:0, rarity:'legendary', icon:'katana', hat:'samurai', hair:'black', skin:'#f0c8a0' },
  { name:'Juju', role:'Support', color:'#4a148c', hp:3600, speed:2.8, damage:600, range:340, reload:1.4, projSpeed:8, projCount:1, spread:0, rarity:'legendary', icon:'curse', hat:'none', hair:'black', skin:'#7c4dff' },
  { name:'Draco', role:'Tank', color:'#c62828', hp:6000, speed:2.6, damage:600, range:240, reload:1.0, projSpeed:8, projCount:3, spread:0.3, rarity:'legendary', icon:'dragon', hat:'horns', hair:'none', skin:'#ef5350' },
  { name:'Buzz', role:'Assassin', color:'#ffc107', hp:4600, speed:2.8, damage:1000, range:160, reload:1.4, projSpeed:0, projCount:2, spread:0.3, rarity:'legendary', icon:'whistle', hat:'lifeguard', hair:'brown', skin:'#d4a574' },
  { name:'Lou', role:'Support', color:'#e3f2fd', hp:3800, speed:2.8, damage:420, range:320, reload:1.0, projSpeed:9, projCount:3, spread:0.2, rarity:'legendary', icon:'snowcone', hat:'none', hair:'none', skin:'#e3f2fd' },
  { name:'Ruffs', role:'Support', color:'#455a64', hp:3600, speed:2.8, damage:900, range:340, reload:1.6, projSpeed:9, projCount:2, spread:0.15, rarity:'legendary', icon:'badge', hat:'space', hair:'none', skin:'#78909c' },
  { name:'Belle', role:'Sharpshooter', color:'#d4a017', hp:3400, speed:2.8, damage:1100, range:380, reload:1.6, projSpeed:10, projCount:1, spread:0, rarity:'legendary', icon:'rifle', hat:'cowboy', hair:'grey', skin:'#f0c8a0' },
  { name:'Lola', role:'Fighter', color:'#ad1457', hp:3800, speed:2.8, damage:440, range:300, reload:1.0, projSpeed:9, projCount:4, spread:0.25, rarity:'legendary', icon:'star', hat:'scarf', hair:'black', skin:'#f0c8a0' },
  { name:'Gale', role:'Support', color:'#81d4fa', hp:4200, speed:2.8, damage:400, range:300, reload:1.2, projSpeed:8, projCount:5, spread:0.35, rarity:'legendary', icon:'snowblower', hat:'beanie', hair:'white', skin:'#f0c8a0' },
  { name:'Colette', role:'Fighter', color:'#ce93d8', hp:4000, speed:2.8, damage:600, range:300, reload:1.4, projSpeed:9, projCount:1, spread:0, rarity:'legendary', icon:'scrapbook', hat:'none', hair:'purple', skin:'#f0c8a0' },
  { name:'Kit', role:'Support', color:'#ffab91', hp:3200, speed:2.8, damage:500, range:280, reload:1.0, projSpeed:8, projCount:1, spread:0, rarity:'legendary', icon:'yarn', hat:'cat-ears', hair:'orange', skin:'#ffab91' },
];

// Rarity colors
const RARITY_COLORS = {
  'common': '#8e8e93',
  'rare': '#4fc3f7',
  'super-rare': '#66bb6a',
  'epic': '#ba68c8',
  'mythic': '#ef5350',
  'legendary': '#ffd54f'
};

if (typeof module !== 'undefined') module.exports = { BRAWLER_DATA, RARITY_COLORS };
