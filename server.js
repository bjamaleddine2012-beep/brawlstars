const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const port = process.env.PORT || 3001;

// Static file server
const mimeTypes = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json' };

const httpServer = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  // Don't serve node_modules or server.js
  if (url.includes('node_modules') || url === '/server.js' || url === '/package.json') {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const io = new Server(httpServer, { cors: { origin: '*' } });

// ============================================================
// GAME CONFIG
// ============================================================
const TILE = 40;
const MAP_COLS = 50, MAP_ROWS = 50;
const MAP_W = MAP_COLS * TILE, MAP_H = MAP_ROWS * TILE;
const TICK_RATE = 20; // 20 updates/sec
const TICK_MS = 1000 / TICK_RATE;

const BRAWLERS = [
  { name:'Shelly', role:'Fighter', color:'#e84393', hp:5600, speed:2.8, damage:420, range:280, reload:1.2, projSpeed:9, projCount:5, spread:0.45 },
  { name:'Colt', role:'Sharpshooter', color:'#0984e3', hp:3600, speed:3.0, damage:360, range:380, reload:1.0, projSpeed:12, projCount:6, spread:0.15 },
  { name:'Bull', role:'Tank', color:'#d63031', hp:7000, speed:2.6, damage:520, range:200, reload:1.4, projSpeed:8, projCount:5, spread:0.5 },
  { name:'Brock', role:'Sharpshooter', color:'#6c5ce7', hp:3200, speed:2.8, damage:1100, range:400, reload:1.8, projSpeed:10, projCount:1, spread:0 },
  { name:'Jessie', role:'Support', color:'#fdcb6e', hp:4200, speed:2.8, damage:900, range:320, reload:1.6, projSpeed:8, projCount:1, spread:0 },
  { name:'Nita', role:'Fighter', color:'#00b894', hp:5000, speed:2.8, damage:800, range:260, reload:1.3, projSpeed:8, projCount:1, spread:0 },
  { name:'Poco', role:'Healer', color:'#00cec9', hp:5000, speed:2.8, damage:700, range:300, reload:1.4, projSpeed:7, projCount:1, spread:0 },
  { name:'El Primo', role:'Tank', color:'#e17055', hp:8000, speed:2.7, damage:450, range:120, reload:0.6, projSpeed:0, projCount:4, spread:0.6 },
  { name:'Barley', role:'Thrower', color:'#a29bfe', hp:3400, speed:2.6, damage:800, range:340, reload:1.8, projSpeed:7, projCount:1, spread:0 },
  { name:'Spike', role:'Fighter', color:'#55efc4', hp:3200, speed:2.8, damage:560, range:320, reload:1.6, projSpeed:8, projCount:6, spread:0.9 }
];

// ============================================================
// ROOMS
// ============================================================
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return rooms.has(code) ? generateRoomCode() : code;
}

function createRoom(hostSocket, hostName, brawlerIdx, mode) {
  const code = generateRoomCode();
  const room = {
    code,
    mode,
    state: 'lobby', // lobby, countdown, playing, gameover
    host: hostSocket.id,
    players: new Map(),
    bots: [],
    bullets: [],
    powerups: [],
    walls: [], bushes: [], water: [], boxes: [],
    gameTimer: 150,
    tickInterval: null,
    countdownTimer: 0
  };

  room.players.set(hostSocket.id, {
    id: hostSocket.id,
    name: hostName,
    brawlerIdx,
    ready: true,
    x: 0, y: 0, w: 30, h: 30, vx: 0, vy: 0,
    hp: BRAWLERS[brawlerIdx].hp,
    maxHp: BRAWLERS[brawlerIdx].hp,
    speed: BRAWLERS[brawlerIdx].speed,
    damage: BRAWLERS[brawlerIdx].damage,
    range: BRAWLERS[brawlerIdx].range,
    reload: BRAWLERS[brawlerIdx].reload,
    projSpeed: BRAWLERS[brawlerIdx].projSpeed,
    projCount: BRAWLERS[brawlerIdx].projCount,
    spread: BRAWLERS[brawlerIdx].spread,
    color: BRAWLERS[brawlerIdx].color,
    ammo: 3, maxAmmo: 3, reloadTimer: 0,
    superCharge: 0, maxSuper: 100, superReady: false,
    alive: true, kills: 0, damageDealt: 0, powerLevel: 0,
    inputDx: 0, inputDy: 0, aimX: 0, aimY: 0, shooting: false,
    invincible: 0, flashTimer: 0
  });

  rooms.set(code, room);
  hostSocket.join(code);
  return room;
}

