import * as THREE from 'three';

function createEnemy() {
  const enemy = new THREE.Mesh(
    new THREE.CapsuleGeometry(1, 2, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff4444 })
  );

  enemy.position.set(
    (Math.random() - 0.5) * 500,
    2,
    (Math.random() - 0.5) * 500
  );

  enemy.userData.health = 100;

  enemy.castShadow = true;

  enemyGroup.push(enemy);
  scene.add(enemy);
}

for (let i = 0; i < 25; i++) {
  createEnemy();
}

function animateEnemies() {
  enemyGroup.forEach(enemy => {
    const dir = new THREE.Vector3()
      .subVectors(camera.position, enemy.position)
      .normalize();

    enemy.position.add(dir.multiplyScalar(0.03));

    if (enemy.position.distanceTo(camera.position) < 2) {
      player.health -= 0.05;
      updateHUD();

      if (player.health <= 0) {
        document.getElementById('message').innerText = 'You Were Eliminated';
        document.getElementById('message').style.display = 'block';
      }
    }
  });
}

function updateBullets() {
  bullets.forEach((bullet, i) => {
    bullet.position.add(bullet.userData.velocity);

    enemyGroup.forEach((enemy, ei) => {
      if (bullet.position.distanceTo(enemy.position) < 1.5) {
        enemy.userData.health -= 50;

        scene.remove(bullet);
        bullets.splice(i, 1);

        if (enemy.userData.health <= 0) {
          scene.remove(enemy);
          enemyGroup.splice(ei, 1);

          document.getElementById('players').innerText =
            `Players: ${enemyGroup.length}`;
        }
      }
    });
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function gameLoop() {
  requestAnimationFrame(gameLoop);

  movePlayer();
  animateEnemies();
  updateBullets();

  renderer.render(scene, camera);
}

updateHUD();
gameLoop();
