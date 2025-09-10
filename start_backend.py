import subprocess
import sys
import os

# Change to backend directory
os.chdir('backend')

# Run the server
try:
    subprocess.run([sys.executable, 'main.py'], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error running server: {e}")
except KeyboardInterrupt:
    print("\nServer stopped by user")