function generateMap(room) {
  room.walls = []; room.bushes = []; room.water = []; room.boxes = [];

  // Border
  for (let x = 0; x < MAP_COLS; x++) { room.walls.push({x:x*TILE,y:0,w:TILE,h:TILE}); room.walls.push({x:x*TILE,y:(MAP_ROWS-1)*TILE,w:TILE,h:TILE}); }
  for (let y = 0; y < MAP_ROWS; y++) { room.walls.push({x:0,y:y*TILE,w:TILE,h:TILE}); room.walls.push({x:(MAP_COLS-1)*TILE,y:y*TILE,w:TILE,h:TILE}); }

  // Wall structures
  const wallPatterns = [
    [[8,8],[8,9],[8,10],[9,8],[10,8]], [[15,5],[15,6],[15,7],[16,5],[17,5]],
    [[6,18],[6,19],[6,20],[7,20],[8,20]], [[20,15],[21,15],[22,15],[22,16],[22,17]],
    [[12,25],[13,25],[14,25],[12,26],[12,27]], [[30,10],[30,11],[30,12],[31,10],[32,10]],
    [[25,30],[25,31],[25,32],[26,30],[27,30]], [[35,20],[35,21],[36,20],[37,20],[37,21]],
    [[18,35],[19,35],[20,35],[18,36],[18,37]], [[40,8],[40,9],[41,8],[42,8],[42,9]],
    [[10,40],[11,40],[12,40],[10,41],[10,42]], [[38,38],[38,39],[39,38],[40,38],[40,39]]
  ];
  wallPatterns.forEach(pat => pat.forEach(([c,r]) => {
    if (c>0&&c<MAP_COLS-1&&r>0&&r<MAP_ROWS-1) room.walls.push({x:c*TILE,y:r*TILE,w:TILE,h:TILE});
  }));

  // Bushes
  const bushCenters = [[10,14],[20,8],[35,12],[8,30],[25,20],[40,25],[15,40],[30,35],[45,15],[5,45],[42,42],[20,45]];
  bushCenters.forEach(([bx,by]) => {
    for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
      const nx=bx+dx, ny=by+dy;
      if (nx>1&&nx<MAP_COLS-2&&ny>1&&ny<MAP_ROWS-2&&Math.random()<0.75) room.bushes.push({x:nx*TILE,y:ny*TILE,w:TILE,h:TILE});
    }
  });

  // Water
  const cx=MAP_COLS/2, cy=MAP_ROWS/2;
  [[cx,cy],[12,12],[38,38],[12,38],[38,12]].forEach(([wx,wy]) => {
    for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
      if (Math.abs(dx)+Math.abs(dy)<2) room.water.push({x:(wx+dx)*TILE,y:(wy+dy)*TILE,w:TILE,h:TILE});
    }
  });

  // Boxes
  for (let i = 0; i < 60; i++) {
    const bx = (2+Math.floor(Math.random()*(MAP_COLS-4)))*TILE;
    const by = (2+Math.floor(Math.random()*(MAP_ROWS-4)))*TILE;
    if (!room.walls.some(w=>w.x===bx&&w.y===by) && !room.water.some(w=>w.x===bx&&w.y===by)) {
      room.boxes.push({x:bx, y:by, w:TILE, h:TILE, hp:2000, id: Math.random().toString(36).slice(2,8)});
    }
  }
}

