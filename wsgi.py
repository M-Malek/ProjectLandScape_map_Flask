import os
import sys

from main import create_app

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


project = create_app()

if __name__ == "__main__":
    project.run()
