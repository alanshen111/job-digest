"""
Adds a keyword to the keywords.json file in alphabetical order.
Returns an error if the keyword already exists.
"""

import json
import os

file_path = os.path.join("dist", "keywords.json")
types = ["languages", "frameworks", "technologies", "concepts"]

### Parameters ###
type = 0 # 0,1,2,3
keyword = "Solidity"
##################

try:
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
except (FileNotFoundError, json.JSONDecodeError):
    print("Error: Unable to read keywords.json")
    exit(1)

if types[type] not in data:
    print(f"Error: '{types[type]}' is not a valid category.")
    exit(1)

YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"

if any(k.lower() == keyword.lower() for k in data[types[type]]):
    print(f"{YELLOW}Warning: '{keyword}' already exists in '{types[type]}'.{RESET}")
else:
    data[types[type]].append(keyword)
    data[types[type]] = sorted(data[types[type]], key=str.casefold)
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)
    print(f"{GREEN}Success: '{keyword}' added to '{types[type]}' and sorted.{RESET}")