function getSpawnPoint(room) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const sx = (3 + Math.random() * (MAP_COLS-6)) * TILE;
    const sy = (3 + Math.random() * (MAP_ROWS-6)) * TILE;
    const blocked = room.walls.some(w => rectOverlap(sx,sy,30,30,w.x,w.y,w.w,w.h)) ||
                    room.water.some(w => rectOverlap(sx,sy,30,30,w.x,w.y,w.w,w.h));
    if (!blocked) return { x: sx, y: sy };
  }
  return { x: 200, y: 200 };
}

function rectOverlap(x1,y1,w1,h1,x2,y2,w2,h2) {
  return x1<x2+w2 && x1+w1>x2 && y1<y2+h2 && y1+h1>y2;
}

function dist(a,b) { return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }

// ============================================================
// BOT AI (server-side)
// ============================================================
function createBot(room, brawlerIdx) {
  const b = BRAWLERS[brawlerIdx];
  const sp = getSpawnPoint(room);
  return {
    id: 'bot_' + Math.random().toString(36).slice(2,8),
    name: b.name + ' Bot',
    brawlerIdx, color: b.color,
    x: sp.x, y: sp.y, w: 30, h: 30, vx: 0, vy: 0,
    hp: b.hp, maxHp: b.hp, speed: b.speed,
    damage: b.damage, range: b.range, reload: b.reload,
    projSpeed: b.projSpeed, projCount: b.projCount, spread: b.spread,
    ammo: 3, maxAmmo: 3, reloadTimer: 0,
    superCharge: 0, maxSuper: 100, superReady: false,
    alive: true, kills: 0, damageDealt: 0, powerLevel: 0,
    invincible: 0, flashTimer: 0, isBot: true,
    aiTimer: 0, aiState: 'wander', targetX: sp.x, targetY: sp.y,
    aiShootTimer: 0, difficulty: 0.4 + Math.random() * 0.5
  };
}

function updateBotAI(bot, allEntities, room, dt) {
  if (!bot.alive) return;
  bot.aiTimer -= dt;
  bot.aiShootTimer -= dt;

  let nearest = null, nearDist = Infinity;
  allEntities.filter(e => e !== bot && e.alive).forEach(e => {
    const d = dist(bot, e);
    if (d < nearDist) { nearDist = d; nearest = e; }
  });

  if (bot.aiTimer <= 0) {
    bot.aiTimer = 1 + Math.random() * 2;
    if (nearest && nearDist < 400) {
      bot.aiState = nearDist < bot.range * 0.8 && bot.hp > bot.maxHp * 0.3 ? 'attack' : 'chase';
      if (bot.hp < bot.maxHp * 0.25) bot.aiState = 'flee';
    } else {
      bot.aiState = 'wander';
      bot.targetX = (5+Math.random()*(MAP_COLS-10))*TILE;
      bot.targetY = (5+Math.random()*(MAP_ROWS-10))*TILE;
    }
  }

  let mx = 0, my = 0;
  if (bot.aiState === 'wander') {
    const a = Math.atan2(bot.targetY-bot.y, bot.targetX-bot.x);
    mx = Math.cos(a); my = Math.sin(a);
  } else if (bot.aiState === 'chase' && nearest) {
    const a = Math.atan2(nearest.y-bot.y, nearest.x-bot.x);
    mx = Math.cos(a); my = Math.sin(a);
  } else if (bot.aiState === 'flee' && nearest) {
    const a = Math.atan2(bot.y-nearest.y, bot.x-nearest.x);
    mx = Math.cos(a); my = Math.sin(a);
  } else if (bot.aiState === 'attack' && nearest) {
    const a = Math.atan2(nearest.y-bot.y, nearest.x-bot.x) + Math.PI/2 * (Math.random()<0.5?1:-1);
    mx = Math.cos(a)*0.5; my = Math.sin(a)*0.5;
  }

  bot.vx = mx * bot.speed;
  bot.vy = my * bot.speed;

  // Shoot
  if (nearest && nearDist < bot.range * 1.1 && bot.aiShootTimer <= 0 && bot.ammo >= 1) {
    if (Math.random() < bot.difficulty) {
      serverShoot(room, bot, nearest.x + nearest.w/2 + (Math.random()-0.5)*30, nearest.y + nearest.h/2 + (Math.random()-0.5)*30);
    }
    bot.aiShootTimer = bot.reload * (1 + (1-bot.difficulty)*0.5);
  }

  // Super
  if (bot.superReady && nearest && nearDist < 300 && Math.random() < 0.02) {
    serverUseSuper(room, bot, nearest.x, nearest.y);
  }
}

