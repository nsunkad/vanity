import sys
import csv


# All the reviews csv's start with ReviewId 0, but this is a problem because ReviewId is a primary key, and we want the primary key to be unique.
#     This script changes the ReviewIds to be unique

def main():
    if len(sys.argv) < 3:
        print("\nPlease run this script with one CSV file and the review_id you want to start with.\nUsage: python3 set-unique-review-ids.py <csv> <next_review_id>\n")
        return
    
    review_id = int(sys.argv[2])
    
    reviews_file = sys.argv[1]
    print('Processing ', reviews_file)
    
    
    # CODE CITATION: https://stackoverflow.com/questions/73493406/how-do-i-update-every-row-of-one-column-of-a-csv-with-python
    with open(reviews_file, newline='') as csv_input, open(reviews_file.replace('.csv', '-v2.csv'), 'w') as csv_output:
        reader = csv.reader(csv_input)
        writer = csv.writer(csv_output)

        # Header doesn't need extra processing
        header = next(reader)
        writer.writerow(header)

        for unnamed,author_id,rating,is_recommended,helpfulness,total_feedback_count,total_neg_feedback_count,total_pos_feedback_count,submission_time,review_text,review_title,skin_tone,eye_color,skin_type,hair_color,product_id,product_name,brand_name,price_usd in reader:
            writer.writerow([int(unnamed) + review_id,author_id,rating,is_recommended,helpfulness,total_feedback_count,total_neg_feedback_count,total_pos_feedback_count,submission_time,review_text,review_title,skin_tone,eye_color,skin_type,hair_color,product_id,product_name,brand_name,price_usd])
    
if __name__ == "__main__":
    main()
    print('Finished!')

# Example usage: python3 aggregate-reviews.py reviews/reviews_0-250.csv reviews/reviews_250-500.csv reviews/reviews_500-750.csv reviews/reviews_750-1250.csv reviews/reviews_1250-end.csv

# 1. python3 set-unique-review-ids.py reviews/reviews_250-500.csv 602130
# 2. python3 set-unique-review-ids.py reviews/reviews_500-750.csv 808855
# 3. python3 set-unique-review-ids.py reviews/reviews_750-1250.csv 925117
# 4. python3 set-unique-review-ids.py reviews/reviews_1250-end.csv 1044434