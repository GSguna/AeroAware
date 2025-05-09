import pandas as pd
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "data")

distance_lookup = pd.read_csv(os.path.join(data_dir, "distance_lookup.csv"))
duration_lookup = pd.read_csv(os.path.join(data_dir, "duration_lookup.csv"))