// ============================================================
// SERVER GAME LOGIC
// ============================================================
function serverShoot(room, entity, tx, ty) {
  if (entity.ammo < 1 || !entity.alive) return;
  entity.ammo = Math.max(0, entity.ammo - 1);
  entity.reloadTimer = entity.reload;
  const ecx = entity.x + entity.w/2, ecy = entity.y + entity.h/2;
  const angle = Math.atan2(ty - ecy, tx - ecx);

  if (entity.projCount === 1) {
    room.bullets.push({ x:ecx, y:ecy, vx:Math.cos(angle)*entity.projSpeed, vy:Math.sin(angle)*entity.projSpeed, damage:entity.damage, ownerId:entity.id, range:entity.range, traveled:0, r:5, color:entity.color, isSuper:false });
  } else {
    for (let i=0;i<entity.projCount;i++) {
      const a = angle + (i - (entity.projCount-1)/2) * entity.spread / entity.projCount + (Math.random()-0.5)*0.08;
      room.bullets.push({ x:ecx, y:ecy, vx:Math.cos(a)*entity.projSpeed, vy:Math.sin(a)*entity.projSpeed, damage:entity.damage, ownerId:entity.id, range:entity.range, traveled:0, r:4, color:entity.color, isSuper:false });
    }
  }

  io.to(room.code).emit('shoot', { id: entity.id, x: ecx, y: ecy, angle, color: entity.color });
}

function serverUseSuper(room, entity, tx, ty) {
  if (!entity.superReady || !entity.alive) return;
  entity.superCharge = 0;
  entity.superReady = false;
  const ecx = entity.x + entity.w/2, ecy = entity.y + entity.h/2;
  const angle = Math.atan2(ty - ecy, tx - ecx);
  const b = BRAWLERS[entity.brawlerIdx];

  if (b.role === 'Tank') {
    entity.vx = Math.cos(angle)*8; entity.vy = Math.sin(angle)*8;
    entity.invincible = 0.8;
  } else if (b.role === 'Sharpshooter') {
    for (let i=0;i<12;i++) {
      const a = angle + (Math.random()-0.5)*0.3;
      room.bullets.push({x:ecx,y:ecy,vx:Math.cos(a)*12,vy:Math.sin(a)*12,damage:entity.damage*1.5,ownerId:entity.id,range:500,traveled:0,r:6,color:'#ffaa00',isSuper:true});
    }
  } else if (b.role === 'Healer') {
    entity.hp = Math.min(entity.maxHp, entity.hp + entity.maxHp * 0.35);
  } else {
    for (let i=0;i<16;i++) {
      const a = (Math.PI*2/16)*i;
      room.bullets.push({x:ecx,y:ecy,vx:Math.cos(a)*8,vy:Math.sin(a)*8,damage:entity.damage*2,ownerId:entity.id,range:250,traveled:0,r:7,color:'#ffaa00',isSuper:true});
    }
  }

  io.to(room.code).emit('super', { id: entity.id, x: ecx, y: ecy, angle });
}

function serverDealDamage(room, target, amount, attacker) {
  if (!target.alive || target.invincible > 0) return;
  target.hp -= amount;
  target.flashTimer = 0.12;

  if (attacker) {
    attacker.damageDealt += amount;
    attacker.superCharge = Math.min(attacker.maxSuper, attacker.superCharge + amount/50);
    if (attacker.superCharge >= attacker.maxSuper) attacker.superReady = true;
  }

  io.to(room.code).emit('damage', { targetId: target.id, amount: Math.round(amount), hp: target.hp, attackerId: attacker ? attacker.id : null });

  if (target.hp <= 0) {
    target.alive = false;
    if (attacker) attacker.kills++;
    io.to(room.code).emit('kill', { killerId: attacker ? attacker.id : null, killerName: attacker ? attacker.name : '?', victimId: target.id, victimName: target.name });

    // Drop powerup
    if (Math.random() < 0.5) {
      const pu = { x:target.x, y:target.y, w:20, h:20, type:'power', id: Math.random().toString(36).slice(2,8), bobTimer:0 };
      room.powerups.push(pu);
    }

    checkGameOver(room);
  }
}

