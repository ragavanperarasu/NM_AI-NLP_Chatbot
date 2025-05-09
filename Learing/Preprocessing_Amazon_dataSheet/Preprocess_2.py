import re

# Read from the input file
with open("Preprocessed_Products_1.txt", "r", encoding="utf-8") as file:
    content = file.read()

# Replace price values with commas like 129,99 -> 12999
# This regex finds price values with a comma: "price": 123,45
cleaned_content = re.sub(r'("price"\s*:\s*)(\d+),(\d+)', r'\1\2\3', content)

# Write the cleaned content to a new file
with open("Preprocessed_Products_2.txt", "w", encoding="utf-8") as file:
    file.write(cleaned_content)

