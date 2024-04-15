import sys
import pandas as pd

size = 100
products_seen = set()

def main():
    # Processes one or more input reviews csv files and spits out a trimmed reviews csv file with 10-20 reviews per product
    if len(sys.argv) < 2:
        print("\nPlease run this script with at least one CSV file.\nUsage: python3 aggregate-reviews.py <csv-1> <csv-2> ... <csv-n>\n")
        return
        
    flag = 1
    
    # Batch process the reviews data
    for i in range(1, len(sys.argv)):
        print('Processing ', sys.argv[i])
        reviews_file = sys.argv[i]
        for chunk in pd.read_csv(reviews_file, chunksize=size, engine='c'):
            # Drop every column except reviewid, rating, text, title, date, productid
            chunk = chunk.drop(columns=['author_id','is_recommended','helpfulness','total_feedback_count','total_neg_feedback_count','total_pos_feedback_count','skin_tone','eye_color','skin_type','hair_color','product_name','brand_name','price_usd'])
            # Rename columns to fit reviews entity
            chunk.rename(columns={'Unnamed: 0':'ReviewId', 'rating':'Rating', 'review_text':'Text', 'review_title':'Title', 'submission_time':'Date', 'product_id':'ProductId'}, inplace=True)

            row = chunk.iloc[0]
            if row['ProductId'] not in products_seen:
                chunk = chunk.head(10)
                products_seen.add(row['ProductId'])
                if flag == 1:
                    chunk.to_csv("aggregate_reviews.csv", encoding='utf-8', index=False)
                    flag = 0
                else:
                    chunk.to_csv('aggregate_reviews.csv', mode='a', index=False, header=False)
            else:
                continue

if __name__ == "__main__":
    main()
    print('Finished!')

# Example usage: python3 aggregate-reviews.py reviews-final/reviews_0-250.csv reviews-final/reviews_250-500-v2.csv reviews-final/reviews_500-750-v2.csv reviews-final/reviews_750-1250-v2.csv reviews-final/reviews_1250-end-v2.csv