function checkGameOver(room) {
  const alivePlayers = [...room.players.values()].filter(p => p.alive);
  const aliveBots = room.bots.filter(b => b.alive);
  const totalAlive = alivePlayers.length + aliveBots.length;

  if (totalAlive <= 1) {
    room.state = 'gameover';
    const winner = alivePlayers[0] || aliveBots[0] || null;

    // Build rankings
    const allEntities = [...room.players.values(), ...room.bots];
    const rankings = allEntities.sort((a,b) => {
      if (a.alive && !b.alive) return -1;
      if (!a.alive && b.alive) return 1;
      return b.kills - a.kills;
    });

    io.to(room.code).emit('gameOver', {
      winnerId: winner ? winner.id : null,
      winnerName: winner ? winner.name : 'Nobody',
      rankings: rankings.map((e,i) => ({ id:e.id, name:e.name, kills:e.kills, damage:Math.round(e.damageDealt), rank:i+1, alive:e.alive }))
    });

    clearInterval(room.tickInterval);
    // Clean up room after 10s
    setTimeout(() => rooms.delete(room.code), 10000);
  }
}

function serverTick(room) {
  if (room.state !== 'playing') return;
  const dt = TICK_MS / 1000;

  room.gameTimer -= dt;
  if (room.gameTimer <= 0) { room.gameTimer = 0; room.state = 'gameover'; checkGameOver(room); return; }

  const allEntities = [...room.players.values(), ...room.bots];

  // Update players based on input
  room.players.forEach(p => {
    if (!p.alive) return;
    p.invincible = Math.max(0, p.invincible - dt);
    p.flashTimer = Math.max(0, p.flashTimer - dt);

    // Reload
    if (p.ammo < p.maxAmmo) {
      p.reloadTimer -= dt;
      if (p.reloadTimer <= 0) { p.ammo = Math.min(p.maxAmmo, p.ammo + 1); p.reloadTimer = p.reload; }
    }

    // Movement from input
    p.vx = p.inputDx * p.speed;
    p.vy = p.inputDy * p.speed;

    moveEntity(room, p);

    // Shooting
    if (p.shooting && p.ammo >= 1) {
      serverShoot(room, p, p.aimX, p.aimY);
    }
  });

  // Update bots
  room.bots.forEach(bot => {
    if (!bot.alive) return;
    bot.invincible = Math.max(0, bot.invincible - dt);
    bot.flashTimer = Math.max(0, bot.flashTimer - dt);
    if (bot.ammo < bot.maxAmmo) {
      bot.reloadTimer -= dt;
      if (bot.reloadTimer <= 0) { bot.ammo = Math.min(bot.maxAmmo, bot.ammo + 1); bot.reloadTimer = bot.reload; }
    }
    updateBotAI(bot, allEntities, room, dt);
    moveEntity(room, bot);
  });

  // Update bullets
  room.bullets = room.bullets.filter(b => {
    b.x += b.vx; b.y += b.vy;
    b.traveled += Math.sqrt(b.vx**2 + b.vy**2);
    if (b.traveled > b.range) return false;

    // Hit walls
    if (room.walls.some(w => rectOverlap(b.x-b.r,b.y-b.r,b.r*2,b.r*2,w.x,w.y,w.w,w.h))) return false;

    // Hit boxes
    for (let i=room.boxes.length-1;i>=0;i--) {
      if (room.boxes[i].hp>0 && rectOverlap(b.x-b.r,b.y-b.r,b.r*2,b.r*2,room.boxes[i].x,room.boxes[i].y,room.boxes[i].w,room.boxes[i].h)) {
        room.boxes[i].hp -= b.damage;
        if (room.boxes[i].hp <= 0) {
          io.to(room.code).emit('boxDestroyed', { id: room.boxes[i].id });
          if (Math.random()<0.5) {
            const pu = {x:room.boxes[i].x,y:room.boxes[i].y,w:20,h:20,type:Math.random()<0.5?'power':'heal',id:Math.random().toString(36).slice(2,8),bobTimer:0};
            room.powerups.push(pu);
            io.to(room.code).emit('powerupSpawn', pu);
          }
          room.boxes.splice(i,1);
        }
        return false;
      }
    }

    // Hit entities
    const attacker = allEntities.find(e => e.id === b.ownerId);
    for (const e of allEntities) {
      if (e.id === b.ownerId || !e.alive || e.invincible > 0) continue;
      if (rectOverlap(b.x-b.r,b.y-b.r,b.r*2,b.r*2,e.x,e.y,e.w,e.h)) {
        serverDealDamage(room, e, b.damage, attacker);
        if (!b.isSuper) return false;
      }
    }
    return true;
  });

  // Powerup pickup
  room.powerups = room.powerups.filter(pu => {
    for (const e of allEntities) {
      if (!e.alive) continue;
      if (rectOverlap(e.x,e.y,e.w,e.h,pu.x,pu.y,pu.w,pu.h)) {
        if (pu.type === 'power') { e.powerLevel++; e.damage = BRAWLERS[e.brawlerIdx].damage * (1 + e.powerLevel * 0.1); }
        else if (pu.type === 'heal') { e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.3); }
        else if (pu.type === 'speed') { e.speed = Math.min(5, e.speed + 0.3); }
        io.to(room.code).emit('powerupCollected', { puId: pu.id, playerId: e.id, type: pu.type });
        return false;
      }
    }
    return true;
  });

  // Spawn powerups
  if (Math.random() < 0.003 * dt * TICK_RATE && room.powerups.length < 25) {
    const sp = getSpawnPoint(room);
    const types = ['power','heal','speed'];
    const pu = { x:sp.x, y:sp.y, w:20, h:20, type:types[Math.floor(Math.random()*types.length)], id:Math.random().toString(36).slice(2,8), bobTimer:0 };
    room.powerups.push(pu);
    io.to(room.code).emit('powerupSpawn', pu);
  }

  // Send state to all players
  const aliveCount = allEntities.filter(e => e.alive).length;
  const state = {
    timer: room.gameTimer,
    aliveCount,
    players: [...room.players.values()].map(p => ({
      id:p.id, name:p.name, x:p.x, y:p.y, hp:p.hp, maxHp:p.maxHp, alive:p.alive,
      color:p.color, brawlerIdx:p.brawlerIdx, powerLevel:p.powerLevel,
      ammo:p.ammo, maxAmmo:p.maxAmmo, superCharge:p.superCharge, maxSuper:p.maxSuper, superReady:p.superReady,
      invincible:p.invincible, flashTimer:p.flashTimer, kills:p.kills
    })),
    bots: room.bots.map(b => ({
      id:b.id, name:b.name, x:b.x, y:b.y, hp:b.hp, maxHp:b.maxHp, alive:b.alive,
      color:b.color, brawlerIdx:b.brawlerIdx, powerLevel:b.powerLevel,
      invincible:b.invincible, flashTimer:b.flashTimer, kills:b.kills
    })),
    bullets: room.bullets.map(b => ({x:b.x,y:b.y,r:b.r,color:b.color,isSuper:b.isSuper})),
    powerups: room.powerups.map(p => ({x:p.x,y:p.y,type:p.type,id:p.id}))
  };

  io.to(room.code).emit('state', state);
}

