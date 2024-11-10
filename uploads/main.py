import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv

# Создание среды
env_name = "CartPole-v1"
env = gym.make(env_name, render_mode='human')  # Убрали new_step_api

# Обернем среду в DummyVecEnv для работы со Stable Baselines
env = DummyVecEnv([lambda: env])

# Создание и обучение модели
model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=10000)

episodes = 10

for episode in range(1, episodes + 1):
    obs = env.reset()  # Обновление для нового API
    done = False
    score = 0
    while not done:
        action, _ = model.predict(obs)  # Используем модель для получения действия
        obs, reward, done, info = env.step(action)
        score += reward
        env.render()  # Перемещаем render() после step
    print("Episode: {} Score: {}".format(episode, score))

env.close()
