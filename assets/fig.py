import numpy as np
import matplotlib.pyplot as plt

x = np.arange(255) - 127
y = np.sin(19 * np.sin(97 * x) + 47 * np.sin(31 * np.sin(23 * x)))
x = x / 127

plt.title("curve")
plt.grid()
plt.xlim(-1, 1)
plt.ylim(-1.05, +1.05)
plt.plot(x, y)
plt.show()