function moveEntity(room, e) {
  let nx = e.x + e.vx, ny = e.y + e.vy;
  // Water slow
  if (room.water.some(w => rectOverlap(nx,ny,e.w,e.h,w.x,w.y,w.w,w.h))) {
    nx = e.x + e.vx * 0.4;
    ny = e.y + e.vy * 0.4;
  }
  const solids = [...room.walls, ...room.boxes.filter(b=>b.hp>0)];
  let canX = true, canY = true;
  solids.forEach(w => {
    if (rectOverlap(nx,e.y,e.w,e.h,w.x,w.y,w.w,w.h)) canX = false;
    if (rectOverlap(e.x,ny,e.w,e.h,w.x,w.y,w.w,w.h)) canY = false;
  });
  if (canX) e.x = nx;
  if (canY) e.y = ny;
  e.x = Math.max(TILE, Math.min(MAP_W - TILE - e.w, e.x));
  e.y = Math.max(TILE, Math.min(MAP_H - TILE - e.h, e.y));
  e.vx *= 0.8; e.vy *= 0.8;
}

function startGame(room) {
  generateMap(room);

  // Spawn players
  room.players.forEach(p => {
    const sp = getSpawnPoint(room);
    const b = BRAWLERS[p.brawlerIdx];
    p.x = sp.x; p.y = sp.y;
    p.hp = b.hp; p.maxHp = b.hp; p.speed = b.speed;
    p.damage = b.damage; p.range = b.range; p.reload = b.reload;
    p.projSpeed = b.projSpeed; p.projCount = b.projCount; p.spread = b.spread;
    p.ammo = 3; p.reloadTimer = 0; p.superCharge = 0; p.superReady = false;
    p.alive = true; p.kills = 0; p.damageDealt = 0; p.powerLevel = 0;
    p.invincible = 2; // Spawn protection
  });

  // Fill with bots to reach 10 players
  room.bots = [];
  const botsNeeded = Math.max(0, 10 - room.players.size);
  for (let i = 0; i < botsNeeded; i++) {
    room.bots.push(createBot(room, Math.floor(Math.random() * BRAWLERS.length)));
  }

  // Spawn powerups
  room.powerups = [];
  for (let i = 0; i < 15; i++) {
    const sp = getSpawnPoint(room);
    const types = ['power','heal','speed'];
    room.powerups.push({ x:sp.x, y:sp.y, w:20, h:20, type:types[Math.floor(Math.random()*types.length)], id:Math.random().toString(36).slice(2,8), bobTimer:0 });
  }

  room.bullets = [];
  room.gameTimer = 150;

  // Send map data
  io.to(room.code).emit('gameStart', {
    walls: room.walls, bushes: room.bushes, water: room.water,
    boxes: room.boxes.map(b => ({x:b.x,y:b.y,w:b.w,h:b.h,hp:b.hp,id:b.id})),
    powerups: room.powerups,
    players: [...room.players.values()].map(p => ({id:p.id,name:p.name,x:p.x,y:p.y,brawlerIdx:p.brawlerIdx,color:p.color,hp:p.hp,maxHp:p.maxHp})),
    bots: room.bots.map(b => ({id:b.id,name:b.name,x:b.x,y:b.y,brawlerIdx:b.brawlerIdx,color:b.color,hp:b.hp,maxHp:b.maxHp}))
  });

  // Countdown then start
  room.state = 'countdown';
  let count = 3;
  io.to(room.code).emit('countdown', count);
  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      io.to(room.code).emit('countdown', count);
    } else if (count === 0) {
      io.to(room.code).emit('countdown', 0); // GO!
    } else {
      clearInterval(countInterval);
      room.state = 'playing';
      room.tickInterval = setInterval(() => serverTick(room), TICK_MS);
    }
  }, 800);
}

