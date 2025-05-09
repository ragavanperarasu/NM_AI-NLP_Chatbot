import csv
import json
import random

# Exchange rate: $1 = ₹83.00 (as of recent average)
USD_TO_INR = 83.00
COUNTRIES = ["India", "China", "America", "Germany", "Japan", "South Korea", "Vietnam"]

def clean_spec(text):
    prefix = "Make sure this fits by entering your model number. |"
    return text.replace(prefix, "").strip()

def is_valid_row(row):
    return all([
        row.get("Product Name"),
        row.get("Selling Price"),
        row.get("Category"),
        row.get("About Product")
    ])

def main():
    input_file = "amazon.csv"
    output_file = "Preprocessed_Products_1.txt"
    product_id = 1066

    with open(input_file, mode='r', encoding='utf-8') as csvfile, \
         open(output_file, mode='w', encoding='utf-8') as outfile:

        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                if not is_valid_row(row):
                    continue

                name = row["Product Name"].strip()
                price_dollar = float(row["Selling Price"].strip().replace("$", ""))
                price_rupee = round(price_dollar * USD_TO_INR)
                category = row["Category"].strip()
                made_in = random.choice(COUNTRIES)
                spec = clean_spec(row["About Product"].strip())

                product = {
                    "product_id": product_id,
                    "product_name": name,
                    "price": price_rupee,
                    "category": category,
                    "made_in": made_in,
                    "spec": spec
                }

                json.dump(product, outfile, indent=4)
                outfile.write(",\n")
                product_id += 1

            except Exception:
                continue  # Skip malformed rows

if __name__ == "__main__":
    main()