// ============================================================
// SOCKET HANDLERS
// ============================================================
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  let currentRoom = null;

  socket.on('createRoom', ({ name, brawlerIdx, mode }) => {
    const room = createRoom(socket, name || 'Player', brawlerIdx || 0, mode || 'showdown');
    currentRoom = room.code;
    socket.emit('roomCreated', { code: room.code, playerId: socket.id });
    broadcastLobby(room);
    console.log(`Room ${room.code} created by ${name}`);
  });

  socket.on('joinRoom', ({ code, name, brawlerIdx }) => {
    const room = rooms.get(code);
    if (!room) { socket.emit('joinError', 'Room not found'); return; }
    if (room.state !== 'lobby') { socket.emit('joinError', 'Game already in progress'); return; }
    if (room.players.size >= 10) { socket.emit('joinError', 'Room is full'); return; }

    const b = BRAWLERS[brawlerIdx || 0];
    room.players.set(socket.id, {
      id: socket.id, name: name || 'Player', brawlerIdx: brawlerIdx || 0, ready: false,
      x: 0, y: 0, w: 30, h: 30, vx: 0, vy: 0,
      hp: b.hp, maxHp: b.hp, speed: b.speed,
      damage: b.damage, range: b.range, reload: b.reload,
      projSpeed: b.projSpeed, projCount: b.projCount, spread: b.spread,
      color: b.color,
      ammo: 3, maxAmmo: 3, reloadTimer: 0,
      superCharge: 0, maxSuper: 100, superReady: false,
      alive: true, kills: 0, damageDealt: 0, powerLevel: 0,
      inputDx: 0, inputDy: 0, aimX: 0, aimY: 0, shooting: false,
      invincible: 0, flashTimer: 0
    });

    socket.join(code);
    currentRoom = code;
    socket.emit('roomJoined', { code, playerId: socket.id, host: room.host });
    broadcastLobby(room);
    console.log(`${name} joined room ${code}`);
  });

  socket.on('changeBrawler', ({ brawlerIdx }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    const p = room.players.get(socket.id);
    if (!p) return;
    p.brawlerIdx = brawlerIdx;
    const b = BRAWLERS[brawlerIdx];
    p.hp = b.hp; p.maxHp = b.hp; p.speed = b.speed;
    p.damage = b.damage; p.range = b.range; p.reload = b.reload;
    p.projSpeed = b.projSpeed; p.projCount = b.projCount; p.spread = b.spread;
    p.color = b.color;
    broadcastLobby(room);
  });

  socket.on('ready', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    const p = room.players.get(socket.id);
    if (p) p.ready = !p.ready;
    broadcastLobby(room);
  });

  socket.on('startGame', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.host !== socket.id) return;
    if (room.state !== 'lobby') return;
    startGame(room);
  });

  // In-game inputs
  socket.on('input', ({ dx, dy, aimX, aimY, shooting }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.state !== 'playing') return;
    const p = room.players.get(socket.id);
    if (!p || !p.alive) return;
    p.inputDx = dx || 0;
    p.inputDy = dy || 0;
    p.aimX = aimX || 0;
    p.aimY = aimY || 0;
    p.shooting = !!shooting;
  });

  socket.on('useSuper', ({ tx, ty }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.state !== 'playing') return;
    const p = room.players.get(socket.id);
    if (!p) return;
    serverUseSuper(room, p, tx, ty);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const p = room.players.get(socket.id);
    if (p) p.alive = false;
    room.players.delete(socket.id);

    if (room.players.size === 0) {
      clearInterval(room.tickInterval);
      rooms.delete(currentRoom);
      console.log(`Room ${currentRoom} deleted (empty)`);
    } else {
      // Transfer host
      if (room.host === socket.id) {
        room.host = room.players.keys().next().value;
        io.to(currentRoom).emit('hostChanged', room.host);
      }
      broadcastLobby(room);
      if (room.state === 'playing') checkGameOver(room);
    }
  });

  // Chat
  socket.on('chat', (msg) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    const p = room.players.get(socket.id);
    const name = p ? p.name : 'Unknown';
    io.to(currentRoom).emit('chat', { name, msg: String(msg).slice(0, 200) });
  });
});

function broadcastLobby(room) {
  const lobbyData = {
    code: room.code,
    host: room.host,
    mode: room.mode,
    players: [...room.players.values()].map(p => ({
      id: p.id, name: p.name, brawlerIdx: p.brawlerIdx, ready: p.ready,
      color: BRAWLERS[p.brawlerIdx].color, brawlerName: BRAWLERS[p.brawlerIdx].name
    }))
  };
  io.to(room.code).emit('lobbyUpdate', lobbyData);
}

httpServer.listen(port, () => {
  console.log(`Brawl Zone server running on http://localhost:${port}`);
  console.log('Waiting for players...');
});
